using UslugiRyadom.Api.DTOs.Auth;
using UslugiRyadom.Api.DTOs.Common;
using UslugiRyadom.Api.DTOs.Categories;
using UslugiRyadom.Api.DTOs.Locations;
using UslugiRyadom.Api.DTOs.Masters;
using UslugiRyadom.Api.DTOs.Orders;
using UslugiRyadom.Api.DTOs.Users;
using UslugiRyadom.Api.Entities;

namespace UslugiRyadom.Api.Extensions;

public static class MappingExtensions
{
    public static AddressDto ToAddressDto(this ApplicationUser user)
        => new()
        {
            City = user.City,
            District = user.District,
            Street = user.Street,
            House = user.House,
            Landmark = user.Landmark
        };

    public static AddressDto ToAddressDto(this MasterProfile profile)
        => new()
        {
            City = profile.City,
            District = profile.District,
            Street = profile.Street,
            House = profile.House,
            Landmark = profile.Landmark
        };

    public static AddressDto ToAddressDto(this Order order)
        => new()
        {
            City = order.City,
            District = order.District,
            Street = order.Street,
            House = order.House,
            Landmark = order.Landmark
        };

    public static CategoryResponse ToCategoryResponse(this Category category)
        => new()
        {
            Id = category.Id,
            Name = category.Name,
            Slug = category.Slug,
            CreatedAt = category.CreatedAt
        };

    public static MasterProfileResponse ToMasterProfileResponse(this MasterProfile profile)
        => new()
        {
            Id = profile.Id,
            UserId = profile.UserId,
            FullName = profile.User.FullName,
            Email = profile.User.Email ?? string.Empty,
            Phone = profile.User.PhoneNumber ?? string.Empty,
            Profession = profile.Profession,
            Experience = profile.Experience,
            About = profile.About,
            Rating = profile.Rating,
            IsVerified = profile.IsVerified,
            CreatedAt = profile.CreatedAt,
            Address = profile.ToAddressDto(),
            Categories = profile.MasterCategories
                .Select(mc => new MasterCategoryResponse
                {
                    Id = mc.CategoryId,
                    Name = mc.Category.Name,
                    Slug = mc.Category.Slug
                })
                .OrderBy(x => x.Name)
                .ToArray()
        };

    public static CurrentUserResponse ToCurrentUserResponse(this ApplicationUser user)
        => new()
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email ?? string.Empty,
            Phone = user.PhoneNumber ?? string.Empty,
            Role = user.Role,
            IsBlocked = user.IsBlocked,
            CreatedAt = user.CreatedAt,
            Address = user.ToAddressDto(),
            MasterProfile = user.MasterProfile is null ? null : user.MasterProfile.ToMasterProfileResponse()
        };

    public static UserResponse ToUserResponse(this ApplicationUser user)
        => new()
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email ?? string.Empty,
            Phone = user.PhoneNumber ?? string.Empty,
            Role = user.Role,
            IsBlocked = user.IsBlocked,
            CreatedAt = user.CreatedAt,
            Address = user.ToAddressDto(),
            MasterProfile = user.MasterProfile is null ? null : user.MasterProfile.ToMasterProfileResponse()
        };

    public static UserSummary ToSummary(this ApplicationUser user)
        => new()
        {
            Id = user.Id,
            FullName = user.FullName,
            Phone = user.PhoneNumber ?? string.Empty,
            Role = user.Role
        };

    public static CategorySummary ToSummary(this Category category)
        => new()
        {
            Id = category.Id,
            Name = category.Name,
            Slug = category.Slug
        };

    public static OrderResponse ToOrderResponse(this Order order)
        => new()
        {
            Id = order.Id,
            Title = order.Title,
            Description = order.Description,
            Price = order.Price,
            PaymentType = order.PaymentType,
            Status = order.Status,
            CreatedAt = order.CreatedAt,
            UpdatedAt = order.UpdatedAt,
            Address = order.ToAddressDto(),
            Category = order.Category.ToSummary(),
            Client = order.Client.ToSummary(),
            Master = order.Master?.ToSummary()
        };

    public static OrderListItemResponse ToOrderListItemResponse(this Order order)
        => new()
        {
            Id = order.Id,
            Title = order.Title,
            Price = order.Price,
            Status = order.Status,
            PaymentType = order.PaymentType,
            CreatedAt = order.CreatedAt,
            Address = order.ToAddressDto(),
            Category = order.Category.ToSummary(),
            Client = order.Client.ToSummary(),
            Master = order.Master?.ToSummary()
        };

    public static CityResponse ToCityResponse(this City city)
        => new()
        {
            Id = city.Id,
            Name = city.Name
        };

    public static DistrictResponse ToDistrictResponse(this District district)
        => new()
        {
            Id = district.Id,
            Name = district.Name,
            CityId = district.CityId
        };
}
