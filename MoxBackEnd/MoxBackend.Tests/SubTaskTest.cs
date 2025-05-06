using Xunit;
using Microsoft.EntityFrameworkCore;
using MoxBackEnd.Data;
using MoxBackEnd.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

public class SubTasksTests
{
    private AppDbContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase("SubTasksTestDb_" + Guid.NewGuid())
            .Options;

        return new AppDbContext(options);
    }

    [Fact]
    public async Task CreateSubTask_SavesToDatabaseSuccessfully()
    {
        // Arrange
        var context = GetInMemoryDbContext();
        var subtask = new SubTasks
        {
            ProjectID = 1,
            Title = "Write Unit Tests",
            Description = "Write tests for the SubTask model",
            DueDate = DateTime.UtcNow.AddDays(3),
            SubTStatus = WorkStatus.InProgress,
            Priority = PriorityLevel.High,
            IsEmergency = false,
            TaskId = null
        };

        // Act
        context.SubTasks.Add(subtask);
        await context.SaveChangesAsync();

        // Assert
        var saved = await context.SubTasks.FirstOrDefaultAsync(s => s.Title == "Write Unit Tests");
        Assert.NotNull(saved);
        Assert.Equal(WorkStatus.InProgress, saved!.SubTStatus);
        Assert.Equal(PriorityLevel.High, saved.Priority);
        Assert.Equal("Write tests for the SubTask model", saved.Description);
        Assert.Equal(1, saved.ProjectID);
    }
}