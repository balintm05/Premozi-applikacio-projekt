using ReactApp1.Server.Entities;
using System.Text.Json.Nodes;
using System.Text.Json;
using System.Text;
using System;
using System.Data.Entity;
using ReactApp1.Server.Data;

namespace ReactApp1.Server.Services
{
    public class HttpLoggingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<HttpLoggingMiddleware> _logger;
        private readonly IServiceProvider _serviceProvider;

        public HttpLoggingMiddleware(
            RequestDelegate next,
            ILogger<HttpLoggingMiddleware> logger,
            IServiceProvider serviceProvider)
        {
            _next = next;
            _logger = logger;
            _serviceProvider = serviceProvider;
        }
        //context.Request.Path.StartsWithSegments("/api/")
        public async Task InvokeAsync(HttpContext context)
        {
            if (context.Request.Path.StartsWithSegments("/api/Auth/refresh-token") || context.Request.Path.StartsWithSegments("/api/Auth/getUser") || context.Request.Path.StartsWithSegments("/api/Auth/getUserAdmin") || context.Request.Path.StartsWithSegments("/api/Auth/queryUsers") ||
                context.Request.Path.StartsWithSegments("/api/Auth/checkIfLoggedIn") || context.Request.Path.StartsWithSegments("/api/Auth/checkIfAdmin")|| context.Request.Path.StartsWithSegments("/api/Film/get")|| context.Request.Path.StartsWithSegments("/api/Film/query")||
                context.Request.Path.StartsWithSegments("/api/Terem/get")|| context.Request.Path.StartsWithSegments("/api/Vetites/get"))
            {
                await _next(context);
                return;
            }
            // Capture request details
            var request = context.Request;
            var requestBody = await ReadRequestBodyAsync(request);

            // Redact the body and headers for specific endpoints
            var redactedRequestBody = requestBody;
            var redactedRequestHeaders = FormatHeaders(request.Headers);
            if (context.Request.Path.StartsWithSegments("/api/Auth/register") ||
                context.Request.Path.StartsWithSegments("/api/Auth/login"))
            {
                redactedRequestBody = RedactSensitiveData(requestBody);
                redactedRequestHeaders = RedactSensitiveHeaders(request.Headers);
            }

            // Create a scope to resolve scoped services
            using (var scope = _serviceProvider.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<DataBaseContext>();

                var httpLog = new HttpLog
                {
                    Schema = request.Scheme,
                    Host = request.Host.ToString(),
                    Path = request.Path,
                    QueryString = request.QueryString.ToString(),
                    RequestHeaders = redactedRequestHeaders,
                    RequestBody = redactedRequestBody,
                    LogTime = DateTime.UtcNow
                };

                // Capture the original response body stream
                var originalResponseBodyStream = context.Response.Body;

                using (var responseBodyStream = new MemoryStream())
                {
                    context.Response.Body = responseBodyStream;

                    // Call the next middleware in the pipeline
                    await _next(context);

                    // Capture response details
                    var responseBody = await ReadResponseBodyAsync(context.Response);

                    // Redact the response body and headers for specific endpoints
                    var redactedResponseBody = responseBody;
                    var redactedResponseHeaders = FormatHeaders(context.Response.Headers);
                    if (context.Request.Path.StartsWithSegments("/api/Auth/register") ||
                        context.Request.Path.StartsWithSegments("/api/Auth/login"))
                    {
                        redactedResponseBody = RedactSensitiveData(responseBody);
                        redactedResponseHeaders = RedactSensitiveHeaders(context.Response.Headers);
                    }

                    httpLog.ResponseHeaders = redactedResponseHeaders;
                    httpLog.ResponseBody = redactedResponseBody;
                    httpLog.StatusCode = context.Response.StatusCode;

                    // Save the log to the database
                    await dbContext.HttpLogs.AddAsync(httpLog);
                    await dbContext.SaveChangesAsync();

                    // Copy the captured response body back to the original stream
                    responseBodyStream.Seek(0, SeekOrigin.Begin);
                    await responseBodyStream.CopyToAsync(originalResponseBodyStream);
                }
            }
        }

        private async Task<string> ReadRequestBodyAsync(HttpRequest request)
        {
            request.EnableBuffering();
            var body = request.Body;
            var buffer = new byte[Convert.ToInt32(request.ContentLength)];
            await body.ReadAsync(buffer, 0, buffer.Length);
            var bodyAsText = Encoding.UTF8.GetString(buffer);
            request.Body.Position = 0; // Reset the stream position
            return bodyAsText;
        }

        private async Task<string> ReadResponseBodyAsync(HttpResponse response)
        {
            response.Body.Seek(0, SeekOrigin.Begin);
            var bodyAsText = await new StreamReader(response.Body).ReadToEndAsync();
            response.Body.Seek(0, SeekOrigin.Begin); // Reset the stream position
            return bodyAsText;
        }

        private string FormatHeaders(IHeaderDictionary headers)
        {
            var headerString = new StringBuilder();
            foreach (var (key, value) in headers)
            {
                headerString.Append($"{key}: {value}\n");
            }
            return headerString.ToString();
        }

        private string RedactSensitiveHeaders(IHeaderDictionary headers)
        {
            var headerString = new StringBuilder();
            foreach (var (key, value) in headers)
            {
                // Redact sensitive headers
                if (key.Equals("Authorization", StringComparison.OrdinalIgnoreCase) ||
                    key.Equals("X-Refresh-Token", StringComparison.OrdinalIgnoreCase))
                {
                    headerString.Append($"{key}: [REDACTED]\n");
                }
                else
                {
                    headerString.Append($"{key}: {value}\n");
                }
            }
            return headerString.ToString();
        }

        private string RedactSensitiveData(string body)
        {
            try
            {
                // Parse the JSON body
                var json = JsonDocument.Parse(body);
                var root = json.RootElement;

                // Redact sensitive fields
                if (root.TryGetProperty("access_token", out var accessToken))
                {
                    root = RedactProperty(root, "access_token");
                }
                if (root.TryGetProperty("refresh_token", out var refreshToken))
                {
                    root = RedactProperty(root, "refresh_token");
                }
                if (root.TryGetProperty("password", out var password))
                {
                    root = RedactProperty(root, "password");
                }

                return JsonSerializer.Serialize(root);
            }
            catch
            {
                // If the body is not JSON, return it as-is
                return body;
            }
        }

        private JsonElement RedactProperty(JsonElement element, string propertyName)
        {
            var jsonObject = new JsonObject();
            foreach (var property in element.EnumerateObject())
            {
                if (property.Name.Equals(propertyName, StringComparison.OrdinalIgnoreCase))
                {
                    jsonObject.Add(property.Name, "[REDACTED]");
                }
                else
                {
                    // Convert JsonElement to JsonNode
                    var node = JsonNode.Parse(property.Value.GetRawText());
                    jsonObject.Add(property.Name, node);
                }
            }
            return JsonDocument.Parse(jsonObject.ToJsonString()).RootElement;
        }
    }
}
