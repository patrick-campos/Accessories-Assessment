using Luxclusif.Backend.Application.Dtos;
using Luxclusif.Backend.Application.UseCases.Attributes;
using Luxclusif.Backend.Application.UseCases.Categories;
using Luxclusif.Backend.Domain.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace Luxclusif.Backend.Api.Controllers;

[ApiController]
[Route("categories")]
public sealed class CategoriesController : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(ListResponse<CategoryDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ListResponse<CategoryDto>>> GetAsync(
        [FromQuery] string countryISOCode,
        [FromQuery] bool hasAvailableBuyer,
        [FromServices] GetCategories useCase,
        [FromServices] ILogger<CategoriesController> logger,
        CancellationToken cancellationToken)
    {
        try
        {
            var response = await useCase.ExecuteAsync(countryISOCode, hasAvailableBuyer, cancellationToken);
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
            logger.LogError(exception, "Unexpected error while fetching categories.");
            return StatusCode(StatusCodes.Status500InternalServerError, "Unexpected error.");
        }
    }

    [HttpGet("{id}/attributes")]
    [ProducesResponseType(typeof(ListResponse<AttributeDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ListResponse<AttributeDto>>> GetAttributesAsync(
        [FromRoute] string id,
        [FromServices] GetCategoryAttributes useCase,
        [FromServices] ILogger<CategoriesController> logger,
        CancellationToken cancellationToken)
    {
        try
        {
            var response = await useCase.ExecuteAsync(id, cancellationToken);
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
            logger.LogError(exception, "Unexpected error while fetching category attributes.");
            return StatusCode(StatusCodes.Status500InternalServerError, "Unexpected error.");
        }
    }
}
