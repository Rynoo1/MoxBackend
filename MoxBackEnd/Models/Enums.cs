namespace MoxBackEnd.Models
{
    public enum WorkStatus
    {
        NotStarted,
        InProgress,
        Completed,
        Canceled
    }

    public enum PriorityLevel
    {
        VeryLow = 1,
        Low = 2,
        Medium = 3,
        High = 4,
        Critical = 5
    }
}