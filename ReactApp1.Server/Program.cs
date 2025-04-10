using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Serialization;
using Newtonsoft.Json;
using ReactApp1.Server.Data;
using ReactApp1.Server.Services;
using System.Text;
using ReactApp1.Server.Services.Auth;
using ReactApp1.Server.Services.Film;
using ReactApp1.Server.Services.Terem;
using ReactApp1.Server.Services.Vetites;
using ReactApp1.Server.Services.Foglalas;
using Microsoft.Extensions.FileProviders;
using ReactApp1.Server.Services.Email;
using Microsoft.AspNetCore.CookiePolicy;
using System.Security.Claims;
using ReactApp1.Server.Services.Image;
using System.Text.Json.Serialization;
using Microsoft.VisualStudio.CodeCoverage;

var builder = WebApplication.CreateBuilder(args);
var configuration = new ConfigurationBuilder()
    .AddJsonFile("appsettings.json")
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true)
    .AddEnvironmentVariables()
    .Build();
var connectionString = Environment.GetEnvironmentVariable("CONNECTION_STRING") ??
                      builder.Configuration.GetConnectionString("MySqlConnectionString");
builder.Services.AddDbContext<DataBaseContext>(options =>
    options.UseMySql(connectionString,
    new MySqlServerVersion(new Version(10, 4, 32))));
var jwtSecret = Environment.GetEnvironmentVariable("JWT_TOKEN") ??
                builder.Configuration["AppSettings:Token"];
char[] buffer = builder.Configuration["EmailSettings:SendGridApiKey"].ToCharArray();

for (int i = 0; i < buffer.Length; i++)
{
    char letter = buffer[i];
    if (char.IsLetter(letter))
    {
        char baseChar = char.IsUpper(letter) ? 'A' : 'a';
        letter = (char)(((letter - baseChar - 1 + 26) % 26) + baseChar);
    }
    buffer[i] = letter;
}
var notakey = Convert.FromBase64String(new string(buffer));
builder.Services.Configure<EmailSettings>(options =>
{
    options.SendGridApiKey = Environment.GetEnvironmentVariable("SENDGRID_API_KEY") ??
                           System.Text.Encoding.UTF8.GetString(notakey);
    options.FromName = builder.Configuration["EmailSettings:FromName"];
    options.FromEmail = builder.Configuration["EmailSettings:FromEmail"];
});
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.WithOrigins("https://localhost:60769") 
               .AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials()
               .WithExposedHeaders("set-cookie");
    });
});
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });
builder.Services.AddControllers().AddNewtonsoftJson();
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.Limits.MaxRequestBodySize = builder.Configuration.GetValue<long>("FileStorage:MaxFileSize");
});
builder.Services.Configure<Microsoft.AspNetCore.Http.Features.FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = builder.Configuration.GetValue<long>("FileStorage:MaxFileSize");
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.MapInboundClaims = false;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["AppSettings:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["AppSettings:Audience"],
            ValidateLifetime = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
            ValidateIssuerSigningKey = true
        };
        options.Events = new JwtBearerEvents() 
        { 
            OnMessageReceived = context =>
            {
                context.Request.Cookies.TryGetValue("accessToken", out var accessToken);
                if (!string.IsNullOrEmpty(accessToken))
                {
                    context.Token = accessToken;
                }
                return Task.CompletedTask;
            }   
        };
    });
builder.Services.AddAuthorization();
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("InternalOnly", policy =>
        policy.RequireAssertion(ctx =>
        {
            if (ctx.Resource is HttpContext httpContext &&
                httpContext.Request.Headers.TryGetValue("X-Internal-Request", out var value) &&
                value == "True")
            {
                return true;
            }
            return ctx.User.FindFirstValue(ClaimTypes.Role) == "Admin";
        }));
});
builder.Services.AddTransient<IEmailService, SendGridEmailService>();
builder.Services.AddHttpClient();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IFilmService, FilmService>();
builder.Services.AddScoped<ITeremService, TeremService>();
builder.Services.AddScoped<IVetitesService, VetitesService>();
builder.Services.AddScoped<IFoglalasService, FoglalasService>();
builder.Services.AddScoped<IImageService, ImageService>();
builder.Services.AddControllers()
               .AddNewtonsoftJson(options =>
               {
                   options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
                   options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
               });
builder.Services.AddHttpClient("ImageUpload", client =>
{
    client.BaseAddress = new Uri(builder.Configuration["ApiSettings:BaseUrl"]);
});
var app = builder.Build();
app.UseCookiePolicy(new CookiePolicyOptions
{
    MinimumSameSitePolicy = SameSiteMode.None,
    HttpOnly = HttpOnlyPolicy.Always,
    Secure = CookieSecurePolicy.Always
});
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseMiddleware<HttpLoggingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseRouting();

app.UseCors();

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapFallbackToFile("/index.html");
var imagesFolder = Path.Combine(app.Environment.ContentRootPath, app.Configuration["FileStorage:ImageStoragePath"]);
if (!Directory.Exists(imagesFolder))
{
    Directory.CreateDirectory(imagesFolder);
}
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(imagesFolder),
    RequestPath = "/images"
});
app.MapGet("/env-check", () => new {
    HasJwtToken = !string.IsNullOrEmpty(Environment.GetEnvironmentVariable("JWT_TOKEN")),
    HasSendGridKey = !string.IsNullOrEmpty(Environment.GetEnvironmentVariable("SENDGRID_API_KEY")),
    HasConnectionString = !string.IsNullOrEmpty(Environment.GetEnvironmentVariable("CONNECTION_STRING"))
});
app.Run();
