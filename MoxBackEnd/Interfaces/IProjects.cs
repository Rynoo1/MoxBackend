using System;
using MoxBackEnd.Models;

namespace MoxBackEnd.Interfaces;

public interface IProjects
{
    int Id { get; set; }
    string Name { get; set; }
    string Description { get; set; }
    DateTime StartDate { get; set; }
    DateTime EndDate { get; set; }
}
