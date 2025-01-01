import os
import sys
import re
import random
import spacy
import numpy as np
import tensorflow as tf
import pickle
import json
from pathlib import Path

from django.conf import settings
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import ensure_csrf_cookie
from PyPDF2 import PdfReader
import logging
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

# Set BASE_DIR and configure Django settings
if __name__ == '__main__':
    current_dir = Path(__file__).resolve().parent
    project_root = current_dir.parent.parent
    sys.path.append(str(project_root))
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ReCra.ReCra.settings')
    import django
    django.setup()
    BASE_DIR = current_dir.parent
else:
    BASE_DIR = settings.BASE_DIR

# Ensure directories exist
os.makedirs(os.path.join(BASE_DIR, 'ReCra', 'models'), exist_ok=True)
os.makedirs(os.path.join(BASE_DIR, 'staticfiles'), exist_ok=True)
os.makedirs(os.path.join(BASE_DIR, 'temp'), exist_ok=True)

# Set protobuf to use pure-Python implementation
os.environ["PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION"] = "python"

# Verify TensorFlow version
print("TensorFlow Version: {}".format(tf.__version__))

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    raise OSError("SpaCy model 'en_core_web_sm' not found. Please install it by running 'python -m spacy download en_core_web_sm'.")

# Load the trained chatbot model
model = tf.keras.models.load_model(os.path.join(BASE_DIR, 'ReCra', 'models', 'chatbot_model_skills.h5'))

# Load words and classes
words = pickle.load(open(os.path.join(BASE_DIR, 'ReCra', 'models', 'words_skills.pkl'), 'rb'))
classes = pickle.load(open(os.path.join(BASE_DIR, 'ReCra', 'models', 'classes_skills.pkl'), 'rb'))

# Load intents file
with open(os.path.join(BASE_DIR, 'ReCra', 'models', 'skills.json')) as f:
    intents = json.load(f)

# Load job_dec.json
with open(os.path.join(BASE_DIR, 'ReCra', 'models', 'job_dec.json')) as f:
    job_dec = json.load(f)

# Skill categories
ds_keyword = ['machine learning', 'python', 'pandas', 'sql', 'database',
              'optimization', 'algorithms']
web_keyword = ['django', 'python', 'aws', 'azure', 'boto3', 'pandas', 'postgresql',
               'rds', 'celery', 'sqs', 'lambda', 'javascript', 'reactjs',
               'sql', 'nosql', 'api', 'cloud', 'database', 'task queue']
android_keyword = ['android', 'android development', 'flutter', 'kotlin', 'xml', 'kivy']
ios_keyword = ['ios', 'ios development', 'swift', 'cocoa', 'cocoa touch', 'xcode']
uiux_keyword = ['ux', 'adobe xd', 'figma', 'zeplin', 'balsamiq', 'ui', 'prototyping', 'wireframes',
                'storyframes', 'adobe photoshop', 'photoshop', 'editing', 'adobe illustrator',
                'illustrator', 'adobe after effects', 'after effects', 'adobe premier pro',
                'premier pro', 'adobe indesign', 'indesign', 'wireframe', 'solid', 'grasp',
                'user research', 'user experience']
n_any = ['english', 'communication', 'writing', 'microsoft office', 'leadership',
         'customer management', 'social media']

# Add these default skills after the keyword lists
default_missing_skills = {
    "Data Science": "python/data analysis",
    "Web Development": "modern web frameworks",
    "Android Development": "mobile development",
    "iOS Development": "ios development",
    "UI/UX Design": "user experience design",
    "Other Skills": "english"
}

# Helper functions
def clean_text(text):
    text = re.sub(r'\n', ' ', text)
    text = re.sub(r'[^\w\s]', '', text)
    text = text.lower()
    return text

