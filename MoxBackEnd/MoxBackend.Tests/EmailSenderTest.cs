using Xunit;
using Moq;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MoxBackEnd.Services;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using System.Threading.Tasks;
using System;

public class EmailSenderTests
{
    [Fact]
    public async Task SendEmailAsync_ValidInput_LogsAndSendsEmail()
    {
        // Arrange
        var configMock = new Mock<IConfiguration>();
        var loggerMock = new Mock<ILogger<EmailSender>>();

        var mockConfigSection = new Mock<IConfigurationSection>();
        mockConfigSection.Setup(x => x.Value).Returns("test@example.com");
        configMock.Setup(c => c["EmailSettings:From"]).Returns("noreply@example.com");
        configMock.Setup(c => c["EmailSettings:SmtpServer"]).Returns("smtp.example.com");
        configMock.Setup(c => c["EmailSettings:Port"]).Returns("587");
        configMock.Setup(c => c["EmailSettings:Username"]).Returns("user");
        configMock.Setup(c => c["EmailSettings:Password"]).Returns("pass");

        var emailSender = new EmailSender(configMock.Object, loggerMock.Object);

        // Act & Assert
        var exception = await Record.ExceptionAsync(() => emailSender.SendEmailAsync("to@example.com", "Test Subject", "<p>Hello</p>"));

        Assert.NotNull(exception);
        loggerMock.Verify(
            l => l.Log(
                LogLevel.Information,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) => v.ToString().Contains("Attempting to send email")),
                It.IsAny<Exception>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
            Times.Once);
    }
}