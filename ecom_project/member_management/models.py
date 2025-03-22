from django.db import models

class MEMBER(models.Model):
    # First name of the member
    first_name = models.CharField(max_length=100)
    
    # Last name of the member
    last_name = models.CharField(max_length=100)
    
    # Nickname of the member (optional)
    nick_name = models.CharField(max_length=100, blank=True, null=True)
    
    # Email address of the member
    email = models.EmailField(unique=True)
    
    # WhatsApp number of the member
    whatsapp_number = models.CharField(max_length=15, blank=True, null=True)
    
    # Registration date (auto sets to current time when the member is created)
    registration_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.nick_name})"