var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers(); 
builder.Services.AddEndpointsApiExplorer(); //Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(config => config
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader()); // Apply the CORS policy globally

app.UseAuthorization();
app.MapControllers();
app.Run();