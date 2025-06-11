<!-- Banner -->
<p align="center">
  <img src="./Mockups/mox_banner.png" alt="Mox Banner"/>
</p>

<h2 align="center">Modern Project & Task Management App (Electron + React + TypeScript)</h2>

<!-- Badges -->
<p align="center">
  <a href="https://github.com/Rynoo1/MoxBackend/fork" target="_blank">
    <img src="https://img.shields.io/github/forks/Rynoo1/MoxBackend" alt="Forks Badge"/>
  </a>
  <a href="https://github.com/Rynoo1/MoxBackend/stargazers" target="_blank">
    <img src="https://img.shields.io/github/stars/Rynoo1/MoxBackend" alt="Stars Badge"/>
  </a>
  <a href="https://github.com/Rynoo1/MoxBackend/commits/main" target="_blank">
    <img src="https://img.shields.io/github/commit-activity/m/Rynoo1/MoxBackend" alt="Commits Badge"/>
  </a>
  <a href="https://github.com/Rynoo1/MoxBackend/commits/main" target="_blank">
    <img src="https://img.shields.io/github/last-commit/Rynoo1/MoxBackend" alt="Last Commit Badge"/>
  </a>
  <a href="https://github.com/Rynoo1/MoxBackend/issues" target="_blank">
    <img src="https://img.shields.io/github/issues/Rynoo1/MoxBackend" alt="Issues Badge"/>
  </a>
  <a href="https://github.com/Rynoo1/MoxBackend/pulls" target="_blank">
    <img src="https://img.shields.io/github/issues-pr/Rynoo1/MoxBackend" alt="Pull Requests Badge"/>
  </a>
  <a href="https://github.com/Rynoo1/MoxBackend/blob/main/LICENSE" target="_blank">
    <img alt="License Badge" src="https://img.shields.io/github/license/Rynoo1/MoxBackend?color=f85149">
  </a>
</p>

