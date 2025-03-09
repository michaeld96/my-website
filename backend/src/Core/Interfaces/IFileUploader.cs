using System;
using Microsoft.AspNetCore.Http;
namespace Core.Interfaces;

public interface IFileUploader
{
    Task<String> UploadAsync(IFormFile file);
}
