using System;
using Amazon.S3;
using Amazon.S3.Transfer;
using Core.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Identity.Client;

namespace Infrastructure.Services;

public class S3FileUploader : IFileUploader
{
    private readonly IAmazonS3 _s3client;
    private readonly string _bucketName;

    public S3FileUploader(IAmazonS3 s3Client, string bucketName)
    {
        _s3client = s3Client;
        _bucketName = bucketName;
    }

    public async Task<String> UploadAsync(IFormFile file)
    {
        var fileName = "images/" + Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);

        using var newMemoryStream = new MemoryStream();
        await file.CopyToAsync(newMemoryStream);

        var uploadRequest = new TransferUtilityUploadRequest
        {
            InputStream = newMemoryStream,
            Key = fileName,
            BucketName = _bucketName
            // CannedACL = S3CannedACL.PublicRead
        };

        var fileTransferUtility = new TransferUtility(_s3client);
        try
        {
            await fileTransferUtility.UploadAsync(uploadRequest);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Upload failed: {ex.Message}");
            return String.Empty;
        }

        return $"https://{_bucketName}.s3.amazonaws.com/{fileName}";

    }
}
