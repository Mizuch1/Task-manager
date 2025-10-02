# Asment Task Manager 📝

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/) [![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/) [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

A powerful, full-stack task management web application designed for Asment Témara. This application provides a clean, modern interface for managing tasks across different departments, with role-based access and insightful analytics, all backed by a robust PostgreSQL database.

_Made with ☕ and 💻 by Mizuchi_
>>>>>>> master
---
👤 Author

_Made with ☕ and 💻 by Mizuchi_
This application provides a comprehensive task management experience with a modern, responsive interface.

### 📝 Task Management
- **CRUD Operations**: Create, view, update, and manage tasks with persistent data storage.
- **Detailed View**: Access detailed information for each task, including description, history, and comments.
- **Image Uploads**: Attach "before" and "after" photos for task verification.
- **Status Tracking**: Follow tasks through their lifecycle: 'À faire', 'En cours', 'En attente de validation', 'Terminée', 'En retard'.
- **Task Creation Wizard**: A guided, multi-step process for creating new tasks.

### 📊 Dashboard & Analytics
- **Data Visualization**: View task statistics with interactive charts powered by Recharts.
- **Key Metrics**: Track total tasks, completion rates, delayed tasks, and more.
- **Departmental Analysis**: Analyze task completion by department and priority distribution.
- **Advanced Filtering**: Filter dashboard data by date range, department, category, priority, and status.

### 🔐 User & Access Control
- **Authentication**: A secure login system.
- **Role-Based Views**: The interface adapts based on user roles (Admin, Chef de Département, Ingénieur, Technicien).
- **Protected Routes**: Ensures only authenticated users can access the main application.
- **Personalized Task Lists**: Users can view tasks specifically assigned to them.

### 🎨 UI/UX
- **Responsive Design**: A seamless experience on desktop, tablet, and mobile devices.
- **Light & Dark Mode**: A theme switcher allows users to choose their preferred appearance (Light, Dark, or System-based).
- **Intuitive Navigation**: A clean sidebar and header provide easy access to all features.

---

## 🛠️ Tech Stack

- **Frontend:** **React** with **TypeScript** for a robust and type-safe user interface.
- **Backend:** **Node.js** with **Express** for a fast and scalable RESTful API.
- **Database:** **PostgreSQL** for reliable and relational data storage.
- **Styling:** **Tailwind CSS** for a utility-first, modern, and responsive design system.
- **Routing:** **React Router DOM** for efficient client-side navigation.
- **Data Visualization:** **Recharts** for creating beautiful and interactive charts.
- **State Management:** **React Context API** for managing global application state.
- **Icons:** **Lucide React** for a clean and consistent icon set.

---

## 🚀 Getting Started

This is a full-stack application that requires both a backend server and a frontend client running simultaneously.

### 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or newer)
- **npm** (usually comes with Node.js)
- **PostgreSQL** (a running local instance or access to a cloud-hosted database)
- **Git** (for cloning the repository)

### 1. Clone the Repository
```bash
git clone https://github.com/Mizuch1/asment-task-manager.git
cd asment-task-manager
```

### 2. Backend Setup

The backend server connects to your PostgreSQL database.

1.  **Navigate to the server directory:**
    ```bash
    cd server
    ```
2.  **Install backend dependencies:**
    ```bash
    npm install
    ```
3.  **Set up the Database:**
    - Create a new PostgreSQL database (e.g., `asment_task_manager`).
    - Create a new user (role) with a password and grant it privileges on the new database.
4.  **Configure Environment Variables:**
    - Create a new file named `.env` in the `server` directory.
    - Copy the contents from `.env.example` and fill in your `DATABASE_URL`.
      ```env
      # Example:
      DATABASE_URL="postgresql://your_db_user:your_db_password@localhost:5432/asment_task_manager"
      ```
5.  **Initialize the Database Schema:**
    - Run the `init.sql` script to create all the tables. Make sure to replace `your_db_user` with your actual username.
    ```bash
    psql -U your_db_user -d asment_task_manager -f init.sql
    ```
6.  **Seed the Database:**
    - Run the seed script to populate the database with initial users so you can log in.
    ```bash
    node seed.js
    ```

### 3. Frontend Setup

1.  **Navigate back to the root directory:**
    ```bash
    cd ..
    ```
2.  **Install frontend dependencies:**
    ```bash
    npm install
    ```

### 4. Run the Application

1.  **Start the Backend Server:**
    - In the `/server` directory, run:
    ```bash
    npm run dev
    ```
    The backend will start on `http://localhost:3001` by default.

2.  **Start the Frontend Client:**
    - In a **new terminal window**, from the root project directory, run:
    ```bash
    npm run dev
    ```
    The frontend will open in your browser, usually at `http://localhost:5173`.

### 5. Log In

You can now log in with the demo accounts. The password for all accounts is `demo123`.
- **Chef**: `chef.production@asment.ma`
- **Ingénieur**: `ilyass.ait@asment.ma`
- **Technicien**: `ahmed.tech@asment.ma`

---

## 🎯 Usage

- **Dashboard**: Get a high-level overview of all tasks and performance metrics.
- **Départements**: As a manager, oversee tasks and team members within specific departments.
- **Mes Tâches**: As an engineer or technician, view and manage your assigned tasks.
- **Créer une Tâche**: Use the multi-step wizard to create new tasks, either from a template or from scratch.
- **Profil & Paramètres**: View your user profile and customize application settings, such as the theme.

---

## 📁 Project Structure

```
asment-task-manager/
├── server/                 # Node.js Backend
│   ├── src/
│   │   ├── routes/
│   │   ├── index.js        # Express server entry point
│   │   └── db.js           # Database connection
│   ├── .env.example
│   ├── init.sql            # Database schema
│   ├── package.json
│   └── seed.js             # Database seeder
├── src/                    # React Frontend (details in old readme)
│   ├── components/
│   ├── contexts/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   │   └── api.ts          # Frontend API service layer
│   └── ...
├── package.json
└── README.md               # This file
```

## 🧹 Cleaned Up Files

The following unnecessary test and setup files have been removed:
- `server/test-login.js` - Old test file
- `server/check-db.js` - Old database check file  
- `server/setup-db.js` - Old database setup file
- `test-login.html` - Old HTML test file

These files were no longer needed for the production application and have been cleaned up for better project organization.

---

## 📸 Screenshots

<div align="center">

### 🖥️ Main Application Interface
<table>
  <tr>
    <td align="center">
      <img src="images%20for%20read%20me/tableau%20de%20Bord.PNG" alt="Dashboard View" width="100%">
      <br>
      <em>Dashboard View</em>
    </td>
    <td align="center">
      <img src="images%20for%20read%20me/login%20page%20mobile.PNG" alt="Task Detail View" width="100%">
      <br>
      <em>Mobile Login Screen</em>
    </td>
  </tr>
</table>

### 📱 Mobile Responsive View
<table>
  <tr>
    <td align="center">
      <img src="images%20for%20read%20me/Detailed%20Task%20View%20Tracking%20and%20Verification.png" alt="Mobile Login" width="100%">
      <br>
      <em>Task Detail View</em>
    </td>
    <td align="center">
      <img src="images%20for%20read%20me/Multi-Step%20Task%20Creation%20Wizard%20(Dark%20Mode).jpg" alt="Mobile My Tasks" width="100%">
      <br>
      <em>Task Creation Wizard (Dark Mode)</em>
    </td>
  </tr>
</table>

### 📊 Department Management & Analytics
<table>
  <tr>
    <td align="center">
      <img src="images%20for%20read%20me/Gestion%20des%20Départements.PNG" alt="Department Management" width="100%">
      <br>
      <em>Department Management</em>
    </td>
    <td align="center">
      <img src="images%20for%20read%20me/Departmental%20Analytics%20and%20Management%20(Metrics%20View).jpg" alt="Departmental Analytics" width="100%">
      <br>
      <em>Departmental Analytics</em>
    </td>
  </tr>
</table>

### 🏗️ Technical Architecture
<table>
  <tr>
    <td align="center">
      <img src="images%20for%20read%20me/Technical%20Flow%20React%20SPA%20to%20Backend%20Services.png" alt="Technical Architecture" width="100%" height="400">
      <br>
      <em>Technical Flow Architecture</em>
    </td>
  </tr>
</table>

</div>

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

### How to Contribute:
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 📞 Let's Connect!

<div align="center">

[![Email](https://img.shields.io/badge/Email-mohamed.jbilou.it@gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:mohamed.jbilou.it@gmail.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/mohamedjbilou/)
[![Portfolio](https://img.shields.io/badge/Portfolio-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://my-portfolio-iota-ten-95.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Mizuch1)

</div>

---

## 🙏 Acknowledgments

- Built with ❤️ using React, TypeScript, and modern web technologies.
- Special thanks to the open-source community for providing amazing tools and libraries.

---
� Author


=======
_Made with ☕ and 💻 by Mizuchi_
>>>>>>> master
