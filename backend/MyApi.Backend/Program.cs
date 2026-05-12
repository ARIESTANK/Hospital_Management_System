using System.Data;
using Microsoft.EntityFrameworkCore;
using Oracle.ManagedDataAccess.Client;
using MyApi.Backend.Context;

var builder = WebApplication.CreateBuilder(args);

// 1. Add CORS Policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("DevCorsPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Default Vite port
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddTransient<IDbConnection>((sp) => 
    new OracleConnection(builder.Configuration.GetConnectionString("HospitalDb")));

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseOracle(builder.Configuration.GetConnectionString("HospitalDb")));

var app = builder.Build();
// 2. Use the Policy
app.UseCors("DevCorsPolicy");

app.Map("/",()=>"Server is running on Post 8080");

app.UseAuthorization();
app.MapControllers();

app.Run();
