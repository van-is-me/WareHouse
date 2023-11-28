using Application;
using Application.Interfaces;
using Application.Repositories;
using Application.Services;
using Domain.Entities;
using Infrastructures.Mappers;
using Infrastructures.Repositories;
using Infrastructures.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructures
{
    public static class DenpendencyInjection
    {
        public static IServiceCollection AddInfrastructuresService(this IServiceCollection services, IConfiguration configuration, IWebHostEnvironment env)
        {
            services.AddScoped<IChemicalService, ChemicalService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IWarehouseService, WarehouseService>();
            services.AddScoped<IOrderService, OrderService>();
            services.AddScoped<IPostCategoryService, PostCategoryService>();
            services.AddScoped<IHashtagService, HashtagService>();
            services.AddScoped<IPostService, PostService>();
            services.AddScoped<IPostHashtagService, PostHashtagService>();
            services.AddScoped<IRequestService, RequestService>();
            services.AddScoped<IRequestDetailService, RequestDetailService>();


            services.AddScoped<IChemicalRepository, ChemicalRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<IWarehouseRepository, WarehouseRepository>();
            services.AddScoped<ICategoryRepository, CategoryRepository>();
            services.AddScoped<IProviderRepository, ProviderRepository>();
            services.AddScoped<IOrderRepository , OrderRepository>();
            services.AddScoped<IWarehouseDetailRepository , WarehouseDetailRepository>();
            services.AddScoped<INoteRepository , NoteRepository>();
            services.AddScoped<IDepositRepository , DepositRepository>();
            services.AddScoped<IPostCategoryRepository, PostCategoryRepository>();
            services.AddScoped<IHashtagRepository, HashtagRepository>();
            services.AddScoped<IPostRepository, PostRepository>();
            services.AddScoped<IPostHashtagRepository, PostHashtagRepository>();
            services.AddScoped<IRequestRepository, RequestRepository>();
            services.AddScoped<IRequestDetailRepository, RequestDetailRepository>();
            services.AddSingleton<ICurrentTime, CurrentTime>();
            services.AddScoped<ITransactionRepository, TransactionRepository>();
            services.AddScoped<ITempRepository, TempRepository>();
            

            // ATTENTION: if you do migration please check file README.md
            /*if (configuration.GetValue<bool>("UseInMemoryDatabase"))
            {
                services.AddDbContext<AppDbContext>(options =>
                    options.UseInMemoryDatabase("mentor_v1Db"));
            }
            else
            {
                
            }*/
            services.AddDbContext<AppDbContext>(options =>
                    options.UseSqlServer(GetConnection(configuration, env),
                        builder => builder.MigrationsAssembly(typeof(AppDbContext).Assembly.FullName)));

            services.AddIdentity < ApplicationUser, IdentityRole>().AddDefaultTokenProviders().AddEntityFrameworkStores<AppDbContext>();
            // this configuration just use in-memory for fast develop
            //services.AddDbContext<AppDbContext>(option => option.UseInMemoryDatabase("test"));

            services.AddAutoMapper(typeof(MapperConfigurationsProfile).Assembly);
            services.Configure<IdentityOptions>(options => options.SignIn.RequireConfirmedEmail = true);


            return services;
        }

        private static string GetConnection(IConfiguration configuration, IWebHostEnvironment env)
        {
#if DEVELOPMENT
        return configuration.GetConnectionString("DefaultConnection") 
            ?? throw new Exception("DefaultConnection not found");
#else
            return configuration[$"ConnectionStrings:{env.EnvironmentName}"]
                ?? throw new Exception($"ConnectionStrings:{env.EnvironmentName} not found");
#endif
        }
    }

    
}
