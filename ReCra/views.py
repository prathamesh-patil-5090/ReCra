import os
import sys
from pathlib import Path

# Set BASE_DIR and configure Django settings
if __name__ == '__main__':
    # Add the parent directory to sys.path
    current_dir = Path(__file__).resolve().parent
    project_root = current_dir.parent.parent
    sys.path.append(str(project_root))
    
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ReCra.ReCra.settings')
    
    import django
    django.setup()
    
    BASE_DIR = current_dir.parent
else:
    from django.conf import settings
    BASE_DIR = settings.BASE_DIR

# Set protobuf to use pure-Python implementation
os.environ["PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION"] = "python"

# ...existing imports...
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import re
import random
import spacy
import numpy as np
import tensorflow as tf
import pickle
import json
from PyPDF2 import PdfReader

# Verify TensorFlow version
print(f"TensorFlow Version: {tf.__version__}")

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
ds_keyword = ['tensorflow', 'keras', 'pytorch', 'machine learning', 'deep learning', 'flask', 'streamlit']
web_keyword = ['react', 'django', 'node js', 'react js', 'php', 'laravel', 'magento', 'wordpress', 
               'javascript', 'angular js', 'c#', 'asp.net', 'flask']
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
        # Determine which category this is by matching the keywords
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

def bow(sentence, words):
    sentence_words = clean_up_sentence(sentence)
    bag = [0] * len(words)
    for s in sentence_words:
        for i, word in enumerate(words):
            if word == s:
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

# Feedback function
def provide_feedback(missing_skills_summary):
    feedback = []
    if missing_skills_summary.get("Data Science"):
        feedback.append("Enhance your Data Science skills by learning {}.".format(missing_skills_summary["Data Science"]))
    if missing_skills_summary.get("Web Development"):
        feedback.append("Improve your Web Development skills by learning {}.".format(missing_skills_summary["Web Development"]))
    if missing_skills_summary.get("Android Development"):
        feedback.append("Expand your Android Development skills by learning {}.".format(missing_skills_summary["Android Development"]))
    if missing_skills_summary.get("iOS Development"):
        feedback.append("Grow your iOS Development skills by learning {}.".format(missing_skills_summary["iOS Development"]))
    if missing_skills_summary.get("UI/UX Design"):
        feedback.append("Strengthen your UI/UX Design skills by learning {}.".format(missing_skills_summary["UI/UX Design"]))
    if missing_skills_summary.get("Other Skills"):
        feedback.append("Enhance your profile with additional skills like {}.".format(missing_skills_summary["Other Skills"]))
    return feedback

# Main view
@csrf_exempt
def analyze_resume_view(request):
    if request.method == 'POST':
        pdf_file = request.FILES['resume']
        pdf_path = f"temp/{pdf_file.name}"
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

        chatbot_responses = {
            domain: get_response(predict_class(skill))
            for domain, skill_list in missing_skills_summary.items() for skill in skill_list if skill_list
        }

        os.remove(pdf_path)  # Clean up uploaded file

        output_data = {
            "Missing Skills Analysis": missing_skills_summary,
            "Chatbot Responses": chatbot_responses,
            "Feedback": feedback
        }
        with open(os.path.join(BASE_DIR, 'ReCra', 'ReCra', 'models', 'analysis_analyze_resume_view.json'), 'w') as out_file:
            json.dump(output_data, out_file)
        return JsonResponse(output_data)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=400)

@csrf_exempt
def analyze_resume(request):
    if request.method == 'POST':
        pdf_file = request.FILES['resume']
        pdf_path = f"temp/{pdf_file.name}"
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

        chatbot_responses = {
            domain: get_response(predict_class(skill))
            for domain, skill_list in missing_skills_summary.items() for skill in skill_list if skill_list
        }

        os.remove(pdf_path)  # Clean up uploaded file

        output_data = {
            "message": "Detailed insights about the resume",
            "Missing Skills Analysis": missing_skills_summary,
            "Chatbot Responses": chatbot_responses,
            "Feedback": feedback
        }
        with open(os.path.join(BASE_DIR, 'ReCra', 'ReCra', 'models', 'analysis_analyze_resume.json'), 'w') as out_file:
            json.dump(output_data, out_file)
        return JsonResponse(output_data)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=400)

@csrf_exempt
def suggest_improvements(request):
    if request.method == 'POST':
        pdf_file = request.FILES['resume']
        pdf_path = f"temp/{pdf_file.name}"
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

        os.remove(pdf_path)  # Clean up uploaded file

        output_data = {
            "message": "Recommendations to enhance your profile",
            "Feedback": feedback
        }
        with open(os.path.join(BASE_DIR, 'ReCra', 'ReCra', 'models', 'analysis_suggest_improvements.json'), 'w') as out_file:
            json.dump(output_data, out_file)
        return JsonResponse(output_data)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=400)

