using System;
using MoxBackEnd.Models;

namespace MoxBackEnd.Interfaces;

public interface IProjects
{
    Task<Projects> CreateProjectAsync(Projects projects); // takes in a param of type project - all the data has already been put into an object - add this object to the DB (where is the object created/populated?)
    Task<Projects> AddUserAsync(Users user);

    Task<List<Projects>> GetAllProjects();
    Task<Projects?> GetProjectById(int id);
    Task<Projects?> UpdateProjectAsync(int id, Projects project);
    Task<bool> DeleteProjectAsync(int id);
    
}
