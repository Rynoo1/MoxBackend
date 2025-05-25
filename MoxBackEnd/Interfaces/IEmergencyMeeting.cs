using System;
using MoxBackEnd.Models;

namespace MoxBackEnd.Interfaces;

public interface IEmergencyMeeting
{
    Task<List<EmergencyMeeting>> GetAllMeetingsAsync();
    Task<List<EmergencyMeeting>> GetMeetingsByProjectAsync(int projectId);
    Task<List<EmergencyMeeting>> GetMeetingsByUserAsync(string userId);
    Task<EmergencyMeeting?> GetMeetingByIdAsync(int id);
    Task<EmergencyMeeting> CreateMeetingAsync(EmergencyMeeting meeting);
    Task<bool> CancelMeetingAsync(int id);

    Task<List<Users>> GetUsersByIdsAsync(List<string> ids);
}