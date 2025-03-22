from django.urls import path
from . import views

#token view imports
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
	#default homepage load
	path('', views.defaultHomePage, name='defaultHomePage'),

	#Used for logging users in - No need for the login endpoint
	path('api/token', TokenObtainPairView.as_view(), name='token'),
    path('api/token/refresh', TokenRefreshView.as_view(), name='token-refresh'),

	#USER MANAGEMENT API ENDPOINTS
	path('api/member', views.MemberManagement.as_view(), name='member-management'),
	path('api/member/<int:pk>', views.MemberManagement.as_view(), name='member-management-with-id'),

	# GET MEMBER count
	path('api/member/count', views.MemberCount.as_view(), name='member-count'),  
]
