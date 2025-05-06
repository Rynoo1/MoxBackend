using Xunit;
using Microsoft.EntityFrameworkCore;
using MoxBackEnd.Data;
using MoxBackEnd.Models;
using MoxBackEnd.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

public class TaskServiceTests
{
    private AppDbContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase("TaskServiceTestDb_" + Guid.NewGuid())
            .Options;

        return new AppDbContext(options);
    }

    [Fact]
    public async Task CreateTaskAsync_SavesTaskSuccessfully()
    {
        var context = GetInMemoryDbContext();
        var service = new TaskService(context);

        var task = new Tasks
        {
            Title = "Design UI",
            Description = "Create frontend layout",
            DueDate = DateTime.UtcNow.AddDays(5),
            ProjectID = 1,
            Status = WorkStatus.NotStarted,
            Priority = PriorityLevel.Medium,
            IsEmergency = false
        };

        var result = await service.CreateTaskAsync(task);

        Assert.NotNull(result);
        Assert.Equal("Design UI", result.Title);
        Assert.Equal(1, context.Tasks.Count());
    }

    [Fact]
    public async Task GetTasksByPriorityAsync_ReturnsOnlyMatchingTasks()
    {
        var context = GetInMemoryDbContext();
        context.Tasks.AddRange(new[]
        {
            new Tasks { Title = "Urgent", Priority = PriorityLevel.High },
            new Tasks { Title = "Normal", Priority = PriorityLevel.Medium }
        });
        await context.SaveChangesAsync();

        var service = new TaskService(context);
        var result = await service.GetTasksByPriorityAsync(PriorityLevel.High);

        Assert.Single(result);
        Assert.Equal("Urgent", result.First().Title);
    }

    [Fact]
    public async Task UpdateTaskAsync_ChangesFieldsCorrectly()
    {
        var context = GetInMemoryDbContext();
        var original = new Tasks
        {
            TaskId = 1,
            Title = "Old Title",
            Description = "Old Desc",
            ProjectID = 1,
            Priority = PriorityLevel.Low,
            Status = WorkStatus.NotStarted,
            IsEmergency = false
        };

        context.Tasks.Add(original);
        await context.SaveChangesAsync();

        var service = new TaskService(context);

        var updated = new Tasks
        {
            Title = "Updated Task",
            Description = "Updated Desc",
            DueDate = DateTime.UtcNow.AddDays(2),
            Priority = PriorityLevel.High,
            Status = WorkStatus.Completed,
            IsEmergency = true
        };

        var result = await service.UpdateTaskAsync(1, updated);

        Assert.NotNull(result);
        Assert.Equal("Updated Task", result!.Title);
        Assert.True(result.IsEmergency);
        Assert.Equal(WorkStatus.Completed, result.Status);
    }

    [Fact]
    public async Task DeleteTaskAsync_RemovesTaskSuccessfully()
    {
        var context = GetInMemoryDbContext();
        context.Tasks.Add(new Tasks { TaskId = 2, Title = "To delete" });
        await context.SaveChangesAsync();

        var service = new TaskService(context);
        var deleted = await service.DeleteTaskAsync(2);

        Assert.True(deleted);
        Assert.Empty(context.Tasks);
    }
}