def extract_text_from_pdf(pdf_path):
    reader = PdfReader(pdf_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    return text

def analyze_skills(resume_text, skill_keywords):
    """Enhanced skill analysis with limited and randomized results"""
    if not resume_text or not skill_keywords:
        return []
        
    resume_text = resume_text.lower()
    missing_skills = []
    
    try:
        for skill in skill_keywords:
            skill_lower = skill.lower()
            if skill_lower not in resume_text:
                # Check for partial matches
                words = skill_lower.split()
                if not any(word in resume_text for word in words):
                    missing_skills.append(skill)
        
        # Randomly select 2-3 skills if more are available
        if len(missing_skills) > 3:
            return random.sample(missing_skills, random.randint(2, 3))
        return missing_skills
        
    except Exception as e:
        logging.error(f"Error in skill analysis: {str(e)}")
        return []

def lemmatize_word(word):
    return nlp(word)[0].lemma_

def clean_up_sentence(sentence):
    sentence_words = sentence.split()
    sentence_words = [lemmatize_word(word.lower()) for word in sentence_words]
    return sentence_words

def bow(sentence, words_list):
    sentence_words = clean_up_sentence(sentence)
    bag = [0] * len(words_list)
    for s in sentence_words:
        for i, w in enumerate(words_list):
            if w == s:
                bag[i] = 1
    return np.array(bag)

def predict_class(sentence):
    p = bow(sentence, words)
    p = np.reshape(p, (1, len(p)))
    prediction = model.predict(p)
    return prediction

def get_response(prediction):
    class_idx = np.argmax(prediction)
    tag = classes[class_idx]
    for intent in intents['intents']:
        if intent['tag'] == tag:
            return random.choice(intent['responses'])
    return "Sorry, I didn't understand that."

def provide_feedback(missing_skills_summary):
    """Enhanced feedback with more focused suggestions"""
    if not missing_skills_summary:
        return ["Your resume looks good! Consider adding more specific technical skills to stand out further."]

    feedback = []
    templates = {
        "Data Science": [
            "Focus on key Data Science skills: {}. These are highly valued in the industry.",
            "Consider strengthening your profile with {}, which are core Data Science skills.",
        ],
        "Web Development": [
            "Enhance your Web Development toolkit with {}. These are in-demand skills.",
            "Modern web development often requires {}. Consider adding these to your skillset.",
        ],
        "Android Development": [
            "To strengthen your Android Development skills, focus on: {}",
            "Mobile development skills like {} are highly sought after.",
        ],
        "iOS Development": [
            "For iOS Development, prioritize learning: {}",
            "Key iOS development skills to consider: {}",
        ],
        "UI/UX Design": [
            "Enhance your UI/UX Design portfolio with: {}",
            "Popular design tools you might want to learn: {}",
        ],
        "Other Skills": [
            "Consider developing these professional skills: {}",
            "Strengthen your profile with these soft skills: {}"
        ]
    }

    for domain, skills in missing_skills_summary.items():
        if skills:
            skills_text = ", ".join(skills)
            template = random.choice(templates.get(domain, ["Consider learning: {}"]))
            feedback.append(template.format(skills_text))

    return feedback

@require_http_methods(["POST", "OPTIONS"])
@ensure_csrf_cookie
@csrf_exempt
def analyze_resume_view(request):
    """Resume analysis focusing on skill gaps and current strengths"""
    if request.method == "OPTIONS":
        response = HttpResponse()
        response["Access-Control-Allow-Origin"] = "http://localhost:3000"
        response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type, X-CSRFToken"
        return response

    if request.method == 'POST':
        try:
            # Validate content type
            if not request.content_type or 'multipart/form-data' not in request.content_type:
                return JsonResponse(
                    {"error": "Invalid content type. Must be multipart/form-data."},
                    status=400
                )

            # Get and validate file
            pdf_file = request.FILES.get('resume') or request.FILES.get('file')
            if not pdf_file:
                return JsonResponse({"error": "No file provided"}, status=400)
            
            if not pdf_file.name.lower().endswith('.pdf'):
                return JsonResponse({"error": "File must be a PDF"}, status=400)

            # Create temp directory if it doesn't exist
            temp_dir = os.path.join(BASE_DIR, 'temp')
            os.makedirs(temp_dir, exist_ok=True)
            
            # Save and process file
            pdf_path = os.path.join(temp_dir, pdf_file.name)
            try:
                with open(pdf_path, 'wb+') as dest:
                    for chunk in pdf_file.chunks():
                        dest.write(chunk)

                resume_text = extract_text_from_pdf(pdf_path)
                if not resume_text.strip():
                    raise ValueError("Could not extract text from PDF")
                
                resume_text = clean_text(resume_text)
                
                # Analyze present skills
                present_skills = {
                    "Data Science": [s for s in ds_keyword if s in resume_text],
                    "Web Development": [s for s in web_keyword if s in resume_text],
                    "Android Development": [s for s in android_keyword if s in resume_text],
                    "iOS Development": [s for s in ios_keyword if s in resume_text],
                    "UI/UX Design": [s for s in uiux_keyword if s in resume_text],
                    "Other Skills": [s for s in n_any if s in resume_text]
                }

                # Analyze missing skills
                missing_skills = {
                    category: list(set(keywords) - set(present_skills[category]))
                    for category, keywords in {
                        "Data Science": ds_keyword,
                        "Web Development": web_keyword,
                        "Android Development": android_keyword,
                        "iOS Development": ios_keyword,
                        "UI/UX Design": uiux_keyword,
                        "Other Skills": n_any
                    }.items()
                }

                # Generate analysis summary
                output_data = {
                    "Present Skills": present_skills,
                    "Missing Skills": missing_skills,
                    "Analysis Summary": {
                        category: {
                            "strength": f"{len(present_skills[category])}/{len(present_skills[category] + missing_skills[category])} skills present",
                            "gap_percentage": round((len(missing_skills[category]) / (len(present_skills[category] + missing_skills[category]))) * 100, 1)
                        }
                        for category in present_skills.keys()
                    }
                }

                return JsonResponse(output_data)

            except Exception as e:
                logging.error(f"Error processing file: {str(e)}")
                return JsonResponse({"error": f"Error processing file: {str(e)}"}, status=500)
            finally:
                if os.path.exists(pdf_path):
                    try:
                        os.remove(pdf_path)
                    except Exception as e:
                        logging.error(f"Error removing temporary file: {str(e)}")

        except Exception as e:
            logging.error(f"Server error: {str(e)}")
            return JsonResponse({"error": f"Server error: {str(e)}"}, status=500)

    return JsonResponse({"error": "Method not allowed"}, status=405)

# Configure logging
logging.basicConfig(level=logging.DEBUG)

@csrf_exempt
def analyze_resume(request):
    if request.method == 'POST':
        if not request.content_type or not request.content_type.startswith('multipart/form-data'):
            logging.debug("Invalid content type: %s", request.content_type)
            return JsonResponse({'error': 'Invalid content type. Must be multipart/form-data.'}, status=400)
        try:
            # Log incoming headers, files, and POST data
            logging.debug(f"Headers: {request.headers}")
            logging.debug(f"Files: {list(request.FILES.keys())}")
            logging.debug(f"POST data: {request.POST}")

            # Accept both 'file' and 'resume' keys
            file = request.FILES.get('file') or request.FILES.get('resume')
            if not file:
                logging.debug("No 'file' or 'resume' key found in uploaded files.")
                return JsonResponse({'error': 'No file uploaded'}, status=400)
            
            pdf_path = os.path.join(BASE_DIR, 'temp', file.name)
            with open(pdf_path, 'wb+') as temp_file:
                for chunk in file.chunks():
                    temp_file.write(chunk)

            resume_text = extract_text_from_pdf(pdf_path)
            resume_text = clean_text(resume_text)

            missing_skills_summary = {
                "Data Science": analyze_skills(resume_text, ds_keyword),
                "Web Development": analyze_skills(resume_text, web_keyword),
                "Android Development": analyze_skills(resume_text, android_keyword),
                "iOS Development": analyze_skills(resume_text, ios_keyword),
                "UI/UX Design": analyze_skills(resume_text, uiux_keyword),
                "Other Skills": analyze_skills(resume_text, n_any)
            }

            feedback = provide_feedback(missing_skills_summary)

            chatbot_responses = {}
            for domain, skill_list in missing_skills_summary.items():
                for skill in skill_list:
                    if skill_list:
                        prediction = predict_class(skill)
                        chatbot_responses[domain] = get_response(prediction)

            output_data = {
                "message": "Detailed insights about the resume",
                "Missing Skills Analysis": missing_skills_summary,
                "Chatbot Responses": chatbot_responses,
                "Feedback": feedback
            }

            save_path = os.path.join(settings.STATIC_ROOT, 'analysis_analyze_resume.json')
            with open(save_path, 'w') as out_file:
                json.dump(output_data, out_file, indent=4)

            # Also save to static folder for easy access
            static_result = os.path.join(settings.STATIC_ROOT, 'analysis_analyze_resume.json')
            with open(static_result, 'w') as out_file:
                json.dump(output_data, out_file, indent=4)

            os.remove(pdf_path)
            return JsonResponse(output_data)
        except Exception as e:
            logging.error("Error in analyze_resume: %s", str(e))
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=400)