def extract_skills_from_job_description(job_description):
    """Extract skills from job description text"""
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
        pdf_file = request.FILES['resume']
        pdf_path = f"temp/{pdf_file.name}"
        with open(pdf_path, 'wb') as temp_file:
            for chunk in pdf_file.chunks():
                temp_file.write(chunk)

        resume_text = extract_text_from_pdf(pdf_path)
        resume_text = clean_text(resume_text)

        job_description = request.POST.get('job_description', '')
        job_description = clean_text(job_description)

        resume_skills = {
            "Data Science": analyze_skills(resume_text, ds_keyword),
            "Web Development": analyze_skills(resume_text, web_keyword),
            "Android Development": analyze_skills(resume_text, android_keyword),
            "iOS Development": analyze_skills(resume_text, ios_keyword),
            "UI/UX Design": analyze_skills(resume_text, uiux_keyword),
            "Other Skills": analyze_skills(resume_text, n_any)
        }

        job_skills = {
            "Data Science": analyze_skills(job_description, ds_keyword),
            "Web Development": analyze_skills(job_description, web_keyword),
            "Android Development": analyze_skills(job_description, android_keyword),
            "iOS Development": analyze_skills(job_description, ios_keyword),
            "UI/UX Design": analyze_skills(job_description, uiux_keyword),
            "Other Skills": analyze_skills(job_description, n_any)
        }

        matched_skills = {domain: list(set(resume_skills[domain]) & set(job_skills[domain])) for domain in resume_skills}
        unmatched_skills = {domain: list(set(job_skills[domain]) - set(resume_skills[domain])) for domain in job_skills}
        
        # Add suggestions to ensure non-empty missing skills
        domain_suggestions = {
            "Data Science": ["python/data analysis"],
            "Web Development": ["modern web frameworks"],
            "Android Development": ["mobile development"],
            "iOS Development": ["mobile development"],
            "UI/UX Design": ["user experience design"],
            "Other Skills": ["english"]
        }
        for domain in unmatched_skills:
            if not unmatched_skills[domain]:
                unmatched_skills[domain] = domain_suggestions.get(domain, ["english"])

        # Modify the missing skills section to ensure each category has at least one skill
        default_missing_by_category = {
            "Data Science": ["python", "tensorflow", "machine learning", "deep learning", "data analysis"],
            "Web Development": ["react", "node.js", "angular", "vue.js", "django"],
            "Android Development": ["kotlin", "flutter", "android studio", "react native"],
            "iOS Development": ["swift", "objective-c", "xcode", "cocoa"],
            "UI/UX Design": ["figma", "sketch", "adobe xd", "ui principles"],
            "Other Skills": ["communication", "teamwork", "problem solving", "project management"]
        }

        matched_skills = {domain: list(set(resume_skills[domain]) & set(job_skills[domain])) for domain in resume_skills}
        unmatched_skills = {domain: list(set(job_skills[domain]) - set(resume_skills[domain])) for domain in job_skills}
        
        # Ensure each category has at least one missing skill
        missing_skills = {
            "Data Science": [random.choice(["python", "tensorflow", "machine learning"]) if not unmatched_skills["Data Science"] else random.choice(unmatched_skills["Data Science"])],
            "Web Development": [random.choice(["react", "node.js", "angular"]) if not unmatched_skills["Web Development"] else random.choice(unmatched_skills["Web Development"])],
            "Android Development": [random.choice(["kotlin", "flutter", "android studio"]) if not unmatched_skills["Android Development"] else random.choice(unmatched_skills["Android Development"])],
            "iOS Development": [random.choice(["swift", "objective-c", "xcode"]) if not unmatched_skills["iOS Development"] else random.choice(unmatched_skills["iOS Development"])],
            "UI/UX Design": [random.choice(["figma", "sketch", "adobe xd"]) if not unmatched_skills["UI/UX Design"] else random.choice(unmatched_skills["UI/UX Design"])],
            "Other Skills": [random.choice(["communication", "teamwork", "english"]) if not unmatched_skills["Other Skills"] else random.choice(unmatched_skills["Other Skills"])]
        }

        os.remove(pdf_path)  # Clean up uploaded file

        output_data = {
            "message": "Resume-to-job match information",
            "Matched Skills": matched_skills,
            "Missing Skills (Sample)": missing_skills
        }
        with open(os.path.join(BASE_DIR, 'ReCra', 'ReCra', 'models', 'analysis_check_match.json'), 'w') as out_file:
            json.dump(output_data, out_file)
        return JsonResponse(output_data)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=400)

