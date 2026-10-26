# Admin Dashboard

A full-stack web application built with Angular and ASP.NET Core, designed to provide an administrative interface with backend API integration and SQL Server database connectivity.

## 🚀 Technologies Used

### Frontend
- Angular
- TypeScript
- HTML5
- CSS3

### Backend
- C#
- ASP.NET Core Web API
- RESTful APIs

### Database
- Microsoft SQL Server

## ✨ Key Features

- Full-stack architecture with separate frontend and backend applications.
- Integration between Angular and ASP.NET Core through REST APIs.
- Database connectivity using SQL Server.
- Data retrieval and management through backend services.
- Responsive and user-friendly dashboard interface.

## 🏗️ Architecture

The application consists of three main components:

- **Frontend:** Angular handles the user interface and communicates with the backend.
- **Backend:** ASP.NET Core Web API processes requests and manages application logic.
- **Database:** SQL Server stores and manages application data.

## ⚙️ Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js and npm](https://nodejs.org/)
- [Angular CLI](https://angular.dev/tools/cli)
- [.NET SDK](https://dotnet.microsoft.com/download)
- [Microsoft SQL Server](https://www.microsoft.com/en-us/sql-server)

### 1. Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd <YOUR_PROJECT_FOLDER>
```

### 2. Run the Backend

Navigate to the ASP.NET Core project directory:

```bash
cd <BACKEND_PROJECT_FOLDER>
dotnet restore
dotnet run
```

Configure the SQL Server connection string in `appsettings.json` or through the appropriate configuration settings before running the application.

### 3. Run the Frontend

Open a new terminal and navigate to the Angular project directory:

```bash
cd <FRONTEND_PROJECT_FOLDER>
npm install
ng serve -o
```

The Angular application will run at `http://localhost:4200` by default.

### 4. Connect Frontend and Backend

Make sure the Angular application's API configuration points to the correct ASP.NET Core backend URL and that the backend is running.

## 🔒 Configuration & Security

- Configure database connection strings locally.
- Do not commit passwords, API keys, or other sensitive credentials.
- Ensure the frontend API URL matches the backend environment.

## 👩‍💻 Author

**Hager Hamdy**

[GitHub Profile](https://github.com/hagerhamdy816-cloud)

---

*This project demonstrates full-stack web development using Angular, ASP.NET Core, REST APIs, and SQL Server.*
