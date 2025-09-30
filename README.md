# Asment Task Manager 📝

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

A simple yet powerful task management web application designed for Asment Témara as part of an internship project. This application provides a clean, modern interface for managing tasks across different departments, with role-based access and insightful analytics. All data is stored in-memory for demonstration purposes and will be reset on application refresh.

---

## ✨ Features

This application provides a comprehensive task management experience with a modern, responsive interface.

### 📝 Task Management
- **CRUD Operations**: Create, view, update, and manage tasks.
- **Detailed View**: Access detailed information for each task, including description, history, and comments.
- **Image Uploads**: Attach "before" and "after" photos for task verification.
- **Status Tracking**: Follow tasks through their lifecycle: 'À faire', 'En cours', 'En attente de validation', 'Terminée', 'En retard'.
- **Task Creation Wizard**: A guided, multi-step process for creating new tasks, with an option to use templates.

### 📊 Dashboard & Analytics
- **Data Visualization**: View task statistics with interactive charts powered by Recharts.
- **Key Metrics**: Track total tasks, completion rates, delayed tasks, and more.
- **Departmental Analysis**: Analyze task completion by department and priority distribution.
- **Advanced Filtering**: Filter dashboard data by date range, department, category, priority, and status.

### 🔐 User & Access Control
- **Authentication**: A secure (demo) login system.
- **Role-Based Views**: The interface adapts based on user roles (Admin, Chef de Département, Ingénieur, Technicien).
- **Protected Routes**: Ensures only authenticated users can access the main application.
- **Personalized Task Lists**: Users can view tasks specifically assigned to them.

### 🎨 UI/UX
- **Responsive Design**: A seamless experience on desktop, tablet, and mobile devices.
- **Light & Dark Mode**: A theme switcher allows users to choose their preferred appearance (Light, Dark, or System-based).
- **Intuitive Navigation**: A clean sidebar and header provide easy access to all features.
- **Real-Time Feel**: In-memory data manipulation provides a fast and responsive user experience.

---

## 🛠️ Tech Stack

- **Frontend Framework:** **React** with **TypeScript** for a robust, scalable, and type-safe user interface.
- **Styling:** **Tailwind CSS** for a utility-first, modern, and responsive design system.
- **Routing:** **React Router DOM** for efficient client-side navigation.
- **Data Visualization:** **Recharts** for creating beautiful and interactive charts.
- **State Management:** **React Context API** for managing global application state like authentication and theme.
- **Mock Backend:** A simulated API service (`services/api.ts`) manages in-memory data, mimicking real-world asynchronous operations without needing a database.
- **Icons:** **Lucide React** for a clean and consistent icon set.

---

## 📋 Prerequisites

Before you begin, ensure you have the following:

- **A modern web browser** (e.g., Chrome, Firefox, Safari, Edge).
- That's it! No complex setup is required.

---

## 🚀 Getting Started

This is a static, frontend-only application that runs entirely in the browser.

### 1. Clone the Repository (Optional)

If you have the files locally, you can skip this step.

```bash
git clone https://github.com/Mizuch1/asment-task-manager.git
cd asment-task-manager
```

### 2. Run the Application

Simply open the `index.html` file in your web browser.

### 3. Log In

On the login page, you can use the quick-login buttons for different roles:
- **Chef**: `chef.production@asment.ma`
- **Ingénieur**: `ilyass.ait@asment.ma`
- **Technicien**: `ahmed.tech@asment.ma`

The password for all demo accounts is `demo123`.

---

## 📁 Project Structure

```
asment-task-manager/
├── index.html            # Main HTML entry point
├── index.tsx             # Main React application entry
├── App.tsx               # Root component with routing setup
├── components/           # Reusable React components (Layout, UI elements)
│   ├── layout/
│   ├── ProtectedRoute.tsx
│   └── ThemeSwitcher.tsx
├── contexts/             # React Context providers (Auth, Theme)
├── hooks/                # Custom React hooks (useAuth, useTheme)
├── pages/                # Page components for each route
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Departments.tsx
│   └── ...
├── services/             # API service layer (mock API)
│   └── api.ts
├── types.ts              # TypeScript type definitions
├── constants.ts          # Application constants
└── README.md             # This file
```

---

## 🎯 Usage

- **Dashboard**: Get a high-level overview of all tasks and performance metrics.
- **Départements**: As a manager, oversee tasks and team members within specific departments.
- **Mes Tâches**: As an engineer or technician, view and manage your assigned tasks.
- **Créer une Tâche**: Use the multi-step wizard to create new tasks, either from a template or from scratch.
- **Profil & Paramètres**: View your user profile and customize application settings, such as the theme.

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
      <img src="images%20for%20read%20me/Detailed%20Task%20View%20Tracking%20and%20Verification.png" alt="Task Detail View" width="100%">
      <br>
      <em>Task Detail View</em>
    </td>
  </tr>
</table>

### 📱 Mobile Responsive View
<table>
  <tr>
    <td align="center">
      <img src="images%20for%20read%20me/login%20page%20mobile.PNG" alt="Mobile Login" width="40%">
      <br>
      <em>Mobile Login Screen</em>
    </td>
    <td align="center">
      <img src="images%20for%20read%20me/Multi-Step%20Task%20Creation%20Wizard%20(Dark%20Mode).jpg" alt="Mobile My Tasks" width="40%">
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
      <img src="images%20for%20read%20me/Technical%20Flow%20React%20SPA%20to%20Backend%20Services.png" alt="Technical Architecture" width="100%">
      <br>
      <em>Technical Flow Architecture</em>
    </td>
  </tr>
</table>

</div>

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page if it exists.

### How to Contribute:
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the `LICENSE` file for details.

---

## 👤 Author

**Mizuchi (Mohamed Jbilou)**

- GitHub: [@Mizuch1](https://github.com/Mizuch1)
- Email: `mohamed.jbilou.it@gmail.com`

---

## 🙏 Acknowledgments

- Built with ❤️ using React, TypeScript, and modern web technologies.
- Special thanks to the open-source community for providing amazing tools and libraries.
- All data is for demonstration purposes only.

---

_Made with ☕ and 💻 by Mizuchi_
