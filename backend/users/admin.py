from django.contrib import admin
from .models import User, Organization, Branch, Track

# Custom filter for organization field
class OrganizationFilter(admin.SimpleListFilter):
    title = 'Organization'
    parameter_name = 'organization'

    def lookups(self, request, model_admin):
        # Returns a list of tuples where the first element is the expected value in the URL query
        # and the second is the human-readable name for that option.
        organizations = set([user.organization for user in User.objects.all() if user.organization])
        return [(org.id, org.name) for org in organizations]

    def queryset(self, request, queryset):
        # Filter the queryset based on the value provided in the query string.
        if self.value():
            return queryset.filter(organization__id=self.value())
        return queryset

# Custom filter for branch field
class BranchFilter(admin.SimpleListFilter):
    title = 'Branch'
    parameter_name = 'branch'

    def lookups(self, request, model_admin):
        branches = set([user.branch for user in User.objects.all() if user.branch])
        return [(branch.id, branch.name) for branch in branches]

    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(branch__id=self.value())
        return queryset

class UserAdmin(admin.ModelAdmin):
    # Displaying additional fields like organization, branch, role, email_verified, and approval status
    list_display = ('email', 'username', 'role', 'get_organization', 'get_branch', 'email_verified', 'is_approved_by_admin')
    list_filter = ('role', OrganizationFilter, BranchFilter, 'email_verified', 'is_approved_by_admin')  # Filters for roles, organization, branch, email_verified, and admin approval status

    search_fields = ('email', 'username')  # Enable search by email and username
    actions = ['approve_users']  # Add a bulk action for approving users

    # Display the organization name in the list display
    def get_organization(self, obj):
        return obj.organization.name if obj.organization else None
    get_organization.short_description = 'Organization'

    # Display the branch name in the list display
    def get_branch(self, obj):
        return obj.branch.name if obj.branch else None
    get_branch.short_description = 'Branch'

    # Action to approve selected users in bulk
    def approve_users(self, request, queryset):
        queryset.update(is_approved_by_admin=True)
        self.message_user(request, "Selected users have been approved.")
    approve_users.short_description = 'Approve selected users'


# Registering Organization, Branch, and Track models
admin.site.register(User, UserAdmin)
admin.site.register(Organization)
admin.site.register(Branch)
admin.site.register(Track)
