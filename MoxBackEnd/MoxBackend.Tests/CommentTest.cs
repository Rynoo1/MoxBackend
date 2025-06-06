using Xunit;
using Microsoft.EntityFrameworkCore;
using MoxBackEnd.Data;
using MoxBackEnd.Models;
using MoxBackEnd.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class CommentServiceTests
{
    private AppDbContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase("CommentTestDb_" + Guid.NewGuid())
            .Options;

        return new AppDbContext(options);
    }

    [Fact]
    public async Task CreateCommentAsync_SavesCommentSuccessfully()
    {
        var context = GetInMemoryDbContext();
        var service = new CommentService(context);

        var comment = new Comment
        {
            Content = "Test comment",
            ProjectID = 1,
            TaskId = 5,
            CreatedByUserId = "user123"
        };

        var result = await service.CreateAsync(comment);

        Assert.NotNull(result);
        Assert.Equal("Test comment", result.Content);
        Assert.Single(context.Comments);
    }

    [Fact]
    public async Task GetCommentsByUserAsync_ReturnsOnlyUserComments()
    {
        var context = GetInMemoryDbContext();
        context.Comments.AddRange(new List<Comment>
        {
            new Comment { CreatedByUserId = "user123", Content = "User 1 Comment" },
            new Comment { CreatedByUserId = "user456", Content = "User 2 Comment" },
            new Comment { CreatedByUserId = "user123", Content = "User 1 Comment 2" }
        });
        await context.SaveChangesAsync();

        var service = new CommentService(context);
        var result = await service.GetByUserAsync("user123");

        Assert.Equal(2, result.Count);
        Assert.All(result, c => Assert.Equal("user123", c.CreatedByUserId));
    }

    [Fact]
    public async Task UpdateCommentAsync_UpdatesExistingComment()
    {
        var context = GetInMemoryDbContext();
        var comment = new Comment { CommentID = 1, Content = "Original" };
        context.Comments.Add(comment);
        await context.SaveChangesAsync();

        var service = new CommentService(context);
        var updated = new Comment { Content = "Updated content" };

        var result = await service.UpdateAsync(1, updated);

        Assert.NotNull(result);
        Assert.Equal("Updated content", result!.Content);
        Assert.True(result.UpdatedAt <= DateTime.UtcNow);
    }

    [Fact]
    public async Task DeleteCommentAsync_RemovesCommentIfExists()
    {
        var context = GetInMemoryDbContext();
        var comment = new Comment { CommentID = 2, Content = "To be deleted" };
        context.Comments.Add(comment);
        await context.SaveChangesAsync();

        var service = new CommentService(context);
        var deleted = await service.DeleteAsync(2);

        Assert.True(deleted);
        Assert.Empty(context.Comments);
    }
}