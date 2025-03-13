using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ReactApp1.Server.Data;
using ReactApp1.Server.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddCors(options=> options.AddDefaultPolicy(
    builder => 
    {
        builder.WithOrigins("https://localhost:60769").AllowAnyHeader().AllowAnyMethod().AllowCredentials();
    }));
builder.Services.AddControllers().AddNewtonsoftJson();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {        
        options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
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

                    //REMOVE LATER, ONLY FOR TESTING
                    Console.WriteLine(accessToken);
                }
                Console.WriteLine("oops");
                return Task.CompletedTask;
            },
             OnAuthenticationFailed = context =>
             {
                 Console.WriteLine($"OnAuthenticationFailed: {context.Exception.Message}");
                 return Task.CompletedTask;
             },
            OnTokenValidated = context =>
            {
                Console.WriteLine("OnTokenValidated");
                return Task.CompletedTask;
            },
            OnChallenge = context =>
            {
                Console.WriteLine($"OnChallenge: {context.Error}");
                return Task.CompletedTask;
            }
        };
    });
    

var connectionString = builder.Configuration.GetConnectionString("MySqlConnectionString");
var serverVersion = new MySqlServerVersion(new Version(10, 4, 32));
builder.Services.AddDbContext<DataBaseContext>(options =>
    options.UseMySql(connectionString, serverVersion));
builder.Services.AddScoped<IAuthService, AuthService>();

var app = builder.Build();
app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