if __name__ == '__main__':
    import django
    import os
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ReCra.ReCra.settings')
    django.setup()

    def test_analyze_resume():
        print("\n=== Resume Analysis Test ===")
        pdf_path = input("Enter the path to your PDF resume: ")
        
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
            chatbot_responses = {
                domain: get_response(predict_class(skill))
                for domain, skill_list in missing_skills_summary.items() for skill in skill_list if skill_list
            }
            
            output_data = {
                "Missing Skills Analysis": missing_skills_summary,
                "Chatbot Responses": chatbot_responses,
                "Feedback": feedback
            }
            
            result_dir = os.path.join(BASE_DIR, 'ReCra', 'result')
            os.makedirs(result_dir, exist_ok=True)
            
            with open(os.path.join(result_dir, 'analyze_resume_result.json'), 'w') as f:
                json.dump(output_data, f, indent=2)
            print(f"\nResults saved to analyze_resume_result.json")
            
        except Exception as e:
            print(f"Error: {str(e)}")

    def test_suggest_improvements():
        print("\n=== Suggest Improvements Test ===")
        pdf_path = input("Enter the path to your PDF resume: ")
        
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
            
            output_data = {
                "message": "Recommendations to enhance your profile",
                "Feedback": feedback
            }
            
            result_dir = os.path.join(BASE_DIR, 'ReCra', 'result')
            os.makedirs(result_dir, exist_ok=True)
            
            with open(os.path.join(result_dir, 'suggest_improvements_result.json'), 'w') as f:
                json.dump(output_data, f, indent=2)
            print(f"\nResults saved to suggest_improvements_result.json")
            
        except Exception as e:
            print(f"Error: {str(e)}")

    def test_check_match():
        print("\n=== Check Match Test ===")
        pdf_path = input("Enter the path to your PDF resume: ")
        
        try:
            # Use the correct relative path from BASE_DIR
            result_dir = os.path.join(BASE_DIR, 'ReCra', 'result')
            result_path = os.path.join(result_dir, 'check_match_result.json')
            os.makedirs(result_dir, exist_ok=True)
            
            # Read and process resume
            resume_text = extract_text_from_pdf(pdf_path)
            resume_text = clean_text(resume_text)
            print("\nExtracted text from resume:", resume_text[:200], "...")
            
            # Read job description
            with open(os.path.join(BASE_DIR, 'ReCra', 'models', 'job_dec.json')) as f:
                job_data = json.load(f)
                job_description = clean_text(job_data['description'])
            
            print("\nAnalyzing resume against job description...")
            
            # Improved skill detection
            def detect_skills(text, keywords):
                found_skills = []
                text_lower = text.lower()
                for skill in keywords:
                    # Check for exact match or as part of a word
                    if skill in text_lower or any(word.startswith(skill) or word.endswith(skill) 
                                               for word in text_lower.split()):
                        found_skills.append(skill)
                return found_skills
            
            # Get skills from resume and job description
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
            
            # Print found skills for verification
            print("\nSkills found in resume:")
            for domain, skills in resume_skills.items():
                if skills:
                    print(f"{domain}: {skills}")
            
            print("\nSkills required in job:")
            for domain, skills in job_skills.items():
                if skills:
                    print(f"{domain}: {skills}")
            
            # Find matched and missing skills
            matched_skills = {}
            missing_skills = {}
            
            for domain in resume_skills:
                matches = list(set(resume_skills[domain]) & set(job_skills[domain]))
                misses = list(set(job_skills[domain]) - set(resume_skills[domain]))
                
                # Always include one skill if available
                matched_skills[domain] = [random.choice(matches)] if matches else []
                missing_skills[domain] = [random.choice(misses)] if misses else []
                
                # If domain is mentioned in job but no specific skills found
                if not missing_skills[domain] and domain.lower() in job_description.lower():
                    domain_suggestions = {
                        "Data Science": ["python/data analysis"],
                        "Web Development": ["modern web frameworks"],
                        "Android Development": ["mobile development"],
                        "iOS Development": ["mobile development"],
                        "UI/UX Design": ["user experience design"],
                        "Other Skills": ["professional communication"]
                    }
                    missing_skills[domain] = domain_suggestions.get(domain, [])
            
            output_data = {
                "message": "Resume-to-job match information",
                "Job Description": job_data['description'],
                "Matched Skills (Sample)": matched_skills,
                "Missing Skills (Sample)": missing_skills
            }
            
            # Save to the correct path
            with open(result_path, 'w') as f:
                json.dump(output_data, f, indent=2)
            print(f"\nResults saved to: {result_path}")
            
            # Print summary
            print("\nSkill Match Summary (Sample):")
            for domain, skills in matched_skills.items():
                if skills:
                    print(f"\n{domain} - Matched Skills:")
                    print(f"- {skills[0]}")
            
            print("\nMissing Skills (Sample):")
            for domain, skills in missing_skills.items():
                if skills:
                    print(f"\n{domain}:")
                    print(f"- {skills[0]}")
            
        except Exception as e:
            print(f"Error: {str(e)}")

    # Run the tests
    while True:
        print("\nChoose a test to run:")
        print("1. Analyze Resume")
        print("2. Suggest Improvements")
        print("3. Check Match")
        print("4. Exit")
        
        choice = input("\nEnter your choice (1-4): ")
        
        if choice == '1':
            test_analyze_resume()
        elif choice == '2':
            test_suggest_improvements()
        elif choice == '3':
            test_check_match()
        elif choice == '4':
            break
        else:
            print("Invalid choice. Please try again.")
