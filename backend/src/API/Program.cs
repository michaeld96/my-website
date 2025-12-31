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
using Infrastructure.Services.S3;
using Infrastructure.Services.Email;
using Amazon.Extensions.NETCore.Setup;
using Amazon.SimpleEmail;
using Microsoft.Extensions.Options;
using System.Threading.RateLimiting; // make sure this is at the top

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
        policy.WithOrigins(
            "http://localhost:5173",
            "https://michaeldick.io",
            "https://www.michaeldick.io"
            ) 
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// AWS Options.
var awsOptions = builder.Configuration.GetAWSOptions("AWS");
builder.Services.AddDefaultAWSOptions(awsOptions);
// S3 bucket.
builder.Services.AddAWSService<IAmazonS3>();
var bucketSettings = Environment.GetEnvironmentVariable("AWS_BUCKET_NAME");
builder.Services.AddScoped<IFileUploader, S3FileUploader>(sp => 
{
    var s3Client = sp.GetRequiredService<IAmazonS3>();
    return new S3FileUploader(s3Client, Environment.GetEnvironmentVariable("AWS_BUCKET_NAME") ?? String.Empty);

});
// SES.
builder.Services.AddSingleton(sp =>
{
    return new EmailOptions
    {
        FromAddress = Environment.GetEnvironmentVariable("EMAIL_FROM") ?? "",
        ToAddress = Environment.GetEnvironmentVariable("EMAIL_TO") ?? "",
        SubjectPrefix = Environment.GetEnvironmentVariable("EMAIL_SUBJECT_PREFIX") ?? ""
    };
});
builder.Services.AddAWSService<IAmazonSimpleEmailService>();
builder.Services.AddScoped<IEmailService, SESService>();
builder.Services.AddRateLimiter(options =>
{
    options.AddPolicy("contact", httpContext =>
    {
        // 
        var ip = httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        return RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: ip,
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 5,                    // 5 requests
                Window = TimeSpan.FromMinutes(1),   // per minute
                QueueLimit = 0,                     // don't queue request, just reject.
                AutoReplenishment = true     
            });
    });
    // When limit is reached, return this status code.
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
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
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();