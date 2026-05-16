using System.Data;
using Microsoft.EntityFrameworkCore;
using Oracle.ManagedDataAccess.Client;
using MyApi.Backend.Context;
using MyApi.Backend.Services.Interfaces;
using MyApi.Backend.Service;
using MyApi.Backend.Repository.Interface;
using MyApi.Backend.Repositories;

var builder = WebApplication.CreateBuilder(args);

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("DevCorsPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Oracle DB Connection (ADO.NET)
builder.Services.AddTransient<IDbConnection>(_ =>
    new OracleConnection(builder.Configuration.GetConnectionString("HospitalDb")));

// EF Core DbContext (Oracle)
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseOracle(builder.Configuration.GetConnectionString("HospitalDb")));

// 🔥 IMPORTANT: Dependency Injection registrations
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAuthRepo, AuthRepository>();
builder.Services.AddScoped<IUserRepo, UserRepository>();
builder.Services.AddScoped<IPatientRepo,PatientRepository>();
builder.Services.AddScoped<IPatientService,PatientService>();


var app = builder.Build();

// Middleware order (important)
app.UseCors("DevCorsPolicy");

app.UseAuthorization();

app.MapControllers();

app.MapGet("/", () => "Server is running on Port 8080");

app.Run();