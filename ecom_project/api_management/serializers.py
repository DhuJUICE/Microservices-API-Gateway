from rest_framework import serializers
from member_management.models import MEMBER


class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = MEMBER
        fields = '__all__'

