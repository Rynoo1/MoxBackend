using System.Threading.Tasks;

public interface IFirebaseStorageService
{
    Task DeleteFileAsync(string filePath);
}

public class FirebaseStorageService : IFirebaseStorageService
{
    public async Task DeleteFileAsync(string filePath)
    {
        
        await Task.CompletedTask;
    }
}