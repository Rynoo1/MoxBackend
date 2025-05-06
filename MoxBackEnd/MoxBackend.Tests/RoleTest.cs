using Xunit;
using Moq;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using MoxBackEnd.Data;
using MoxBackEnd.Models;
using MoxBackEnd.Services;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

public class RoleServiceTests
{
    private AppDbContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: "RoleServiceTestDb_" + Guid.NewGuid())
            .Options;

        return new AppDbContext(options);
    }

    [Fact]
    public async Task SetRole_UserWithAdminPermission_SetsRoleSuccessfully()
    {
        // Arrange
        var context = GetInMemoryDbContext();

        var userId = "user123";
        var projectId = 1;
        var roleId = 2;
        var adminRoleId = 99;

        context.Users.Add(new Users { Id = userId });
        context.Projects.Add(new Projects { ProjectID = projectId });
        context.AppRoles.Add(new AppRoles { UserID = userId, RoleID = adminRoleId });

        await context.SaveChangesAsync();

        var configMock = new Mock<IConfiguration>();
        configMock.Setup(c => c.GetValue<int>("AppSettings:AdminRoleId")).Returns(adminRoleId);

        var service = new RoleService(context, configMock.Object);

        // Act
        var result = await service.SetRole(userId, projectId, roleId);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(userId, result.UserID);
        Assert.Equal(projectId, result.ProjectID);
        Assert.Equal(roleId, result.RoleID);
    }
}