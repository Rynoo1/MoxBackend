using Xunit;
using Microsoft.EntityFrameworkCore;
using MoxBackEnd.Data;
using MoxBackEnd.Models;
using MoxBackEnd.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

public class GroupServiceTests
{
    private AppDbContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: "GroupServiceTestDb_" + Guid.NewGuid())
            .Options;

        return new AppDbContext(options);
    }

    [Fact]
    public async Task AddUserToGroupAsync_UserIsAddedSuccessfully()
    {
        // Arrange
        var context = GetInMemoryDbContext();

        var user = new Users { Id = "user123", UserName = "TestUser" };
        var group = new Group { GroupID = "group456", GroupName = "TestGroup", Users = new List<Users>() };

        await context.Users.AddAsync(user);
        await context.Groups.AddAsync(group);
        await context.SaveChangesAsync();

        var service = new GroupService(context);

        // Act
        var result = await service.AddUserToGroupAsync("group456", "user123");

        // Assert
        Assert.True(result);

        var updatedGroup = await context.Groups.Include(g => g.Users).FirstOrDefaultAsync(g => g.GroupID == "group456");
        Assert.NotNull(updatedGroup);
        Assert.Single(updatedGroup.Users);
        Assert.Equal("user123", updatedGroup.Users.First().Id);
    }
}