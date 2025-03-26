using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Serialization;
using Newtonsoft.Json;
using NuGet.Common;
using ReactApp1.Server.Data;
using ReactApp1.Server.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using ReactApp1.Server.Services.Auth;
using ReactApp1.Server.Services.Film;
using ReactApp1.Server.Services.Terem;
using ReactApp1.Server.Services.Vetites;
using ReactApp1.Server.Services.Foglalas;
using Microsoft.Extensions.FileProviders;
using ReactApp1.Server.Services.Email;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.WithOrigins("https://localhost:60769") 
               .AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials();
    });
});
builder.Services.AddControllers().AddNewtonsoftJson();
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.Limits.MaxRequestBodySize = 20971520;
});
builder.Services.Configure<Microsoft.AspNetCore.Http.Features.FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 20971520; 
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
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["AppSettings:Token"])),
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
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("InternalOnly", policy =>
        policy.RequireAssertion(ctx =>
            ctx.Resource is HttpContext httpContext &&
            httpContext.Request.Headers.TryGetValue("X-Internal-Request", out var value) &&
            value == "True"
        ));
});
/*builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(20); 
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});*/
builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));
builder.Services.AddTransient<IEmailService, SendGridEmailService>();
builder.Services.AddHttpClient();
var connectionString = builder.Configuration.GetConnectionString("MySqlConnectionString");
var serverVersion = new MySqlServerVersion(new Version(10, 4, 32));
builder.Services.AddDbContext<DataBaseContext>(options =>
    options.UseMySql(connectionString, serverVersion));
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IFilmService, FilmService>();
builder.Services.AddScoped<ITeremService, TeremService>();
builder.Services.AddScoped<IVetitesService, VetitesService>();
builder.Services.AddScoped<IFoglalasService, FoglalasService>();
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
//app.UseSession();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapFallbackToFile("/index.html");
var imagesFolder = Path.Combine(app.Environment.ContentRootPath, "Images");
if (!Directory.Exists(imagesFolder))
{
    Directory.CreateDirectory(imagesFolder);
}
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(builder.Environment.ContentRootPath, "Images")),
    RequestPath = "/images"
});
app.Run();
