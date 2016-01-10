using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Hosting;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Data.Entity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using MHUI.Models;
using MHUI.Services;
using System;
using Microsoft.AspNet.FileProviders;
using JavaScriptEngineSwitcher.Core;
using System.Linq;
using Microsoft.Extensions.PlatformAbstractions;

namespace MHUI
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            // Set up configuration sources.
            var builder = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json")
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true);

            if (env.IsDevelopment())
            {
                // For more details on using the user secret store see http://go.microsoft.com/fwlink/?LinkID=532709
                builder.AddUserSecrets();
            }

            builder.AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; set; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Add framework services.
            services.AddEntityFramework()
                .AddSqlite()
                .AddDbContext<ApplicationDbContext>();

            services.AddTransient<ApplicationDbContext, ApplicationDbContext>();


            services.AddIdentity<ApplicationUser, IdentityRole>(opt =>
            {
                opt.Password.RequireDigit = false;
                opt.Password.RequireNonLetterOrDigit = false;
                opt.Password.RequireUppercase = false;
                opt.Password.RequireLowercase = false;
                opt.User.AllowedUserNameCharacters = opt.User.AllowedUserNameCharacters + '+';
            })
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            services.AddMvc();

            // Add application services.
            services.AddTransient<IEmailSender, AuthMessageSender>();
            services.AddTransient<ISmsSender, AuthMessageSender>();

            services.AddSingleton(CreateJSEngine);

        }

        private static JSPool.IJsPool CreateJSEngine(IServiceProvider provider)
        {
            var ieConfig = new JavaScriptEngineSwitcher.Msie.Configuration.MsieConfiguration
            {
                EngineMode = JavaScriptEngineSwitcher.Msie.JsEngineMode.ChakraEdgeJsRt
                
            };
            var appEnv = provider.GetRequiredService<IApplicationEnvironment>();
            var fileProvider = new PhysicalFileProvider(appEnv.ApplicationBasePath);
            var jsdir = fileProvider.GetDirectoryContents("wwwroot/js");
            var jsPath = jsdir.First(f => f.Name == "server.js").PhysicalPath;

            var poolConfig = new JSPool.JsPoolConfig();
            poolConfig.MaxUsagesPerEngine = 20;
            poolConfig.StartEngines = 2;
            poolConfig.EngineFactory = () => new JavaScriptEngineSwitcher.Msie.MsieJsEngine(ieConfig);
            poolConfig.Initializer = engine => InitialiseJSRuntime(jsPath, engine);
            poolConfig.WatchFiles = new[] { jsPath };
            var jspool = new JSPool.JsPool(poolConfig);
            return jspool;
        }

        public static void InitialiseJSRuntime(string jsPath, IJsEngine engine)
        {
            engine.ExecuteFile(jsPath);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            if (env.IsDevelopment())
            {
                app.UseBrowserLink();
                app.UseDeveloperExceptionPage();
                app.UseDatabaseErrorPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");

                // For more details on creating database during deployment see http://go.microsoft.com/fwlink/?LinkID=615859
                try
                {
                    using (var serviceScope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>()
                        .CreateScope())
                    {
                        serviceScope.ServiceProvider.GetService<ApplicationDbContext>()
                             .Database.Migrate();
                    }
                }
                catch { }
            }
            
            app.UseIISPlatformHandler(options => options.AuthenticationDescriptions.Clear());
            
            app.UseStaticFiles();

            app.UseIdentity();
            
            // To configure external authentication please see http://go.microsoft.com/fwlink/?LinkID=532715

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });



            var db = app.ApplicationServices.GetRequiredService<ApplicationDbContext>();
            db.Database.EnsureCreated();


        }

        // Entry point for the application.
        public static void Main(string[] args) => WebApplication.Run<Startup>(args);
    }
}
