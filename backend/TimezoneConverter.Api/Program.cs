using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Http.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

builder.Services.AddRouting(options =>
{
	options.LowercaseUrls = true;
});

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
		policy.AllowAnyOrigin()
			.AllowAnyMethod()
			.AllowAnyHeader();
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

// Single debug middleware
app.Use(async (context, next) =>
{
	var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
	logger.LogInformation(
		"Incoming Request: {Method} {Scheme}://{Host}{Path}",
		context.Request.Method,
		context.Request.Scheme,
		context.Request.Host,
		context.Request.Path
	);
	await next();
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
app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

app.Run();
