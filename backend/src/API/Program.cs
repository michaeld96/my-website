using System.Text;
using Amazon.S3;
using AutoMapper;
using Core.Interfaces;
using Core.Models;
using DotNetEnv;
using Infrastructure.Data;
using Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Data.SqlClient;
using System.IdentityModel.Tokens.Jwt;
using Infrastructure.Services.S3; // make sure this is at the top

var builder = WebApplication.CreateBuilder(args);
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var environment = builder.Environment.EnvironmentName;
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") != "${DATABASE_CONNECTION_STRING}"
    ? builder.Configuration.GetConnectionString("DefaultConnection")
    : Environment.GetEnvironmentVariable("DATABASE_CONNECTION_STRING");
builder.Services.AddDbContext<NotesContext>(opt =>
    opt.UseSqlServer(
        connectionString
    )
);

var jwtIssuer = builder.Configuration["JwtSettings:Issuer"] ?? Environment.GetEnvironmentVariable("JWT_ISSUER");
var jwtAudience = builder.Configuration["JwtSettings:Audience"] ?? Environment.GetEnvironmentVariable("JWT_AUDIENCE");
var jwtSecret = Environment.GetEnvironmentVariable("JWT_SECRET")
                ?? builder.Configuration["JwtSettings:Secret"]; // fallback if you keep it in appsettings for dev
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            NameClaimType = JwtRegisteredClaimNames.Sub,  // TODO: need this?
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                jwtSecret ?? throw new ArgumentNullException("JWT secret not configured")
            )),
            ClockSkew = TimeSpan.FromMinutes(2) // small skew to avoid clock drift issues
        };
        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = ctx =>
            {
                Console.WriteLine($"[JWT] AuthenticationFailed: {ctx.Exception.Message}");
                return Task.CompletedTask;
            },
            OnChallenge = ctx =>
            {
                // Fires when token missing/invalid
                Console.WriteLine($"[JWT] Challenge Error: {ctx.Error}, Desc: {ctx.ErrorDescription}");
                return Task.CompletedTask;
            },
            OnTokenValidated = ctx =>
            {
                Console.WriteLine("[JWT] Token validated for " + ctx.Principal?.Identity?.Name);
                return Task.CompletedTask;
            }
        };
    });
builder.Services.AddAuthorization();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Vite dev server
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var awsOptions = builder.Configuration.GetAWSOptions("AWS");
builder.Services.AddDefaultAWSOptions(awsOptions);
builder.Services.AddAWSService<IAmazonS3>();

var bucketSettings = Environment.GetEnvironmentVariable("AWS_BUCKET_NAME");
builder.Services.AddScoped<IFileUploader, S3FileUploader>(sp => 
{
    var s3Client = sp.GetRequiredService<IAmazonS3>();
    return new S3FileUploader(s3Client, Environment.GetEnvironmentVariable("AWS_BUCKET_NAME") ?? String.Empty);

});
// For Contact Controller.
builder.Services.AddHttpClient();
// Register NotesRepository (DI).
builder.Services.AddScoped<INotesRepository, NotesRepository>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<INotesRepository, NotesRepository>();
// Automapper.
builder.Services.AddAutoMapper(typeof(Program));
builder.Services.AddControllers();

var app = builder.Build();
app.UseCors("AllowReactApp");
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();