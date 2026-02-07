using Luxclusif.Backend.Application.Dtos;
using Luxclusif.Backend.Application.UseCases.Brands;
using Luxclusif.Backend.Domain.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace Luxclusif.Backend.Api.Controllers;

[ApiController]
[Route("brands")]
public sealed class BrandsController : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(EntriesResponse<BrandDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<EntriesResponse<BrandDto>>> GetAsync(
        [FromQuery] string categoryId,
        [FromQuery] string countryIsoCode,
        [FromQuery] bool hasAvailableBuyer,
        [FromServices] GetBrands useCase,
        CancellationToken cancellationToken)
    {
        try
        {
            var response = await useCase.ExecuteAsync(categoryId, countryIsoCode, hasAvailableBuyer, cancellationToken);
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
