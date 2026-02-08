using Luxclusif.Backend.Application.Dtos;
using Luxclusif.Backend.Application.UseCases.Countries;
using Luxclusif.Backend.Domain.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace Luxclusif.Backend.Api.Controllers;

[ApiController]
[Route("countries")]
public sealed class CountriesController : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(ListResponse<CountryDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ListResponse<CountryDto>>> GetAsync(
        [FromServices] GetCountries useCase,
        [FromServices] ILogger<CountriesController> logger,
        CancellationToken cancellationToken)
    {
        try
        {
            var response = await useCase.ExecuteAsync(cancellationToken);
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
            logger.LogError(exception, "Unexpected error while fetching countries.");
            return StatusCode(StatusCodes.Status500InternalServerError, "Unexpected error.");
        }
    }
}
