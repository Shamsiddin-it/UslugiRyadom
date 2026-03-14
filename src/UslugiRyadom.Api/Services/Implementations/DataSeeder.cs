using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using UslugiRyadom.Api.Constants;
using UslugiRyadom.Api.Data;
using UslugiRyadom.Api.Entities;
using UslugiRyadom.Api.Enums;
using UslugiRyadom.Api.Helpers;
using UslugiRyadom.Api.Services.Interfaces;

namespace UslugiRyadom.Api.Services.Implementations;

public class DataSeeder : IDataSeeder
{
    private readonly AppDbContext _dbContext;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole<Guid>> _roleManager;

    public DataSeeder(
        AppDbContext dbContext,
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole<Guid>> roleManager)
    {
        _dbContext = dbContext;
        _userManager = userManager;
        _roleManager = roleManager;
    }

    public async Task SeedAsync(CancellationToken cancellationToken)
    {
        await _dbContext.Database.MigrateAsync(cancellationToken);
        await SeedRolesAsync();
        await SeedLocationsAsync(cancellationToken);
        await SeedCategoriesAsync(cancellationToken);
        await SeedUsersAndOrdersAsync(cancellationToken);
    }

    private async Task SeedRolesAsync()
    {
        foreach (var role in AppRoles.All)
        {
            if (!await _roleManager.RoleExistsAsync(role))
            {
                await _roleManager.CreateAsync(new IdentityRole<Guid>(role));
            }
        }
    }

