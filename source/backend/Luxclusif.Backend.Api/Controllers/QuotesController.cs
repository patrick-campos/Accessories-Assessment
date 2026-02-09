using Luxclusif.Backend.Application.Dtos;
using Luxclusif.Backend.Application.UseCases.Quotes;
using Luxclusif.Backend.Domain.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace Luxclusif.Backend.Api.Controllers;

[ApiController]
[Route("quote")]
public sealed class QuotesController : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(QuoteListResponseDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<QuoteListResponseDto>> GetAsync(
        [FromQuery] int pageNumber,
        [FromServices] GetQuotes useCase,
        [FromServices] ILogger<QuotesController> logger,
        CancellationToken cancellationToken)
    {
        try
        {
            var response = await useCase.ExecuteAsync(pageNumber, cancellationToken);
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
            logger.LogError(exception, "Unexpected error while fetching quotes.");
            return StatusCode(StatusCodes.Status500InternalServerError, "Unexpected error.");
        }
    }

    [HttpPost]
    [ProducesResponseType(typeof(QuoteBatchResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<QuoteBatchResponse>> CreateAsync(
        [FromBody] QuoteRequestDto request,
        [FromServices] SaveQuote useCase,
        [FromServices] ILogger<QuotesController> logger,
        CancellationToken cancellationToken)
    {
        try
        {
            var response = await useCase.ExecuteBatchAsync(request, cancellationToken);
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
            logger.LogError(exception, "Unexpected error while creating quote.");
            return StatusCode(StatusCodes.Status500InternalServerError, "Unexpected error.");
        }
    }

}
