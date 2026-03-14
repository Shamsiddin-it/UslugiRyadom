using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UslugiRyadom.Api.Constants;
using UslugiRyadom.Api.DTOs.Common;
using UslugiRyadom.Api.DTOs.Users;
using UslugiRyadom.Api.Extensions;
using UslugiRyadom.Api.Services.Interfaces;

namespace UslugiRyadom.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet("me")]
    public async Task<ActionResult<ApiResponse<UserResponse>>> Me(CancellationToken cancellationToken)
    {
        var response = await _userService.GetCurrentAsync(User.GetUserId(), cancellationToken);
        return Ok(ApiResponse<UserResponse>.Ok(response));
    }

    [HttpGet("{id:guid}")]
    [Authorize(Roles = AppRoles.Admin)]
    public async Task<ActionResult<ApiResponse<UserResponse>>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var response = await _userService.GetByIdAsync(id, cancellationToken);
        return Ok(ApiResponse<UserResponse>.Ok(response));
    }
}
