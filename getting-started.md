# Steps to Run `requirements.txt` in Python

Follow these steps to install dependencies listed in the `requirements.txt` file for your project:

---

## 1. Navigate to Your Project Directory

Open your terminal (or command prompt) and navigate to the directory where the `requirements.txt` file is located.

---
## 2. Create Virtual Environment

Creating a virtual environment helps to isolate project dependencies and avoid conflicts with system-wide packages.

MacOs/Linux:
```bash
python3 -m venv venv
source venv/bin/activate
```

Windows:
```bash
python -m venv venv
venv\Scripts\activate
```
---
## 3. Install all depndencies in requirements.txt
```bash
pip install -r requirements.txt
```