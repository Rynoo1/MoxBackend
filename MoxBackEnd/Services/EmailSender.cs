using System;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using Microsoft.AspNetCore.Identity.UI.Services;
using MoxBackEnd.Models;

namespace MoxBackEnd.Services;

public class EmailSender : IEmailSender
{

    private readonly IConfiguration _config;
    private readonly ILogger<EmailSender> _logger;

    public EmailSender(IConfiguration config, ILogger<EmailSender> logger)
    {
        _config = config;
        _logger = logger;
    }

    public async Task SendEmailAsync(string email, string subject, string htmlMessage)
    {
        try
        {
            _logger.LogInformation("Attempting to send email to {Email}", email);

            
            var emailMessage = new MimeMessage();
            emailMessage.From.Add(MailboxAddress.Parse(_config["EmailSettings:From"]));
            emailMessage.To.Add(MailboxAddress.Parse(email));
            emailMessage.Subject = subject;

            emailMessage.Body = new TextPart(MimeKit.Text.TextFormat.Html)
            {
                Text = htmlMessage
            };

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync(_config["EmailSettings:SmtpServer"],
                                            int.Parse(_config["EmailSettings:Port"]!),
                                            SecureSocketOptions.StartTls);
            
            await smtp.AuthenticateAsync(_config["EmailSettings:Username"],
                                        _config["EmailSettings:Password"]);

            await smtp.SendAsync(emailMessage);
            await smtp.DisconnectAsync(true);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email to {Email}: {Message}", email, ex.Message );
            throw;
        }
    }

}
