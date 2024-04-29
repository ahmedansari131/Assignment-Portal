from django.contrib import admin
from authentication.models import User, OTP
from portal.models import Assignment

admin.site.register(User)
admin.site.register(OTP)
admin.site.register(Assignment)