    private async Task SeedLocationsAsync(CancellationToken cancellationToken)
    {
        if (await _dbContext.Cities.AnyAsync(cancellationToken))
        {
            return;
        }

        var cityNames = new[]
        {
            "Душанбе", "Худжанд", "Бохтар", "Куляб", "Турсунзаде", "Вахдат", "Гиссар", "Истаравшан",
            "Исфара", "Канибадам", "Пенджикент", "Нурек", "Левакант", "Бустон", "Гулистон", "Хорог",
            "Рогун", "Истиклол"
        };

        var districtMap = new Dictionary<string, string[]>
        {
            ["Душанбе"] = ["Сино", "Фирдавси", "Шохмансур", "Исомони"],
            ["Худжанд"] = ["20-мкр", "Панчшанбе", "Темурмалик"],
            ["Бохтар"] = ["Центр", "Борбад", "Дусти"],
            ["Куляб"] = ["Сомони", "Заршуй", "Чармгарон"],
            ["Турсунзаде"] = ["Регар", "Каратаг", "Навобод"],
            ["Вахдат"] = ["Гулистон", "Ромит", "Навбахор"],
            ["Гиссар"] = ["Шарора", "Навобод", "Чашмасор"],
            ["Истаравшан"] = ["Катта-кургон", "Сабзазор", "Калъаи Баланд"],
            ["Исфара"] = ["Навгилем", "Чоркух", "Сурх"],
            ["Канибадам"] = ["Кучкак", "Патар", "Санжидзор"],
            ["Пенджикент"] = ["Саразм", "Рудаки", "Зарринруд"],
            ["Нурек"] = ["Туткавол", "Дехиболо", "Маркази Шахр"],
            ["Левакант"] = ["Сарбанд", "Вахш", "Гулистон"],
            ["Бустон"] = ["Палос", "Шахрак", "Конибодом"],
            ["Гулистон"] = ["Адрасмон", "Куруксай", "Чорбог"],
            ["Хорог"] = ["Уплайн", "Бархорог", "Хлебзавод"],
            ["Рогун"] = ["Обигарм", "Кадиоб", "Шахраки Энергетик"],
            ["Истиклол"] = ["Табошар", "Сомониён", "Мехнатобод"]
        };

        var cityId = 1;
        var districtId = 1;
        var cities = cityNames.Select(name => new City
        {
            Id = cityId++,
            Name = name
        }).ToList();

        var districts = new List<District>();
        foreach (var city in cities)
        {
            foreach (var district in districtMap[city.Name])
            {
                districts.Add(new District
                {
                    Id = districtId++,
                    Name = district,
                    CityId = city.Id
                });
            }
        }

        await _dbContext.Cities.AddRangeAsync(cities, cancellationToken);
        await _dbContext.Districts.AddRangeAsync(districts, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    private async Task SeedCategoriesAsync(CancellationToken cancellationToken)
    {
        if (await _dbContext.Categories.AnyAsync(cancellationToken))
        {
            return;
        }

        var categoryNames = new[]
        {
            "сантехник", "электрик", "уборка", "ремонт техники", "доставка",
            "муж на час", "сборка мебели", "покраска", "плиточник", "кондиционеры"
        };

        var categories = categoryNames.Select(name => new Category
        {
            Id = Guid.NewGuid(),
            Name = name,
            Slug = SlugHelper.Generate(name),
            CreatedAt = DateTime.UtcNow
        });

        await _dbContext.Categories.AddRangeAsync(categories, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    private async Task SeedUsersAndOrdersAsync(CancellationToken cancellationToken)
    {
        if (await _dbContext.Users.AnyAsync(cancellationToken))
        {
            return;
        }

        await CreateUserAsync("admin@test.com", "Admin123!", "Администратор Системы", "+992900000001", UserRole.Admin, "Душанбе", "Исомони");
        var client1 = await CreateUserAsync("client1@test.com", "Client123!", "Фируз Каримов", "+992900000101", UserRole.Client, "Душанбе", "Сино");
        var client2 = await CreateUserAsync("client2@test.com", "Client123!", "Нилуфар Саидова", "+992900000102", UserRole.Client, "Худжанд", "Панчшанбе");
        var master1 = await CreateUserAsync("master1@test.com", "Master123!", "Мухаммаджон Юсуфи", "+992900000201", UserRole.Master, "Душанбе", "Фирдавси");
        var master2 = await CreateUserAsync("master2@test.com", "Master123!", "Абдулло Назаров", "+992900000202", UserRole.Master, "Худжанд", "20-мкр");

        var categories = await _dbContext.Categories.ToListAsync(cancellationToken);
        var plumber = categories.First(x => x.Slug == SlugHelper.Generate("сантехник"));
        var electrician = categories.First(x => x.Slug == SlugHelper.Generate("электрик"));
        var cleaning = categories.First(x => x.Slug == SlugHelper.Generate("уборка"));
        var appliances = categories.First(x => x.Slug == SlugHelper.Generate("ремонт техники"));

        var masterProfile1 = new MasterProfile
        {
            Id = Guid.NewGuid(),
            UserId = master1.Id,
            Profession = "Сантехник-универсал",
            Experience = 8,
            About = "Работаю по Душанбе, выезжаю быстро, помогаю с заменой смесителей, труб и устранением протечек.",
            Rating = 4.8m,
            IsVerified = true,
            City = master1.City,
            District = master1.District,
            Street = "улица Рудаки",
            House = "42",
            Landmark = "рядом с супермаркетом",
            CreatedAt = DateTime.UtcNow.AddDays(-30),
            MasterCategories = new List<MasterCategory>
            {
                new() { CategoryId = plumber.Id },
                new() { CategoryId = electrician.Id }
            }
        };

        var masterProfile2 = new MasterProfile
        {
            Id = Guid.NewGuid(),
            UserId = master2.Id,
            Profession = "Мастер по ремонту техники",
            Experience = 6,
            About = "Ремонтирую стиральные машины, холодильники и мелкую бытовую технику.",
            Rating = 4.5m,
            IsVerified = false,
            City = master2.City,
            District = master2.District,
            Street = "улица Сомониён",
            House = "15А",
            Landmark = "возле рынка",
            CreatedAt = DateTime.UtcNow.AddDays(-20),
            MasterCategories = new List<MasterCategory>
            {
                new() { CategoryId = appliances.Id },
                new() { CategoryId = cleaning.Id }
            }
        };

        await _dbContext.MasterProfiles.AddRangeAsync([masterProfile1, masterProfile2], cancellationToken);

        var orders = new[]
        {
            new Order
            {
                Id = Guid.NewGuid(),
                ClientId = client1.Id,
                Title = "Починить кран на кухне",
                Description = "Течет смеситель, нужен срочный выезд сегодня вечером.",
                CategoryId = plumber.Id,
                City = "Душанбе",
                District = "Сино",
                Street = "улица Айни",
                House = "18",
                Landmark = "около школы",
                Price = 150,
                PaymentType = PaymentType.Cash,
                Status = OrderStatus.New,
                CreatedAt = DateTime.UtcNow.AddDays(-2),
                UpdatedAt = DateTime.UtcNow.AddDays(-2)
            },
            new Order
            {
                Id = Guid.NewGuid(),
                ClientId = client2.Id,
                Title = "Ремонт стиральной машины",
                Description = "Стиральная машина не сливает воду.",
                CategoryId = appliances.Id,
                City = "Худжанд",
                District = "Панчшанбе",
                Street = "улица Гагарина",
                House = "7",
                Landmark = "рядом с аптекой",
                Price = 300,
                PaymentType = PaymentType.Card,
                Status = OrderStatus.Accepted,
                MasterId = master2.Id,
                CreatedAt = DateTime.UtcNow.AddDays(-4),
                UpdatedAt = DateTime.UtcNow.AddDays(-3)
            },
            new Order
            {
                Id = Guid.NewGuid(),
                ClientId = client1.Id,
                Title = "Нужна уборка после ремонта",
                Description = "Уборка двухкомнатной квартиры после косметического ремонта.",
                CategoryId = cleaning.Id,
                City = "Душанбе",
                District = "Фирдавси",
                Street = "улица Низоми",
                House = "10",
                Landmark = "новостройка у парка",
                Price = 450,
                PaymentType = PaymentType.Cash,
                Status = OrderStatus.Completed,
                MasterId = master2.Id,
                CreatedAt = DateTime.UtcNow.AddDays(-10),
                UpdatedAt = DateTime.UtcNow.AddDays(-7)
            }
        };

        await _dbContext.Orders.AddRangeAsync(orders, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    private async Task<ApplicationUser> CreateUserAsync(
        string email,
        string password,
        string fullName,
        string phone,
        UserRole role,
        string city,
        string district)
    {
        var user = new ApplicationUser
        {
            Id = Guid.NewGuid(),
            Email = email,
            UserName = email,
            FullName = fullName,
            PhoneNumber = phone,
            Role = role,
            City = city,
            District = district,
            Street = "Центральная улица",
            House = "1",
            Landmark = "рядом с остановкой",
            CreatedAt = DateTime.UtcNow.AddDays(-14),
            EmailConfirmed = true,
            PhoneNumberConfirmed = true
        };

        var result = await _userManager.CreateAsync(user, password);
        if (!result.Succeeded)
        {
            var errors = string.Join("; ", result.Errors.Select(x => x.Description));
            throw new InvalidOperationException($"Failed to seed user {email}: {errors}");
        }

        await _userManager.AddToRoleAsync(user, role switch
        {
            UserRole.Admin => AppRoles.Admin,
            UserRole.Master => AppRoles.Master,
            _ => AppRoles.Client
        });

        return user;
    }
}
