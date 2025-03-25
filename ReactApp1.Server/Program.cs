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
using static Org.BouncyCastle.Math.EC.ECCurve;
using ReactApp1.Server.Services.Auth;
using ReactApp1.Server.Services.Film;
using ReactApp1.Server.Services.Terem;
using ReactApp1.Server.Services.Vetites;
using ReactApp1.Server.Services.Foglalas;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers().AddNewtonsoftJson();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
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
builder.Services.AddAuthorization();
builder.Services.AddCors(options => options.AddDefaultPolicy(
    builder =>
    {
        builder.WithOrigins("https://localhost:60769").AllowAnyHeader().AllowAnyMethod().AllowCredentials();
    }));

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

var app = builder.Build();
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseMiddleware<HttpLoggingMiddleware>();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
