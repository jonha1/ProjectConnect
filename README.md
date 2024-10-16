# ProjectConnect

### Developer Installation Guide

#### 1. Install Node.js (v18)

**Windows**:
- Install Node.js using Chocolatey:
  ```bash
  choco install nodejs-lts --version="18.20.4"
  ```

- Verify the installation:
  ```bash
  node -v
  ```

  ```bash
  npm -v
  ```

  **Node:** v18.20.4
  <br>
  **Npm:** 10.7.0

**macOS:**

- Install Node.js using Homebrew:
  ```bash
  brew install node@18
  ```

- Verify the installation:
  ```bash
  node -v
  ```

  ```bash
  npm -v
  ```

  **Node:** v18.20.4
  <br>
  **Npm:** 10.7.0


#### 2. Install Flask (Python should be installed):

**Windows and macOS**:
- Install Flask (requires Python):
  ```bash
  pip install Flask
  ```

- Verify Installation:
  ```bash
  python3 -m flask --version
  ```
 **Flask:** 2.2.5


#### 3. Install Vite, React, and TypeScript

**macOS**:
- Install `create-vite` globally:
  ```bash
  npm install -g create-vite
  ```

- Create a Vite project with React and TypeScript:
  ```bash
  npm create vite@latest my-react-app -- --template react-ts
  ```

- Navigate to the project directory:
  ```bash
  cd my-react-app
  ```

- Install Yarn:
  - Install Yarn globally:
    ```bash
    npm install -g yarn
    ```
  - Install project dependencies using Yarn:
    ```bash
    yarn install
    ```

#### 4. Install Bootstrap

**macOs and Windows:**

```bash
npm install bootstrap
```

#### 5. Install PostgreSQL

**macOS:**

```bash
brew install postgresql
```
- Check version:
```bash
postgresql --version
```

**Postgres:** 14.13
<br>

**Windows:**
```bash
choco install postgresql
```

- Check version:
```bash
postgresql --version
```
**Postgres:** 14.13


