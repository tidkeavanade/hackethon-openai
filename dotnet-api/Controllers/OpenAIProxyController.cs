using Microsoft.AspNetCore.Mvc;
using System;
using Azure.AI.OpenAI;
using Newtonsoft.Json;
using System.Text;
using System.Collections.Generic;

namespace dotnetApi.Controllers;

public class PromptModel
{
    public string Prompt { get; set; }
}

public class ImageGenerationResponse
{
    public string Id { get; set; }
    public string Status { get; set; }
}

public class ActualImageGenerationResponse
{

    public long Created { get; set; }
    public long Expires { get; set; }
    public string Id { get; set; }
    public ImageGenerationResult Result { get; set; }
    public string Status { get; set; }
}

public class ImageGenerationResult
{
    public List<ImageData> Data { get; set; }
}

public class ImageData
{
    public string Url { get; set; }
}

[ApiController]
[Route("api/[controller]")]
public class OpenAIProxyController : ControllerBase
{

    private readonly string openAIEndpointUrl;
    private readonly string openAIKey;

    private readonly ILogger<OpenAIProxyController> _logger;

    public OpenAIProxyController(ILogger<OpenAIProxyController> logger)

    {
        this.openAIEndpointUrl = Environment.GetEnvironmentVariable("openAIEndpointURL");
        this.openAIKey = Environment.GetEnvironmentVariable("openAIKey");
        _logger = logger;
    }

    [HttpPost(Name = "GetWeatherForecast")]
    async public Task<string> Post([FromBody] PromptModel promptModel)
    {
        
        try
        {
            var endpoint = new Uri(this.openAIEndpointUrl);
            var credentials = new Azure.AzureKeyCredential(this.openAIKey);
            var openAIClient = new OpenAIClient(endpoint, credentials);
            var prompt = promptModel.Prompt;

            var completionOptions = new CompletionsOptions
            {
                Prompts={prompt}, MaxTokens=2500, Temperature=0f,FrequencyPenalty=0.0f,PresencePenalty=0.0f, NucleusSamplingFactor=1 // Top P
            };

            Completions response = await openAIClient.GetCompletionsAsync("text-davinci-003",completionOptions);
            var responseText = response.Choices.First().Text;
            return responseText;
        }

        catch { return "Error : Not able to get response from Open AI"; }
    }        
}

[ApiController]
[Route("api/[controller]")]
public class GetImageController : ControllerBase
{
    
    private readonly string openAIEndpointUrl;
    private readonly string openAIKeyEast;

    private readonly ILogger<OpenAIProxyController> _logger;
    public GetImageController(ILogger<OpenAIProxyController> logger)
    {
        this.openAIEndpointUrl = Environment.GetEnvironmentVariable("openAIEndpointURL");
        this.openAIKeyEast = Environment.GetEnvironmentVariable("openAIKeyEast");
        _logger = logger;
    }

    [HttpPost(Name = "GetImage")]
    public async Task<String> Post([FromBody] PromptModel promptModel)
    {
        try
        {
            var resourceName = "eastus-asghackathon";
            var requestKey = this.openAIKeyEast;
            var endpoint = $"https://eastus-asghackathon.openai.azure.com/openai/images/generations:submit?api-version=2023-06-01-preview";
            var submitResponse = await SubmitImageGeneration(requestKey, resourceName, promptModel.Prompt);

            var secondApiResponse = await GetOperationStatus(requestKey,resourceName,submitResponse.Id);
            if (secondApiResponse != null && secondApiResponse.Status == "succeeded")
                {
                    // Process the successful second API response
                    var imageUrl = secondApiResponse.Result.Data[0].Url;
                    Console.WriteLine($"Image URL: {imageUrl}");
                }

            return secondApiResponse?.Result?.Data[0]?.Url;
        }

        catch {  return "Error : No url generated"; }
    }

    private static async Task<ImageGenerationResponse> SubmitImageGeneration(string apiKey, string resourceName, string inputPrompt)
    {

        var endpoint = $"https://{resourceName}.openai.azure.com/openai/images/generations:submit?api-version=2023-06-01-preview";
        var client = new HttpClient();
        client.DefaultRequestHeaders.Add("api-key", apiKey);

        var requestBody = new
        {
            prompt = inputPrompt,
            size = "512x512",
            n = 1
        };

        var json = Newtonsoft.Json.JsonConvert.SerializeObject(requestBody);
        var content = new StringContent(json, Encoding.UTF8, "application/json");
        var response = await client.PostAsync(endpoint, content);
        var responseContent = await response.Content.ReadAsStringAsync();
        if (responseContent != null && responseContent != null && response.IsSuccessStatusCode)
        {
            var responseData = JsonConvert.DeserializeObject<ImageGenerationResponse>(responseContent);
            return responseData ?? null;
        } else
        {
            Console.WriteLine("Error submitting image generation request. Status code: " + response.StatusCode);
            return null;
        }
    }

    static async Task<ActualImageGenerationResponse> GetOperationStatus(string apiKey, string resourceName, string operationId)
    {
        var endpoint = $"https://{resourceName}.openai.azure.com/openai/operations/images/{operationId}?api-version=2023-06-01-preview";
        var client = new HttpClient();
        client.DefaultRequestHeaders.Add("Api-Key", apiKey);

        while(true)
        {
             var response = await client.GetAsync(endpoint);
            if (response.IsSuccessStatusCode)
            {
                var responseContent = await response.Content.ReadAsStringAsync();
                var responseData = JsonConvert.DeserializeObject<ActualImageGenerationResponse>(responseContent);
                if (responseData?.Status == "succeeded")
                {
                    return responseData;
                }
            }
            else
            {
                break;
            }
            // Delay before making the next request

            await Task.Delay(TimeSpan.FromSeconds(1));
        }

        return null;  
    }  
}