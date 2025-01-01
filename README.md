# ReCra - AI-Powered Resume Creator & Analyzer

[![Python 3.9.13](https://img.shields.io/badge/python-3.9.13-blue.svg)](https://www.python.org/downloads/release/python-3913/)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Django](https://img.shields.io/badge/Django-4.x-green.svg)](https://www.djangoproject.com/)

ReCra is a modern, AI-powered Resume Creator and Analyzer platform that combines the power of Django and React.js to help users create ATS-optimized resumes. The platform features drag-and-drop customization and leverages machine learning for resume analysis and scoring.

## 🚀 Key Features

- **Smart Resume Builder**
  - Drag-and-drop section management
  - Real-time preview and editing
  - Intelligent formatting with markdown support
  - Dynamic template system

- **AI-Powered Analysis**
  - ATS compatibility scoring
  - Keyword optimization suggestions
  - Content quality assessment
  - Industry-specific recommendations

- **Export Options**
  - High-quality PDF export
  - Multiple format support (PDF, DOCX)
  - Custom styling options

## 🛠 Tech Stack

- **Backend**: Django 4.x, Python 3.9.13
- **Frontend**: React 18.x, Material-UI
- **AI/ML**: TensorFlow, spaCy
- **Database**: PostgreSQL
- **Authentication**: JWT

## 📋 Prerequisites

- Python 3.9.13
- Node.js 16.x or higher
- Visual Studio Build Tools
- PostgreSQL (optional, SQLite by default)

## ⚙️ Installation

### Backend Setup

```bash
# Clone repository
git clone https://github.com/prathamesh-patil-5090/ReCra.git
cd ReCra

# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Environment setup
cp .env.example .env  # Configure your environment variables

# Database setup
python manage.py makemigrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env  # Configure your environment variables
```

## 🚀 Development

```bash
# Start backend server
python manage.py runserver

# Start frontend development server (in a new terminal)
cd frontend && npm start
```

Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Admin Interface: http://localhost:8000/admin

## 🔧 Configuration

### CORS Setup

Add your frontend URL to `CORS_ALLOWED_ORIGINS` in `settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

### Environment Variables

Required environment variables:

```env
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://user:password@localhost:5432/recra
ALLOWED_HOSTS=localhost,127.0.0.1
```

## 🧪 Testing

```bash
# Run backend tests
python manage.py test

# Run frontend tests
cd frontend && npm test
```

## 📦 Deployment

1. Set `DEBUG=False` in production
2. Configure proper database settings
3. Set up static files serving
4. Enable HTTPS
5. Configure proper CORS settings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow PEP 8 for Python code
- Use ESLint configuration for JavaScript
- Write tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Django Documentation](https://docs.djangoproject.com/)
- [React Documentation](https://reactjs.org/docs/)
- [Material-UI](https://mui.com/)
- All contributors who help improve ReCra

## 📞 Support

For support, email prathampatil7798@gmail.com or open an issue in the repository.
