using UslugiRyadom.Api.Entities;

namespace UslugiRyadom.Api.Services.Interfaces;

public interface IJwtTokenService
{
    (string Token, DateTime ExpiresAt) GenerateToken(ApplicationUser user, IEnumerable<string> roles);
}