![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![DaisyUI](https://img.shields.io/badge/DaisyUI-purple?style=flat&logo=tailwind-css&logoColor=white)

---

# MoxBackend

A backend API built with .NET for the Mox project. This API supports task management, project filtering, and integrates with Firebase for file uploads. It also supports CRUD operations, Kanban-style status changes, and more.

> Development status: 🚧 In Progress

![License](https://img.shields.io/github/license/Rynoo1/MoxBackend?style=flat-square)
![Forks](https://img.shields.io/github/forks/Rynoo1/MoxBackend?style=flat-square)
![Stars](https://img.shields.io/github/stars/Rynoo1/MoxBackend?style=flat-square)
![Issues](https://img.shields.io/github/issues/Rynoo1/MoxBackend?style=flat-square)
![Pull Requests](https://img.shields.io/github/issues-pr/Rynoo1/MoxBackend?style=flat-square)

## Table of Contents

1. [Description](#description)
2. [Technologies & Tools](#technologies--tools)
3. [Core Features](#core-features)
4. [Installation](#installation)
5. [Run Development Servers](#run-development-servers)
6. [Authors and Acknowledgements](#authors-and-acknowledgements)
7. [Roadmap](#roadmap)
8. [Contributing](#contributing)
9. [Performance & SEO](#performance--seo)
10. [Conclusion](#conclusion)
11. [License](#license)
12. [Tools & Libraries](#tools--libraries)
13. [Resources and Credits](#resources-and-credits)


## Description

MOX is a cross-platform desktop application designed to support small neurodivergent teams with project management. It uses dopamine-driven interactions, visual hierarchy, and drag-and-drop tools to simplify workflows.

**Who it's for**: Teams and individuals who need structure without cognitive overload, including users with ADHD or visual impairments.  
**Why it exists**: Created for the DV300 Interactive Development course at Open Window as a response to the lack of inclusive, structured PM tools.


## Technologies & Tools

<p align="left">
  <a href="https://reactjs.org/" target="_blank">
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" alt="React" width="40" height="40"/>
  </a>
  <a href="https://www.typescriptlang.org/" target="_blank">
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" alt="TypeScript" width="40" height="40"/>
  </a>
  <a href="https://dotnet.microsoft.com/" target="_blank">
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/dot-net/dot-net-original.svg" alt=".NET Core" width="40" height="40"/>
  </a>
  <a href="https://www.postgresql.org/" target="_blank">
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original.svg" alt="PostgreSQL" width="40" height="40"/>
  </a>
  <a href="https://firebase.google.com/" target="_blank">
    <img src="https://www.vectorlogo.zone/logos/firebase/firebase-icon.svg" alt="Firebase" width="40" height="40"/>
  </a>
  <a href="https://tailwindcss.com/" target="_blank">
    <img src="https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg" alt="Tailwind CSS" width="40" height="40"/>
  </a>
  <a href="https://daisyui.com/" target="_blank">
    <img src="https://raw.githubusercontent.com/daisyui/daisyui/main/logo-500.svg" alt="DaisyUI" width="40" height="40"/>
  </a>
  <a href="https://www.electronjs.org/" target="_blank">
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/electron/electron-original.svg" alt="Electron" width="40" height="40"/>
  </a>
</p>

## Core Features

- Drag-and-Drop Kanban
- Sprint Timeline (scrollable, visual tracking)
- Google OAuth2 & JWT Auth
- Role-Based Access (Admin, PM, User, Student)
- Comments on tasks & uploads
- Confetti and visual completion feedback
- Dashboard with progress & analytics
- Firebase for file uploads
- Settings page

## Installation

### Clone repo
<https://github.com/Rynoo1/MoxBackend/tree/main>

### Navigate to project

cd MoxBackend & cd MoxFrontend

### Install dependencies

npm install         # For Frontend
dotnet restore      # For Backend

## Run development servers

dotnet run          # Backend
npm run dev         # Frontend

# Authors and Acknowledgements

- Ryno de Beer - Role System, Auth, Timeline, Google Login
- Tebogo Ramolobeng – Task Management, UX/UI, Animation
- Michaela Kemp – Emergency Meeting, Comments, Testing
- Phillip van der Hoven – Project & Sub Tasks, File Handling

![Authentication](./Mockups/Authentication.jpg)

## Roadmap

- Google Calendar sync (future)
- Explore mobile-friendly views for Kanban board

### Contributing

This is a closed academic project. If you’d like to reuse any part of MOX or collaborate on improvements, please contact the authors listed above. Contributions are welcome for non-commercial academic use.

## Conclusion

MOX is more than a task manager—it's an inclusive, UX-driven solution tailored for real teams with real struggles. From dopamine-triggered visuals to role-based workflows and file handling, every feature was crafted with purpose. The app stands as both a fully functional PM tool and a proof of concept for designing with empathy. Whether adopted by neurodivergent users or general teams, MOX exemplifies how design, accessibility, and performance can work together to reduce friction and increase productivity.

![Kanban Board](./Mockups/Kanbanboard.jpg)

## License

**Educational Use Disclaimer**  
This project was created as part of coursework for Interactive Development (DV300) at Open Window and is intended for personal portfolio use only.  
Not licensed for redistribution or commercial use.

© Byte Me Team, 2025. All rights reserved.

## Tools & Libraries

- [Heroicons](https://heroicons.com/) – Beautiful hand-crafted SVG icons by the makers of Tailwind CSS  
- [DaisyUI](https://daisyui.com/) – Tailwind CSS component library for rapid UI development  
- [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS framework  
- [Firebase](https://firebase.google.com/) – File storage and authentication  
- [DnD Kit](https://dndkit.com/) – Drag and drop for modern web apps  

## Resources and Credits

The following resources were referenced or adapted during development:

- Firebase file upload logic adapted from  
  [Fireship Firebase Storage tutorial](https://www.youtube.com/watch?v=1aXZQcG2Y6I)

- Drag-and-drop system built using [@dnd-kit/core](https://github.com/clauderic/dnd-kit)

- Role-based access setup inspired by  
  [Dev.to post: Role-based Auth in ASP.NET Core](https://dev.to/xyz/...)

- Confetti animation using  
  [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)

- Readme Icons  
  [Github Icons](https://rahuldkjain.github.io/gh-profile-readme-generator/)

Special thanks to open-source contributors and community threads on  
[Stack Overflow](https://stackoverflow.com/) and  
[GitHub Discussions](https://github.com/)

> All third-party code was used respectfully and modified to suit this academic portfolio project.
