using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.EntityFrameworkCore;
using TimezoneConverter.Api.Data;
using TimezoneConverter.Api.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

builder.Services.AddRouting(options =>
{
    options.LowercaseUrls = true;
});

// Configure PostgreSQL with EF Core
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? 
    "Server=localhost;Port=5432;Database=datetime_db;User Id=aidenr;Password=legoS9ions;";

Console.WriteLine($"Using connection string: {connectionString}");
    
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString, npgsqlOptions =>
    {
        npgsqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(10),
            errorCodesToAdd: null);
        
        // Increase command timeout
        npgsqlOptions.CommandTimeout(30);
    }));

// Register repository
builder.Services.AddScoped<TimezoneConverter.Api.Data.Repositories.EventRepository>();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Timezone API", Version = "v1" });
});

// Update CORS configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:3000",      // Next.js default dev server
                "http://localhost:3001",      // Another common Next.js port
                "https://datetime.aidenr.dev", // Production URL
                "https://aidenr.dev",          // Root domain
                "https://www.aidenr.dev"       // www subdomain
            )
            .AllowAnyMethod()
            .AllowAnyHeader()
            .WithExposedHeaders("Content-Disposition")
            .AllowCredentials();
    });
});

var app = builder.Build();

// Add request logging at the very beginning
app.Use(async (context, next) =>
{
    var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
    logger.LogInformation(
        "Request received: {Method} {Scheme}://{Host}{Path}",
        context.Request.Method,
        context.Request.Scheme,
        context.Request.Host,
        context.Request.Path
    );
    await next();
});

// Add at the very start, before any other middleware
app.MapGet("/health", () =>
{
    app.Logger.LogInformation("Health check endpoint hit");
    return Results.Ok("Healthy");
});

// Automatically apply migrations on startup with improved retry logic
app.Lifetime.ApplicationStarted.Register(async () =>
{
    using var scope = app.Services.CreateScope();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    
    // Get the connection string that was actually used
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    logger.LogInformation("Database provider: {Provider}", dbContext.Database.ProviderName);
    logger.LogInformation("Connection string being used: {ConnectionString}", 
        dbContext.Database.GetConnectionString()?.Replace("Password=", "Password=***"));
    
    for (int attempt = 1; attempt <= 5; attempt++)
    {
        try
        {
            logger.LogInformation("Attempt {Attempt} of 5: Connecting to database...", attempt);
            
            // Test connection with explicit timeout
            var cancellationTokenSource = new CancellationTokenSource(TimeSpan.FromSeconds(20));
            var token = cancellationTokenSource.Token;
            
            if (await dbContext.Database.CanConnectAsync(token))
            {
                logger.LogInformation("Successfully connected to database. Applying migrations...");
                await dbContext.Database.MigrateAsync(token);
                logger.LogInformation("Migrations applied successfully");
                
                // Initialize seed data if needed
                try {
                    logger.LogInformation("Initializing test data...");
                    // You can add a call to your DbInitializer here if needed
                    // DbInitializer.Initialize(dbContext);
                    logger.LogInformation("Test data initialization complete");
                }
                catch (Exception ex) {
                    logger.LogError(ex, "An error occurred while seeding the database");
                }
                
                break;
            }
            else
            {
                logger.LogWarning("CanConnectAsync returned false");
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Attempt {Attempt} failed to connect to database", attempt);
            if (attempt >= 5)
            {
                logger.LogCritical("Failed to connect to database after 5 attempts");
            }
            else
            {
                int delaySeconds = 5 * attempt; // Linear backoff
                logger.LogInformation("Waiting {Delay} seconds before next attempt...", delaySeconds);
                await Task.Delay(TimeSpan.FromSeconds(delaySeconds));
            }
        }
    }
});

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Timezone API V1");
    });
}

app.UseRouting();
app.UseCors("AllowFrontend"); // This should come before UseAuthorization
app.UseAuthorization();
app.MapControllers();

app.Run();
