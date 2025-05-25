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
    public async Task GetMeetingsByProjectAsync_ReturnsCorrectMeetings()
    {
        // Arrange
        var context = GetInMemoryDbContext();

        context.EmergencyMeetings.AddRange(new List<EmergencyMeeting>
        {
            new EmergencyMeeting { Id = 1, ProjectID = 1, Title = "Project 1 Meeting" },
            new EmergencyMeeting { Id = 2, ProjectID = 2, Title = "Project 2 Meeting" },
            new EmergencyMeeting { Id = 3, ProjectID = 1, Title = "Project 1 Meeting 2" }
        });

        await context.SaveChangesAsync();

        var service = new EmergencyMeetingService(context);

        // Act
        var result = await service.GetMeetingsByProjectAsync(1);

        // Assert
        Assert.Equal(2, result.Count);
        Assert.All(result, m => Assert.Equal(1, m.ProjectID));
    }
}