@csrf_exempt
def suggest_improvements(request):
    """Enhanced suggestions with prioritized recommendations"""
    if request.method == 'POST':
        try:
            # Validate content type and file
            if not request.content_type or 'multipart/form-data' not in request.content_type:
                return JsonResponse({"error": "Invalid content type"}, status=400)

            pdf_file = request.FILES.get('resume') or request.FILES.get('file')
            if not pdf_file or not pdf_file.name.lower().endswith('.pdf'):
                return JsonResponse({"error": "Invalid or missing PDF file"}, status=400)

            temp_dir = os.path.join(BASE_DIR, 'temp')
            os.makedirs(temp_dir, exist_ok=True)
            pdf_path = os.path.join(temp_dir, pdf_file.name)

            try:
                with open(pdf_path, 'wb+') as dest:
                    for chunk in pdf_file.chunks():
                        dest.write(chunk)

                resume_text = extract_text_from_pdf(pdf_path)
                if not resume_text.strip():
                    raise ValueError("Could not extract text from PDF")

                resume_text = clean_text(resume_text)
                
                # Analyze skills with priority levels
                skill_analysis = {}
                for category, keywords in {
                    "Data Science": ds_keyword,
                    "Web Development": web_keyword,
                    "Android Development": android_keyword,
                    "iOS Development": ios_keyword,
                    "UI/UX Design": uiux_keyword,
                    "Other Skills": n_any
                }.items():
                    present = [s for s in keywords if s in resume_text]
                    missing = list(set(keywords) - set(present))
                    
                    # Calculate category strength
                    strength = len(present) / len(keywords) if keywords else 0
                    
                    # Prioritize missing skills
                    priority_skills = {
                        "critical": missing[:2],  # Top 2 most important missing skills
                        "important": missing[2:5],  # Next 3 important skills
                        "optional": missing[5:]  # Remaining skills
                    }
                    
                    skill_analysis[category] = {
                        "strength": strength,
                        "present_skills": present,
                        "priority_improvements": priority_skills
                    }

                # Generate personalized recommendations
                recommendations = []
                for category, analysis in skill_analysis.items():
                    if analysis["priority_improvements"]["critical"]:
                        recommendations.append({
                            "category": category,
                            "priority": "High",
                            "message": f"Focus on mastering these critical {category} skills first: {', '.join(analysis['priority_improvements']['critical'])}",
                            "impact": "These skills are fundamental and will significantly improve your profile."
                        })
                    
                    if analysis["priority_improvements"]["important"]:
                        recommendations.append({
                            "category": category,
                            "priority": "Medium",
                            "message": f"After mastering the basics, learn these important skills: {', '.join(analysis['priority_improvements']['important'])}",
                            "impact": "These skills will make you more competitive in the job market."
                        })

                output_data = {
                    "Skill Analysis": skill_analysis,
                    "Prioritized Recommendations": recommendations,
                    "Learning Path": {
                        category: {
                            "Current Level": "Beginner" if analysis["strength"] < 0.3 else "Intermediate" if analysis["strength"] < 0.7 else "Advanced",
                            "Next Steps": recommendations[i]["message"] if i < len(recommendations) else "Keep improving your existing skills"
                        }
                        for i, (category, analysis) in enumerate(skill_analysis.items())
                    }
                }

                return JsonResponse(output_data)

            except Exception as e:
                logging.error(f"Error processing file: {str(e)}")
                return JsonResponse({"error": f"Error processing file: {str(e)}"}, status=500)
            finally:
                if os.path.exists(pdf_path):
                    os.remove(pdf_path)

        except Exception as e:
            logging.error(f"Server error: {str(e)}")
            return JsonResponse({"error": f"Server error: {str(e)}"}, status=500)

    return JsonResponse({"error": "Method not allowed"}, status=405)

