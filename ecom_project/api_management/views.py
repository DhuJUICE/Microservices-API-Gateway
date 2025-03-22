from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework import status
from member_management.models import MEMBER
from .serializers import MemberSerializer
from django.shortcuts import render

from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated

#default page to make uptime robot get to a live section
def defaultHomePage(request):
    return render(request, 'defaultPage.html')

#MEMBER Management API VIEW
class MemberManagement(APIView):
    permission_classes = [AllowAny]  # Allow any user to access this endpoint

    # GET: List all members
    def get(self, request, pk=None, *args, **kwargs):
        if pk:
            try:
                member = MEMBER.objects.get(pk=pk)
            except MEMBER.DoesNotExist:
                return JsonResponse({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

            serializer = MemberSerializer(member)
            return JsonResponse(serializer.data, safe=False, status=status.HTTP_200_OK)

        members = MEMBER.objects.all()
        serializer = MemberSerializer(members, many=True)
        return JsonResponse(serializer.data, safe=False, status=status.HTTP_200_OK)

    # POST: Create a new member
    def post(self, request, *args, **kwargs):
        serializer = MemberSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # PUT: Update a member by ID
    def put(self, request, pk, *args, **kwargs):
        try:
            member = MEMBER.objects.get(pk=pk)
        except MEMBER.DoesNotExist:
            return JsonResponse({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = MemberSerializer(member, data=request.data, partial=False)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_200_OK)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # DELETE: Delete a member by ID
    def delete(self, request, pk, *args, **kwargs):
        try:
            member = MEMBER.objects.get(pk=pk)
        except MEMBER.DoesNotExist:
            return JsonResponse({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        member.delete()
        return JsonResponse({"detail": "Deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

# MEMBER Count API VIEW
class MemberCount(APIView):
    permission_classes = [AllowAny]  # Allow any user to access this endpoint
    
    def get(self, request, *args, **kwargs):
        count = MEMBER.objects.count()
        return JsonResponse({"member_count": count}, status=status.HTTP_200_OK)
