
# ProjectConnect Setup Guide

This guide will help you set up the environment for the ProjectConnect project. The system architecture consists of a server running Python and Node.js, a client running Next.js with React, and a PostgreSQL database.

---

## Table of Contents
1. [Server Setup](#server-setup)
   - [Python](#python)
   - [Node.js](#nodejs)
   - [Flask API](#flask-api)
   - [PostgreSQL](#postgresql)
2. [Client Setup](#client-setup)
   - [Next.js](#nextjs)
   - [React and Bootstrap](#react-and-bootstrap)
3. [Database Setup](#database-setup)
   - [PostgreSQL Installation](#postgresql-installation)
4. [Final Steps](#final-steps)
   - [Running the Application](#running-the-application)
   - [Connecting to the Database](#connecting-to-the-database)

---

## Server Setup

### Python

#### 1. Install Python 3.7.9:

### Windows (Using Chocolatey):
- Run the following command in administrator mode PowerShell or Command Prompt to install Python 3.7.9:
  ```bash
  choco install python --version=3.7.9
  ```

### macOS/Linux:
- Run the following command in your terminal to install Python 3.7.9:
  ```bash
  brew install @3.7.9
  ```
- Link Python 3.7 as the default version:
  ```bash
  brew link python@3.7
  ```

---

## 2. Create Virtual Environment

Creating a virtual environment helps to isolate project dependencies and avoid conflicts with system-wide packages.

- Install virtualenv:
  ```bash
  pip install virtualenv
  ```

Windows:
```bash
python3 -m venv venv
venv\Scriptsctivate
```

macOS/Linux:
```bash
python3 -m venv venv
source venv/bin/activate
```

---

## 3. Install all dependencies from `requirements.txt`
```bash
pip install -r requirements.txt
```

#### 4. Dependencies Overview:
- **Flask (2.2.5)**: Web framework for creating APIs.
- **SQLAlchemy (2.0.21)**: ORM for handling database operations.
- **Alembic (1.12.0)**: Database migrations.
- **psycopg2-binary (2.9.9)**: PostgreSQL adapter for Python.

---

## Node.js

#### 1. Install Node.js (23.0.0):

### Windows (Using Chocolatey):
- Ensure that you have Chocolatey installed. If not, follow the instructions on [Chocolatey's official website](https://chocolatey.org/install).
- Once Chocolatey is installed, run the following command in an elevated (Administrator) PowerShell or Command Prompt to install Node.js 23.0.0:
  ```bash
  choco install nodejs --version=23.0.0
  ```

### macOS/Linux (Using Homebrew):
```bash
brew install node
npm install -g n
sudo n 23.0.0
```

---

#### 2. Install Project Dependencies with `npm install`

After pulling the project from the repository, navigate to the project directory and run:

```bash
npm install
```

This will install all the required **Node.js**, **Next.js**, **React**, and **Bootstrap** dependencies listed in the `package.json` file.

#### 3. Project Dependencies Overview:
- **Express (4.21.0)**: Fast web server for Node.js.
- **Axios (1.7.7)**: HTTP client for making requests.
- **Next.js (14.2.15)**: Framework for React applications with server-side rendering.
- **React (18.3.11)** and **React-DOM (18.3.1)**: React libraries.
- **Bootstrap (5.3.3)**: Frontend framework for responsive design.
- **Chokidar (4.0.1)** and **Live-server (1.2.2)**: Development utilities.

---

## Database Setup

### PostgreSQL Installation

#### 1. Install PostgreSQL (14.13):
- Download and install PostgreSQL from [PostgreSQL official site](https://www.postgresql.org/download/).
- After installation, verify the version:
  ```bash
  psql --version
  ```

#### 2. Create a Database:
- Log in to PostgreSQL and create a new database:
  ```bash
  psql postgres
  CREATE DATABASE projectconnect;
  ```

#### 3. Configure PostgreSQL:
- Ensure PostgreSQL is running on **port 5432**, which is the default port for PostgreSQL.

#### 4. Migrate Database:
- Run Alembic migrations to set up the database schema:
  ```bash
  alembic upgrade head
  ```

---

## Server

## Make sure you are in the projectConnect folder:


   - Run the Next.js development server:
     ```bash
     npm run dev

     ```
   - Run the production server:
   - Build the app:
    ```bash
    npm run build
    ``` 
  - Run the Next.js produciton server:
  ```
  npm start
  ```
   - Open your browser and navigate to `http://localhost:3000`.