def extract_skills_from_job_description(job_description):
    text = clean_text(job_description)
    return {
        "Data Science": [skill for skill in ds_keyword if skill in text],
        "Web Development": [skill for skill in web_keyword if skill in text],
        "Android Development": [skill for skill in android_keyword if skill in text],
        "iOS Development": [skill for skill in ios_keyword if skill in text],
        "UI/UX Design": [skill for skill in uiux_keyword if skill in text],
        "Other Skills": [skill for skill in n_any if skill in text]
    }

@csrf_exempt
def check_match(request):
    if request.method == 'POST':
        try:
            # Accept both 'resume' and 'file' keys
            pdf_file = request.FILES.get('resume') or request.FILES.get('file')
            
            if not pdf_file:
                return JsonResponse(
                    {"error": "No resume file provided"},
                    status=400,
                    headers={
                        "Access-Control-Allow-Origin": "http://localhost:3000",
                        "Access-Control-Allow-Credentials": "true"
                    }
                )
            
            pdf_path = os.path.join(BASE_DIR, 'temp', pdf_file.name)
            with open(pdf_path, 'wb+') as temp_file:
                for chunk in pdf_file.chunks():
                    temp_file.write(chunk)

            resume_text = extract_text_from_pdf(pdf_path)
            resume_text = clean_text(resume_text)

            job_description = request.POST.get('job_description', '')
            job_description = clean_text(job_description)

            resume_skills = {
                "Data Science": [s for s in ds_keyword if s in resume_text],
                "Web Development": [s for s in web_keyword if s in resume_text],
                "Android Development": [s for s in android_keyword if s in resume_text],
                "iOS Development": [s for s in ios_keyword if s in resume_text],
                "UI/UX Design": [s for s in uiux_keyword if s in resume_text],
                "Other Skills": [s for s in n_any if s in resume_text]
            }
            job_skills = {
                "Data Science": [s for s in ds_keyword if s in job_description],
                "Web Development": [s for s in web_keyword if s in job_description],
                "Android Development": [s for s in android_keyword if s in job_description],
                "iOS Development": [s for s in ios_keyword if s in job_description],
                "UI/UX Design": [s for s in uiux_keyword if s in job_description],
                "Other Skills": [s for s in n_any if s in job_description]
            }

            matched_skills = {}
            missing_skills = {}
            for domain in resume_skills:
                matches = list(set(resume_skills[domain]) & set(job_skills[domain]))
                misses = list(set(job_skills[domain]) - set(resume_skills[domain]))
                matched_skills[domain] = matches
                if not misses and job_skills[domain]:
                    # If domain is required but no details found, add a default skill
                    misses = [default_missing_skills.get(domain, "english")]
                missing_skills[domain] = misses

            output_data = {
                "Matched Skills": matched_skills,
                "Missing Skills": missing_skills
            }

            # Save final result
            result_path = os.path.join(settings.STATIC_ROOT, 'analysis_match_percentage.json')
            with open(result_path, 'w') as f:
                json.dump(output_data, f, indent=2)

            os.remove(pdf_path)
            return JsonResponse(output_data)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Invalid request method"}, status=400)

