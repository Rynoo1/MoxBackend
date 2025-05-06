using Xunit;
using Microsoft.EntityFrameworkCore;
using MoxBackEnd.Data;
using MoxBackEnd.Models;
using MoxBackEnd.Services;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

public class EmergencyMeetingServiceTests
{
    private AppDbContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: "EmergencyMeetingsDb_" + Guid.NewGuid())
            .Options;

        return new AppDbContext(options);
    }

    [Fact]
    public async Task GetMeetingsByGroupAsync_ReturnsCorrectMeetings()
    {
        // Arrange
        var context = GetInMemoryDbContext();

        context.EmergencyMeetings.AddRange(new List<EmergencyMeeting>
        {
            new EmergencyMeeting { Id = 1, GroupID = "G1", Title = "G1 Meeting" },
            new EmergencyMeeting { Id = 2, GroupID = "G2", Title = "G2 Meeting" },
            new EmergencyMeeting { Id = 3, GroupID = "G1", Title = "G1 Meeting 2" }
        });

        await context.SaveChangesAsync();

        var service = new EmergencyMeetingService(context);

        // Act
        var result = await service.GetMeetingsByGroupAsync("G1");

        // Assert
        Assert.Equal(2, result.Count);
        Assert.All(result, m => Assert.Equal("G1", m.GroupID));
    }
}