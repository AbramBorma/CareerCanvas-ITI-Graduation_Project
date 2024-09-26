from django.contrib import admin
from users.models import User, Profile

class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email']


class ProfileAdmin(admin.ModelAdmin):
    list_editable = ['linkedin', 'github', 'leetcode', 'hackerrank']
    list_display = ['user', 'full_name', 'linkedin', 'github', 'leetcode', 'hackerrank']

admin.site.register(User, UserAdmin)
admin.site.register(Profile, ProfileAdmin)
