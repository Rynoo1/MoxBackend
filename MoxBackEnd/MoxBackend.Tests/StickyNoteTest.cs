using Xunit;
using Microsoft.EntityFrameworkCore;
using MoxBackEnd.Data;
using MoxBackEnd.Models;
using MoxBackEnd.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class StickyNoteServiceTests
{
    private AppDbContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase("StickyNoteTestDb_" + Guid.NewGuid())
            .Options;

        return new AppDbContext(options);
    }

    [Fact]
    public async Task CreateNoteAsync_SavesNoteSuccessfully()
    {
        var context = GetInMemoryDbContext();
        var service = new StickyNoteService(context);

        var note = new StickyNote
        {
            Content = "Test note",
            ProjectID = 1,
            TaskId = 5,
            CreatedByUserId = "user123",
            ColorHex = "#FFFFFF"
        };

        var result = await service.CreateNoteAsync(note);

        Assert.NotNull(result);
        Assert.Equal("Test note", result.Content);
        Assert.Single(context.StickyNotes);
    }

    [Fact]
    public async Task GetNotesByUserAsync_ReturnsOnlyUserNotes()
    {
        var context = GetInMemoryDbContext();
        context.StickyNotes.AddRange(new List<StickyNote>
        {
            new StickyNote { CreatedByUserId = "user123", Content = "User 1 Note" },
            new StickyNote { CreatedByUserId = "user456", Content = "User 2 Note" },
            new StickyNote { CreatedByUserId = "user123", Content = "User 1 Note 2" }
        });
        await context.SaveChangesAsync();

        var service = new StickyNoteService(context);
        var result = await service.GetNotesByUserAsync("user123");

        Assert.Equal(2, result.Count);
        Assert.All(result, n => Assert.Equal("user123", n.CreatedByUserId));
    }

    [Fact]
    public async Task UpdateNoteAsync_UpdatesExistingNote()
    {
        var context = GetInMemoryDbContext();
        var note = new StickyNote { Id = 1, Content = "Original", ColorHex = "#000000" }; // Changed NoteID to Id
        context.StickyNotes.Add(note);
        await context.SaveChangesAsync();

        var service = new StickyNoteService(context);
        var updated = new StickyNote { Content = "Updated content", ColorHex = "#FF00FF" };

        var result = await service.UpdateNoteAsync(1, updated);

        Assert.NotNull(result);
        Assert.Equal("Updated content", result!.Content);
        Assert.Equal("#FF00FF", result.ColorHex);
        Assert.True(result.UpdatedAt <= DateTime.UtcNow);
    }

    [Fact]
    public async Task DeleteNoteAsync_RemovesNoteIfExists()
    {
        var context = GetInMemoryDbContext();
        var note = new StickyNote { Id = 2, Content = "To be deleted" }; // Changed NoteID to Id
        context.StickyNotes.Add(note);
        await context.SaveChangesAsync();

        var service = new StickyNoteService(context);
        var deleted = await service.DeleteNoteAsync(2);

        Assert.True(deleted);
        Assert.Empty(context.StickyNotes);
    }
}