from django.urls import path
from . import views

urlpatterns = [
	path('member-management', views.MemberManagement),
]
