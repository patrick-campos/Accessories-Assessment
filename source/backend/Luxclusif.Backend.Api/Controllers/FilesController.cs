using Luxclusif.Backend.Application.Dtos;
using Luxclusif.Backend.Application.UseCases.Files;
using Luxclusif.Backend.Domain.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace Luxclusif.Backend.Api.Controllers;

[ApiController]
[Route("file")]
public sealed class FilesController : ControllerBase
{
    public sealed class FileUploadForm
    {
        public IFormFile? File { get; init; }
    }

    [HttpPost]
    [Consumes("multipart/form-data")]
    [ProducesResponseType(typeof(FileUploadResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<FileUploadResponse>> UploadAsync(
        [FromForm] FileUploadForm form,
        [FromServices] SaveFile useCase,
        [FromServices] ILogger<FilesController> logger,
        CancellationToken cancellationToken)
    {
        try
        {
            if (form.File is null)
            {
                return BadRequest("file is required.");
            }

            await using var stream = form.File.OpenReadStream();
            var request = new FileUploadRequest(form.File.FileName, form.File.ContentType ?? "application/octet-stream", stream);
            var response = await useCase.ExecuteAsync(request, cancellationToken);
            return Ok(response);
        }
        catch (DomainException exception)
        {
            return BadRequest(exception.Message);
        }
        catch (InvalidOperationException exception)
        {
            return BadRequest(exception.Message);
        }
        catch (Exception exception)
        {
            logger.LogError(exception, "Unexpected error while uploading file.");
            return StatusCode(StatusCodes.Status500InternalServerError, "Unexpected error.");
        }
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<ActionResult> DeleteAsync(
        [FromRoute] string id,
        [FromServices] DeleteFile useCase,
        [FromServices] ILogger<FilesController> logger,
        CancellationToken cancellationToken)
    {
        try
        {
            await useCase.ExecuteAsync(id, cancellationToken);
            return NoContent();
        }
        catch (DomainException exception)
        {
            return BadRequest(exception.Message);
        }
        catch (InvalidOperationException exception)
        {
            return BadRequest(exception.Message);
        }
        catch (Exception exception)
        {
            logger.LogError(exception, "Unexpected error while deleting file.");
            return StatusCode(StatusCodes.Status500InternalServerError, "Unexpected error.");
        }
    }

}
