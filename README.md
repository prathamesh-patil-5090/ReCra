# ReCra

ReCra is a comprehensive Resume Creator and Analyzer platform designed to help users craft highly customizable resumes and analyze them with ATS-like scoring features. This project leverages Python (Django) for the backend and React.js for the frontend.

## Installation Guide

### Prerequisites
1. **Python 3.9.13**
   - Download and install Python 3.9.13 from [here](https://www.python.org/downloads/release/python-3913/).

2. **Node.js**
   - Ensure Node.js is installed for managing the frontend.

3. **Visual Studio Build Tools**
   - Download and install the Visual Studio Build Tools from [here](https://visualstudio.microsoft.com/visual-cpp-build-tools/).
   - During installation, include the Windows 10/11 SDK and C/C++ build tools required for packages like `numpy`, `spacy`, and `tensorflow`.

### Steps to Set Up

#### Backend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/prathamesh-patil-5090/ReCra.git
   cd ReCra
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate   # On Windows: .venv\Scripts\activate
   ```

3. Install the required libraries:
   ```bash
   pip install -r requirements.txt
   ```

4. Apply database migrations:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

#### Frontend Setup
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Install Node modules:
   ```bash
   npm i --f
   ```

### Running the Project

1. Start the Django server in one terminal:
   ```bash
   python manage.py runserver
   ```

2. Start the React development server in another terminal:
   ```bash
   cd frontend
   npm start
   ```

By default:
- React runs on [http://localhost:3000](http://localhost:3000)
- Django runs on [http://localhost:8000](http://localhost:8000)

### Important Notes
- Ensure **CORS** and **CSRF tokens** are properly configured to enable smooth communication between the backend and frontend.
- Users must register or log in to the database before accessing the Resume Creator and Analyzer features.

## Features

1. **Resume Creator**:
   - Highly customizable with drag-and-drop functionality for sections.
   - Use `:` in the Skills section for formatting (e.g., `Languages: Python, Java`).
   - Empty sections are automatically excluded from the resume.

2. **Full Preview & PDF Download**:
   - Utilize the full preview button to review your resume before finalizing.
   - Download your resume as a PDF directly.

3. **Resume Analyzer**:
   - Analyze your resume with ATS-like features to improve its quality.

## Contribution
I invite everyone to contribute to ReCra! Your valuable contributions will be acknowledged and credited in this project. 

### How to Contribute
1. Fork the repository.
2. Create a new branch for your feature or fix.
3. Submit a pull request with a clear description of your changes.

Together, let's make ReCra a powerful tool for resume creation and analysis!
