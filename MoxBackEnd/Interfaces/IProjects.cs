using System;

namespace MoxBackEnd.Interfaces;

public interface IProject
{
    int Id { get; set; }
    string Name { get; set; }
    string Description { get; set; }
    DateTime StartDate { get; set; }
    DateTime EndDate { get; set; }
}
