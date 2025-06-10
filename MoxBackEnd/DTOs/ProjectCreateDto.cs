
using MoxBackEnd.DTOs;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MoxBackEnd.Dtos;

public class ProjectCreateDto
{
    public int ProjectID { get; set; }

    [Required]
    public string ProjectName { get; set; } = string.Empty;

    public DateTime? DueDate { get; set; }

    public List<TaskCreateDto> Tasks { get; set; } = new();
}

