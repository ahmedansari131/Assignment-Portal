from django.contrib import admin
from authentication.models import User
from portal.models import Assignment

admin.site.register(User)
admin.site.register(Assignment)
