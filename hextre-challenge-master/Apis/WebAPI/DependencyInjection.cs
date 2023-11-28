using Application.Interfaces;
using FluentValidation.AspNetCore;
using Hangfire;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.OpenApi.Models;
using System.Diagnostics;
using WebAPI.Middlewares;
using WebAPI.Services;

namespace WebAPI
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddWebAPIService(this IServiceCollection services)
        {
            services.AddControllers();
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();
            services.AddHealthChecks();
            services.AddSingleton<GlobalExceptionMiddleware>();
            services.AddSingleton<PerformanceMiddleware>();
            services.AddSingleton<Stopwatch>();
            services.AddScoped<IClaimsService, ClaimsService>();
            services.AddScoped<MonthService>();
            services.AddHttpContextAccessor();
            services.AddFluentValidationAutoValidation();
            services.AddFluentValidationClientsideAdapters();

            services.AddSwaggerGen(options =>
            {
                var jwtSecurityScheme = new OpenApiSecurityScheme
                {
                    BearerFormat = "JWT",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Scheme = JwtBearerDefaults.AuthenticationScheme,
                    Type = SecuritySchemeType.ApiKey,
                    Description = "Put \"Bearer {token}\" your JWT Bearer token on textbox below!",
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = JwtBearerDefaults.AuthenticationScheme
                    },
                };
                options.AddSecurityDefinition(JwtBearerDefaults.AuthenticationScheme, jwtSecurityScheme);
                options.AddSecurityRequirement(new OpenApiSecurityRequirement()
            {
                {
                    jwtSecurityScheme,
                    new List<string>()
                }
            });
            });


            var connectHangfire =
        services.AddHangfire(configuration => configuration
        .SetDataCompatibilityLevel(CompatibilityLevel.Version_170)
        .UseSimpleAssemblyNameTypeSerializer()
        .UseRecommendedSerializerSettings()
        .UseSqlServerStorage("Data Source=sql.bsite.net\\MSSQL2016;Initial Catalog=hangfireware_;User ID=hangfireware_;Password=Tramy@123;Trust Server Certificate=true; MultipleActiveResultSets=true", new Hangfire.SqlServer.SqlServerStorageOptions
        {
            //Data Source=sql.bsite.net\\MSSQL2016;Initial Catalog=tramysy_;User ID=tramysy_;Password=12345;Trust Server Certificate=true; MultipleActiveResultSets=true
            CommandBatchMaxTimeout = TimeSpan.FromMinutes(5),
            SlidingInvisibilityTimeout = TimeSpan.FromMinutes(5),
            QueuePollInterval = TimeSpan.Zero,
            UseRecommendedIsolationLevel = true,
            DisableGlobalLocks = true,
        }));

            return services;
        }
    }
}
