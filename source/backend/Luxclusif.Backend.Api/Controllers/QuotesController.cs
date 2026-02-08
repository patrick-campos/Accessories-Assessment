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
        catch (Exception)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, "Unexpected error.");
        }
    }

    [HttpPost]
    [ProducesResponseType(typeof(QuoteResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<QuoteResponse>> CreateAsync(
        [FromBody] QuoteRequestDto request,
        [FromServices] SaveQuote useCase,
        CancellationToken cancellationToken)
    {
        try
        {
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
        catch (Exception)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, "Unexpected error.");
        }
    }
}
