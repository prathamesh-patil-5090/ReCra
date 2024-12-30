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
    missing_skills = [skill for skill in skill_keywords if skill not in resume_text]
    # If no missing skills found, add the default skill for that category
    if not missing_skills:
        if skill_keywords == ds_keyword:
            missing_skills = [default_missing_skills["Data Science"]]
        elif skill_keywords == web_keyword:
            missing_skills = [default_missing_skills["Web Development"]]
        elif skill_keywords == android_keyword:
            missing_skills = [default_missing_skills["Android Development"]]
        elif skill_keywords == ios_keyword:
            missing_skills = [default_missing_skills["iOS Development"]]
        elif skill_keywords == uiux_keyword:
            missing_skills = [default_missing_skills["UI/UX Design"]]
        elif skill_keywords == n_any:
            missing_skills = [default_missing_skills["Other Skills"]]
    return missing_skills

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
    feedback = []
    if missing_skills_summary.get("Data Science"):
        feedback.append(f"Enhance your Data Science skills by learning {missing_skills_summary['Data Science']}.")
    if missing_skills_summary.get("Web Development"):
        feedback.append(f"Improve your Web Development skills by learning {missing_skills_summary['Web Development']}.")
    if missing_skills_summary.get("Android Development"):
        feedback.append(f"Expand your Android Development skills by learning {missing_skills_summary['Android Development']}.")
    if missing_skills_summary.get("iOS Development"):
        feedback.append(f"Grow your iOS Development skills by learning {missing_skills_summary['iOS Development']}.")
    if missing_skills_summary.get("UI/UX Design"):
        feedback.append(f"Strengthen your UI/UX Design skills by learning {missing_skills_summary['UI/UX Design']}.")
    if missing_skills_summary.get("Other Skills"):
        feedback.append(f"Enhance your profile with additional skills like {missing_skills_summary['Other Skills']}.")
    return feedback

@require_http_methods(["POST", "OPTIONS"])
@ensure_csrf_cookie
@csrf_exempt
def analyze_resume_view(request):
    if request.method == "OPTIONS":
        response = HttpResponse()
        response["Access-Control-Allow-Origin"] = "*"  # Or your specific origin
        response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type, X-CSRFToken"
        return response

    if request.method == 'POST':
        if not request.content_type or not request.content_type.startswith('multipart/form-data'):
            return JsonResponse({'error': 'Invalid content type. Must be multipart/form-data.'}, status=400)
        try:
            # Log incoming headers, files, and POST data
            logging.debug(f"Headers: {request.headers}")
            logging.debug(f"Files: {list(request.FILES.keys())}")
            logging.debug(f"POST data: {request.POST}")

            # Accept both 'resume' and 'file' keys
            pdf_file = request.FILES.get('resume') or request.FILES.get('file')
            job_description = request.POST.get('job_description', '')

            if not pdf_file:
                return JsonResponse(
                    {"error": "No resume file provided"},
                    status=400,
                    headers={
                        "Access-Control-Allow-Origin": "http://localhost:3000",
                        "Access-Control-Allow-Credentials": "true"
                    }
                )

            job_data = {
                "title": "Job Position",
                "location": "Location",
                "description": job_description,
                "requirements": [skill for skill in web_keyword if skill.lower() in job_description.lower()]
            }

            with open(os.path.join(BASE_DIR, 'ReCra', 'models', 'job_dec.json'), 'w') as f:
                json.dump(job_data, f, indent=4)

            temp_dir = os.path.join(BASE_DIR, 'temp')
            os.makedirs(temp_dir, exist_ok=True)
            pdf_path = os.path.join(temp_dir, pdf_file.name)
            with open(pdf_path, 'wb+') as temp_file:
                for chunk in pdf_file.chunks():
                    temp_file.write(chunk)

            try:
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
                    "Missing Skills Analysis": missing_skills_summary,
                    "Chatbot Responses": chatbot_responses,
                    "Feedback": feedback,
                    "Job Description": job_description
                }

                # Save result to staticfiles
                output_path = os.path.join(settings.STATIC_ROOT, 'analysis_analyze_resume.json')
                os.makedirs(os.path.dirname(output_path), exist_ok=True)
                with open(output_path, 'w') as out_file:
                    json.dump(output_data, out_file, indent=4)

                response = JsonResponse(output_data)
                response["Access-Control-Allow-Origin"] = "http://localhost:3000"
                response["Access-Control-Allow-Credentials"] = "true"
                return response

            except Exception as e:
                return JsonResponse(
                    {"error": "Error processing file: {}".format(str(e))},
                    status=500,
                    headers={
                        "Access-Control-Allow-Origin": "http://localhost:3000",
                        "Access-Control-Allow-Credentials": "true"
                    }
                )
            finally:
                if os.path.exists(pdf_path):
                    os.remove(pdf_path)

        except Exception as e:
            return JsonResponse(
                {"error": "Server error: {}".format(str(e))},
                status=500,
                headers={
                    "Access-Control-Allow-Origin": "http://localhost:3000",
                    "Access-Control-Allow-Credentials": "true"
                }
            )

    return JsonResponse(
        {"error": "Invalid request method"},
        status=405,
        headers={
            "Access-Control-Allow-Origin": "http://localhost:3000",
            "Access-Control-Allow-Credentials": "true"
        }
    )

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
            with open(pdf_path, 'wb') as temp_file:
                for chunk in pdf_file.chunks():
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

            output_data = {
                "message": "Recommendations to enhance your profile",
                "Feedback": feedback
            }

            # Modify the output path to save in the 'result' directory
            out_path = os.path.join(BASE_DIR, 'result', 'suggest_improvements_result.json')
            os.makedirs(os.path.dirname(out_path), exist_ok=True)
            with open(out_path, 'w') as out_file:
                json.dump(output_data, out_file, indent=4)

            static_path = os.path.join(settings.STATIC_ROOT, 'analysis_improve_skills.json')
            with open(static_path, 'w') as out_file:
                json.dump(output_data, out_file, indent=4)

            os.remove(pdf_path)
            return JsonResponse(output_data)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Invalid request method"}, status=400)

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
