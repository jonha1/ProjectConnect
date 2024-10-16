
# ProjectConnect

### Developer Installation Guide

#### 1. Install Node.js:

**Windows:**

- Install Node.js using Chocolatey:
  ```bash
  choco install nodejs-lts --version="20.18.0"
  ```

- Verify the installation:
  ```bash
  node -v
  ```

  ```bash
  npm -v
  ```

**macOS:**

- Install Node.js using Homebrew:
  ```bash
  brew install node@20
  ```

- Verify the installation:
  ```bash
  node -v
  ```

  ```bash
  npm -v
  ```

#### 2. Install Flask (Python should be installed):
**Windows and Mac:**

- Install Flask:
  ```bash
  pip install Flask
  ```

- Verify the installation:
  ```bash
  python3 -m flask --version
  ```
  ```bash
  npm -v
  ```
#### 3. Install Node and Npm:

MacOs:
- Install node using homebrew:
  ```bash
  brew install node
  ```
- Install Node.js 21:
``` bash
nvm install 21
nvm use 21
```

- Check versions:
```
node -v
npm -v
```
Node: v21.7.3
Npm: 10.5.0

Widnows:
- Download nvm using this repoistroy
(https://github.com/coreybutler/nvm-windows):

- Install Node.js:
  ```bash
  nvm install 21
  nvm use 21
  ```

- Check versions:
```
node -v
npm -v
```
Node: v21.7.3
Npm: 10.5.0

 
#### 4. Install Vite,React, and Typesript:

**Mac:**
- Install create-vite:
npm install -g create-vite

- Create Project:
``` bash
npm create vite@latest my-react-app -- --template react-ts
```

- Navgiate to project directory:
```bash
cd my-react-app
```

- Install project dependencies:
``` bash
npm install
```

- 

#### 5. Install PostgreSQL:

