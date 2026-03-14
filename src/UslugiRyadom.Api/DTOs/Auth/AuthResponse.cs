namespace UslugiRyadom.Api.DTOs.Auth;

public class AuthResponse
{
    public string AccessToken { get; set; } = string.Empty;

    public DateTime ExpiresAt { get; set; }

    public CurrentUserResponse User { get; set; } = null!;
}
