using Xunit;
using Microsoft.EntityFrameworkCore;
using MoxBackEnd.Data;
using MoxBackEnd.Models;
using MoxBackEnd.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class ProjectServiceTests
{
    private AppDbContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase("ProjectServiceTestDb_" + Guid.NewGuid())
            .Options;

        return new AppDbContext(options);
    }

    [Fact]
    public async Task AddUserAsync_ShouldAddUserAndReturnRelatedProject()
    {
        // Arrange
        var context = GetInMemoryDbContext();

        var user = new Users { Id = "user1", UserName = "Tester" };
        var project = new Projects
        {
            ProjectID = 1,
            ProjectName = "Test Project",
            Users = new List<Users>()
        };

        context.Projects.Add(project);
        await context.SaveChangesAsync();

        var service = new ProjectService(context);

        // Act
        var result = await service.AddUserAsync(user);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Test Project", result.ProjectName);
        Assert.Contains(result.Users, u => u.Id == "user1");
    }
}