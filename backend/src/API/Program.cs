using System.Text;
using Amazon.S3;
using Core.Interfaces;
using Infrastructure.Data;
using Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

var jwtSettings = builder.Configuration.GetSection("JwtSettings");

var environment = builder.Environment.EnvironmentName;

builder.Services.AddDbContext<NotesContext>(opt =>
    opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => 
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"] ?? Environment.GetEnvironmentVariable("JWT_ISSUER"),
            ValidAudience = jwtSettings["Audience"] ?? Environment.GetEnvironmentVariable("JWT_AUDIENCE"),
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                jwtSettings["Secret"] ?? Environment.GetEnvironmentVariable("JWT_SECRET")
                ?? throw new ArgumentNullException("JwtSettings:Secret or JWT_SECRET environment variable is not configured")
            ))
        };
    });

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Vite dev server
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var awsOptions = builder.Configuration.GetAWSOptions("AWS");
builder.Services.AddDefaultAWSOptions(awsOptions);

builder.Services.AddAWSService<IAmazonS3>();
var bucketSettings = builder.Configuration.GetSection("AWSBucket");
builder.Services.AddScoped<IFileUploader, S3FileUploader>(sp => 
{
    var s3Client = sp.GetRequiredService<IAmazonS3>();
    return new S3FileUploader(s3Client, bucketSettings["BucketName"] ?? String.Empty);
});

builder.Services.AddControllers();

var app = builder.Build();

app.UseCors("AllowReactApp");

app.UseRouting();

app.MapControllers();

app.Run();
