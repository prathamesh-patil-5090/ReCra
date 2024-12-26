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
import os

# Load spaCy model
nlp = spacy.load("en_core_web_sm")

# Load the trained chatbot model
model = tf.keras.models.load_model('path_to_model/chatbot_model_skills.h5')

# Load words and classes
words = pickle.load(open('path_to_model/words_skills.pkl', 'rb'))
classes = pickle.load(open('path_to_model/classes_skills.pkl', 'rb'))

# Load intents file
with open('path_to_model/skills.json') as f:
    intents = json.load(f)

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

        return JsonResponse({
            "Missing Skills Analysis": missing_skills_summary,
            "Chatbot Responses": chatbot_responses,
            "Feedback": feedback
        })
    else:
        return JsonResponse({"error": "Invalid request method."}, status=400)
