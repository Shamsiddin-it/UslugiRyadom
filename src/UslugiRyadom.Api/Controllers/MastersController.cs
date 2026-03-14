using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UslugiRyadom.Api.Constants;
using UslugiRyadom.Api.DTOs.Common;
using UslugiRyadom.Api.DTOs.Masters;
using UslugiRyadom.Api.Extensions;
using UslugiRyadom.Api.Services.Interfaces;

namespace UslugiRyadom.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MastersController : ControllerBase
{
    private readonly IMasterService _masterService;

    public MastersController(IMasterService masterService)
    {
        _masterService = masterService;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<PagedResponse<MasterProfileResponse>>> GetAll([FromQuery] MasterQueryParameters query, CancellationToken cancellationToken)
    {
        var response = await _masterService.GetPagedAsync(query, cancellationToken);
        return Ok(PagedResponse<MasterProfileResponse>.Ok(response));
    }

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<MasterProfileResponse>>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var response = await _masterService.GetByUserIdAsync(id, cancellationToken);
        return Ok(ApiResponse<MasterProfileResponse>.Ok(response));
    }

    [HttpPut("me")]
    [Authorize(Roles = AppRoles.Master)]
    public async Task<ActionResult<ApiResponse<MasterProfileResponse>>> UpdateMine([FromBody] UpdateMasterProfileRequest request, CancellationToken cancellationToken)
    {
        var response = await _masterService.UpdateCurrentAsync(User.GetUserId(), request, cancellationToken);
        return Ok(ApiResponse<MasterProfileResponse>.Ok(response, "Master profile updated successfully."));
    }
}
