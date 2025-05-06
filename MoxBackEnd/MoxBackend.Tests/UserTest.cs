using Xunit;
using Moq;
using Microsoft.AspNetCore.Identity;
using MoxBackEnd.Models;
using MoxBackEnd.Services;
using MoxBackEnd.Exceptions;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using System;

public class UserServiceTests
{
    private Mock<UserManager<Users>> GetMockUserManager()
    {
        var store = new Mock<IUserStore<Users>>();
        return new Mock<UserManager<Users>>(store.Object, null, null, null, null, null, null, null, null);
    }

    private Mock<SignInManager<Users>> GetMockSignInManager(UserManager<Users> userManager)
    {
        return new Mock<SignInManager<Users>>(
            userManager,
            Mock.Of<Microsoft.AspNetCore.Http.IHttpContextAccessor>(),
            Mock.Of<IUserClaimsPrincipalFactory<Users>>(),
            null, null, null, null);
    }

    [Fact]
    public async Task RegisterUser_ValidUser_ReturnsSuccess()
    {
        // Arrange
        var userManager = GetMockUserManager();
        var signInManager = GetMockSignInManager(userManager.Object);

        var newUser = new Users { Email = "test@example.com" };

        userManager.Setup(u => u.FindByEmailAsync(It.IsAny<string>()))
                   .ReturnsAsync((Users)null!);

        userManager.Setup(u => u.CreateAsync(It.IsAny<Users>(), "Password123!"))
                   .ReturnsAsync(IdentityResult.Success);

        var service = new UserService(null!, userManager.Object, signInManager.Object);

        // Act
        var (Succeeded, Errors) = await service.RegisterUser(newUser, "Password123!");

        // Assert
        Assert.True(Succeeded);
        Assert.Empty(Errors);
    }

    [Fact]
    public async Task LoginUser_InvalidPassword_ReturnsError()
    {
        var userManager = GetMockUserManager();
        var signInManager = GetMockSignInManager(userManager.Object);

        var testUser = new Users { Email = "test@example.com" };

        userManager.Setup(u => u.FindByEmailAsync(It.IsAny<string>()))
                   .ReturnsAsync(testUser);

        signInManager.Setup(s => s.CheckPasswordSignInAsync(testUser, "wrongpass", false))
                     .ReturnsAsync(SignInResult.Failed);

        var service = new UserService(null!, userManager.Object, signInManager.Object);

        var result = await service.LoginUser("test@example.com", "wrongpass");

        Assert.Equal("Password is incorrect", result);
    }

    [Fact]
    public async Task GetUserWithID_ThrowsException_WhenUserNotFound()
    {
        var userManager = GetMockUserManager();
        var signInManager = GetMockSignInManager(userManager.Object);

        userManager.Setup(u => u.FindByIdAsync(It.IsAny<string>()))
                   .ReturnsAsync((Users)null!);

        var service = new UserService(null!, userManager.Object, signInManager.Object);

        await Assert.ThrowsAsync<UserNotFoundException>(() => service.GetUserWithID("fakeID"));
    }
}