@csrf_exempt
def serve_analysis_json(request, analysis_type):
    try:
        file_path = os.path.join(settings.STATIC_ROOT, f"analysis_{analysis_type}.json")
        with open(file_path, 'r') as f:
            data = json.load(f)
        response = JsonResponse(data, safe=False)
        response["Access-Control-Allow-Origin"] = "http://localhost:3000"
        response["Access-Control-Allow-Credentials"] = "true"
        return response
    except FileNotFoundError:
        return JsonResponse({"error": "Analysis file not found."}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON format in analysis file."}, status=500)
    except Exception as e:
        return JsonResponse({"error": f"Server error: {str(e)}"}, status=500)

@csrf_exempt
def get_analysis_analyze_resume(request):
    json_file_path = os.path.join(settings.STATIC_ROOT, "analysis_analyze_resume.json")
    if os.path.exists(json_file_path):
        with open(json_file_path, 'r') as f:
            data = json.load(f)
        response = JsonResponse(data, safe=False)
        response["Access-Control-Allow-Origin"] = "http://localhost:3000"
        response["Access-Control-Allow-Credentials"] = "true"
        return response
    return JsonResponse({"error": "File not found."}, status=404)

def test_check_match():
    print("\n=== Check Match Test ===")
    pdf_path = input("Enter the path to your PDF resume: ")
    try:
        result_dir = os.path.join(BASE_DIR, 'ReCra', 'result')
        result_path = os.path.join(result_dir, 'check_match_result.json')
        os.makedirs(result_dir, exist_ok=True)

        resume_text = extract_text_from_pdf(pdf_path)
        resume_text = clean_text(resume_text)
        print("\nExtracted text from resume:", resume_text[:200], "...")

        with open(os.path.join(BASE_DIR, 'ReCra', 'models', 'job_dec.json')) as f:
            job_data = json.load(f)
            job_description = clean_text(job_data['description'])

        print("\nAnalyzing resume against job description...")

        def detect_skills(text, keywords):
            found_skills = []
            text_lower = text.lower()
            for skill in keywords:
                if skill in text_lower:
                    found_skills.append(skill)
            return found_skills

        resume_skills = {
            "Data Science": detect_skills(resume_text, ds_keyword),
            "Web Development": detect_skills(resume_text, web_keyword),
            "Android Development": detect_skills(resume_text, android_keyword),
            "iOS Development": detect_skills(resume_text, ios_keyword),
            "UI/UX Design": detect_skills(resume_text, uiux_keyword),
            "Other Skills": detect_skills(resume_text, n_any)
        }
        job_skills = {
            "Data Science": detect_skills(job_description, ds_keyword),
            "Web Development": detect_skills(job_description, web_keyword),
            "Android Development": detect_skills(job_description, android_keyword),
            "iOS Development": detect_skills(job_description, ios_keyword),
            "UI/UX Design": detect_skills(job_description, uiux_keyword),
            "Other Skills": detect_skills(job_description, n_any)
        }

        print("\nSkills found in resume:")
        for domain, skills in resume_skills.items():
            if skills:
                print(f"{domain}: {', '.join(skills)}")

        print("\nSkills required in job:")
        for domain, skills in job_skills.items():
            if skills:
                print(f"{domain}: {', '.join(skills)}")

        matched_skills = {}
        missing_skills = {}
        for domain in resume_skills:
            matches = list(set(resume_skills[domain]) & set(job_skills[domain]))
            misses = list(set(job_skills[domain]) - set(resume_skills[domain]))
            matched_skills[domain] = matches
            if not misses and job_skills[domain]:
                misses = [default_missing_skills.get(domain, "english")]
            missing_skills[domain] = misses

        output_data = {
            "message": "Resume-to-job match information",
            "Job Description": job_data['description'],
            "Matched Skills": matched_skills,
            "Missing Skills": missing_skills
        }

        with open(result_path, 'w') as f:
            json.dump(output_data, f, indent=2)
        print(f"\nResults saved to: {result_path}")

        print("\nSkill Match Summary:")
        for domain, skills in matched_skills.items():
            if skills:
                print(f"{domain}: {', '.join(skills)}")

        print("\nMissing Skills:")
        for domain, skills in missing_skills.items():
            if skills:
                print(f"{domain}: {', '.join(skills)}")

    except Exception as e:
        print(f"Error: {str(e)}")

@csrf_exempt
def register_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            first_name = data.get('firstName')
            last_name = data.get('lastName')
            email = data.get('email')
            password = data.get('password')

            # Validate email
            try:
                validate_email(email)
            except ValidationError:
                return JsonResponse({'error': 'Invalid email address'}, status=400)

            # Check if user already exists
            if User.objects.filter(email=email).exists():
                return JsonResponse({'error': 'Email already registered'}, status=400)

            # Create user
            user = User.objects.create_user(
                username=email,
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name
            )

            # Log the user in
            login(request, user)

            return JsonResponse({
                'message': 'Registration successful',
                'user': {
                    'email': user.email,
                    'firstName': user.first_name,
                    'lastName': user.last_name
                }
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
def login_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')

            user = authenticate(request, username=email, password=password)
            if user is not None:
                login(request, user)
                return JsonResponse({
                    'message': 'Login successful',
                    'user': {
                        'email': user.email,
                        'firstName': user.first_name,
                        'lastName': user.last_name
                    }
                })
            else:
                return JsonResponse({'error': 'Invalid credentials'}, status=401)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
def logout_user(request):
    if request.method == 'POST':
        logout(request)
        return JsonResponse({'message': 'Logout successful'})
    return JsonResponse({'error': 'Invalid request method'}, status=405)

if __name__ == '__main__':
    while True:
        print("\nChoose a test to run:")
        print("1. Analyze Resume")
        print("2. Suggest Improvements")
        print("3. Check Match")
        print("4. Exit")

        choice = input("\nEnter your choice (1-4): ")
        if choice == '1':
            print("Analyze Resume test is not implemented in CLI form here.")
        elif choice == '2':
            print("Suggest Improvements test is not implemented in CLI form here.")
        elif choice == '3':
            test_check_match()
        elif choice == '4':
            print("Exiting.")
            break
        else:
            print("Invalid choice. Please try again.")