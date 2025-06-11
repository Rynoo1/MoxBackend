# MoxBackEnd

This is the backend API for the MOX project management system. It is built with ASP.NET Core and Entity Framework Core, using PostgreSQL as the database.

---

## Features

- User, Project, Task, Subtask, and Emergency Meeting management
- JWT-based authentication
- RESTful API endpoints
- Entity Framework Core with PostgreSQL
- CORS enabled for frontend integration

---

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [PostgreSQL](https://www.postgresql.org/download/)
- (Optional) [Visual Studio 2022+](https://visualstudio.microsoft.com/) or [VS Code](https://code.visualstudio.com/)

---

## Setup

1. **Clone the repository**

   ```sh
   git clone <your-repo-url>
   cd MoxBackend/MoxBackEnd
   ```

2. **Configure the database**

   Edit `appsettings.json` or `appsettings.Development.json` and set your PostgreSQL connection string.  
   Example for a live connection:
   ```json
```json
"ConnectionStrings": {
    "LiveConnection": "Host=YOUR_HOST;Port=YOUR_PORT;Database=YOUR_DATABASE;Username=YOUR_USERNAME;Password=YOUR_PASSWORD;"
},
"GoogleAuth": {
    "ClientId": "YOUR_GOOGLE_CLIENT_ID",
    "ClientSecret": "YOUR_GOOGLE_CLIENT_SECRET"
}
```
   ```
   Replace with your actual password.

3. **Apply database migrations**

   ```sh
   dotnet ef database update
   ```

   If you make changes to the models, create a new migration:
   ```sh
   dotnet ef migrations add <MigrationName>
   dotnet ef database update
   ```


4. **install all pakages**

   ```sh
   dotnet i
   ```

5. **Run the backend**

   ```sh
   dotnet run
   ```

   The API will be available at `http://localhost:5183` (or the port specified in `launchSettings.json`).

---

## API Endpoints

- `api/User` - User management
- `api/Project` - Project management
- `api/Task` - Task management
- `api/EmergencyMeeting` - Emergency meeting management
- ...and more

Use Swagger UI at `http://localhost:5183/swagger` for interactive API documentation.

---

## Troubleshooting

- **Database errors:**  
  Ensure PostgreSQL is running and your connection string is correct.
- **CORS issues:**  
  Make sure CORS is enabled in `Program.cs` for your frontend origin.
- **Port issues:**  
  If the backend is not running on `5183`, update your frontend API URLs to match.

---

## License

This project is for educational use. See [LICENSE](../LICENSE) for details.