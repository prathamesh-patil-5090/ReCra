"""
URL configuration for ReCra project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path
from django.views.generic import TemplateView
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', TemplateView.as_view(template_name='index.html')),
    path('analyze_resume_view/', views.analyze_resume_view, name='analyze_resume_view'),
    path('analyze_resume/', views.analyze_resume, name='analyze_resume'),
    path('suggest_improvements/', views.suggest_improvements, name='suggest_improvements'),
    path('check_match/', views.check_match, name='check_match'),

    # Catch-all pattern to serve frontend's index.html
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
]
