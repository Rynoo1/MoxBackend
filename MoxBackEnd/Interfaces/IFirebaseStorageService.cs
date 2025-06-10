namespace MoxBackEnd.Interfaces
{
    public interface IFirebaseStorageService
    {
        Task DeleteFileAsync(string FilePath);
    }
}