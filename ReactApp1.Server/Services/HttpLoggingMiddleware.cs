using ReactApp1.Server.Entities;
using System.Text.Json.Nodes;
using System.Text.Json;
using System.Text;
using ReactApp1.Server.Data;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Net.Http.Headers;

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

        public async Task InvokeAsync(HttpContext context)
        {
            if (context.Request.Path.StartsWithSegments("/api/Auth/refresh-token") || context.Request.Path.StartsWithSegments("/api/Auth/getUser") || context.Request.Path.StartsWithSegments("/api/Auth/getUserAdmin") || context.Request.Path.StartsWithSegments("/api/Auth/queryUsers") ||
                context.Request.Path.StartsWithSegments("/api/Auth/checkIfLoggedIn") || context.Request.Path.StartsWithSegments("/api/Auth/checkIfAdmin") || context.Request.Path.StartsWithSegments("/api/Film/get") || context.Request.Path.StartsWithSegments("/api/Film/query") ||
                context.Request.Path.StartsWithSegments("/api/Terem/get") || context.Request.Path.StartsWithSegments("/api/Vetites/get") || context.Request.Path.StartsWithSegments("/api/Foglalas/get") || context.Request.Path.StartsWithSegments("/api/Foglalas/getByVetites") ||
                context.Request.Path.StartsWithSegments("/api/Foglalas/getByUser") || context.Request.Path.StartsWithSegments("/swagger/v1/swagger.json") || context.Request.Path.StartsWithSegments("/swagger/") || context.Request.Path.StartsWithSegments("/api/Foglalas/getJegyTipus") ||
                context.Request.Path.StartsWithSegments("/swagger/index.html") || context.Request.Path.StartsWithSegments("/swagger/swagger-ui.css") || context.Request.Path.StartsWithSegments("/swagger/swagger-ui-standalone-preset.js") || context.Request.Path.StartsWithSegments("/swagger/favicon-32x32.png") ||
                context.Request.Path.StartsWithSegments("/api/Auth/get") || context.Request.Path.StartsWithSegments("/swagger") || context.Request.Path.StartsWithSegments("/favicon.ico") || context.Request.Path.StartsWithSegments("/images")||context.Request.Path.StartsWithSegments("/api/Image/get") ||
                context.Request.Method.Equals("GET", StringComparison.OrdinalIgnoreCase))
            {
                await _next(context);
                return;
            }

            var request = context.Request;
            string requestBody = string.Empty;
            string redactedRequestBody = string.Empty;
            var redactedRequestHeaders = FormatHeaders(request.Headers);

            if (IsMultipartFormData(request.ContentType))
            {
                requestBody = await ReadMultipartFormDataAsync(request);
                redactedRequestBody = RedactMultipartFormData(requestBody);
            }
            else
            {
                requestBody = await ReadRequestBodyAsync(request);
                redactedRequestBody = requestBody;
            }

            if (context.Request.Path.StartsWithSegments("/api/Auth/register") ||
                context.Request.Path.StartsWithSegments("/api/Auth/login"))
            {
                redactedRequestBody = RedactSensitiveData(redactedRequestBody);
                redactedRequestHeaders = RedactSensitiveHeaders(request.Headers);
            }

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

                var originalResponseBodyStream = context.Response.Body;

                using (var responseBodyStream = new MemoryStream())
                {
                    context.Response.Body = responseBodyStream;

                    await _next(context);

                    var responseBody = await ReadResponseBodyAsync(context.Response);

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

                    await dbContext.HttpLogs.AddAsync(httpLog);
                    await dbContext.SaveChangesAsync();

                    responseBodyStream.Seek(0, SeekOrigin.Begin);
                    await responseBodyStream.CopyToAsync(originalResponseBodyStream);
                }
            }
        }

        private bool IsMultipartFormData(string contentType)
        {
            return !string.IsNullOrEmpty(contentType) &&
                   contentType.Contains("multipart/form-data", StringComparison.OrdinalIgnoreCase);
        }

        private async Task<string> ReadMultipartFormDataAsync(HttpRequest request)
        {
            if (!IsMultipartFormData(request.ContentType))
                return string.Empty;

            var boundary = GetBoundary(request.ContentType);
            if (string.IsNullOrEmpty(boundary))
                return string.Empty;

            request.EnableBuffering();
            var reader = new MultipartReader(boundary, request.Body);
            var section = await reader.ReadNextSectionAsync();
            var formData = new StringBuilder();

            while (section != null)
            {
                var hasContentDisposition = ContentDispositionHeaderValue.TryParse(
                    section.ContentDisposition, out var contentDisposition);

                if (hasContentDisposition)
                {
                    formData.AppendLine($"Content-Disposition: {contentDisposition}");
                    if (contentDisposition.IsFileDisposition())
                    {
                        formData.AppendLine("Content-Type: [FILE_CONTENT_REDACTED]");
                        formData.AppendLine("File content: [REDACTED]");
                    }
                    else
                    {
                        using (var streamReader = new StreamReader(section.Body))
                        {
                            var value = await streamReader.ReadToEndAsync();
                            formData.AppendLine($"Value: {value}");
                        }
                    }
                }

                section = await reader.ReadNextSectionAsync();
            }

            request.Body.Position = 0;
            return formData.ToString();
        }

        private string RedactMultipartFormData(string formData)
        {
            return formData;
        }

        private string GetBoundary(string contentType)
        {
            var boundaryMarker = "boundary=";
            var index = contentType.IndexOf(boundaryMarker, StringComparison.OrdinalIgnoreCase);
            if (index < 0)
                return null;

            index += boundaryMarker.Length;
            var boundary = contentType[index..].Trim('"', ' ');
            return boundary;
        }

        private async Task<string> ReadRequestBodyAsync(HttpRequest request)
        {
            request.EnableBuffering();
            var body = request.Body;
            var buffer = new byte[Convert.ToInt32(request.ContentLength)];
            await body.ReadAsync(buffer, 0, buffer.Length);
            var bodyAsText = Encoding.UTF8.GetString(buffer);
            request.Body.Position = 0;
            return bodyAsText;
        }

        private async Task<string> ReadResponseBodyAsync(HttpResponse response)
        {
            response.Body.Seek(0, SeekOrigin.Begin);
            var bodyAsText = await new StreamReader(response.Body).ReadToEndAsync();
            response.Body.Seek(0, SeekOrigin.Begin);
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
                var json = JsonDocument.Parse(body);
                var root = json.RootElement;
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
                    var node = JsonNode.Parse(property.Value.GetRawText());
                    jsonObject.Add(property.Name, node);
                }
            }
            return JsonDocument.Parse(jsonObject.ToJsonString()).RootElement;
        }
    }
}