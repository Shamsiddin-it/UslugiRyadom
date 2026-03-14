namespace UslugiRyadom.Api.DTOs.Admin;

public class AdminStatsResponse
{
    public int TotalUsers { get; set; }

    public int TotalClients { get; set; }

    public int TotalMasters { get; set; }

    public int VerifiedMasters { get; set; }

    public int TotalOrders { get; set; }

    public int ActiveOrders { get; set; }

    public int CompletedOrders { get; set; }

    public int CancelledOrders { get; set; }

    public int TotalCategories { get; set; }
}
