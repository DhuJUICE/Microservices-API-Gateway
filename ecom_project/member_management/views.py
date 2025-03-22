from django.shortcuts import render
from django.http import JsonResponse
import json

def MemberManagement(request):
    return render(request, 'defaultPage.html')
