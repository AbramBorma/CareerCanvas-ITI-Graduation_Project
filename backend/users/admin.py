from django.contrib import admin
from users.models import User, Profile

try:
    admin.site.unregister(User)
except admin.sites.NotRegistered:
    pass

class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'role', 'organization']  
    list_filter = ['role', 'organization']

admin.site.register(User, UserAdmin)

class ProfileAdmin(admin.ModelAdmin):
    list_editable = ['linkedin', 'github', 'leetcode', 'hackerrank']
    list_display = ['user', 'full_name', 'linkedin', 'github', 'leetcode', 'hackerrank']

admin.site.register(Profile, ProfileAdmin)
