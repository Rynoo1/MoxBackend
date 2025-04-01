using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MoxBackEnd.Interfaces;

public interface ITask
{
    int Id { get; set; }
    string Title { get; set; }
    string Description { get; set; }
    DateTime DueDate { get; set; }
    int ProjectId { get; set; }
}
