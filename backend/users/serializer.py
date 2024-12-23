from users.models import Branch, Track, Organization, User, Role
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.hashers import make_password,check_password


# User Serializer
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = (
            'username', 'first_name', 'last_name', 'email', 'password', 'password2', 'organization', 
            'branch', 'track', 'linkedin', 'github', 'leetcode', 'hackerrank', 'role'  # Include track field
        )

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords do not match.")
        
        # Conditional validation based on roles
        if 'role' not in data:
            raise serializers.ValidationError("Role is required.")
        
        if data['role'] == Role.STUDENT:
            required_fields = ['github', 'linkedin', 'leetcode', 'hackerrank']
            for field in required_fields:
                if not data.get(field):
                    raise serializers.ValidationError(f"{field} is required for students.")
        
        return data

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email'],
            organization=validated_data.get('organization'),
            branch=validated_data.get('branch'),
            track=validated_data.get('track'),  # Ensure track is saved
            role=validated_data['role'],  # Ensure role is saved
            github=validated_data.get('github'),
            linkedin=validated_data.get('linkedin'),
            leetcode=validated_data.get('leetcode'),
            hackerrank=validated_data.get('hackerrank'),
        )
        user.set_password(validated_data['password'])
        user.is_verified = False
        user.is_active = False  # User needs approval by an admin or superuser
        user.save()  # Save the user with the track
        return user


# Custom Token Serializer for adding custom claims to the JWT token
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    
    def validate(self, attrs):
        print(attrs)  # Check what attributes are being passed here
        data = super().validate(attrs)
        # Add any custom logic here
        return data
    
    @classmethod
    def get_token(cls, user):
        print(user)
        token = super().get_token(user)
        
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        token['email'] = user.email
        token['role'] = user.role
        token['is_authorized'] = user.is_authorized
        # Add organization ID or name
        token['organization'] = str(user.organization) if user.organization else None
        # Add branch ID or name
        token['branch'] = str(user.branch) if user.branch else None
        
        # For tracks, serialize as a list of track names or IDs
        token['tracks'] = [str(track) for track in user.tracks.all()]
        
        # Add custom fields only if they're set (optional fields for students)
        if user.github:
            token['github'] = user.github
        if user.linkedin:
            token['linkedin'] = user.linkedin
        if user.leetcode:
            token['leetcode'] = user.leetcode
        if user.hackerrank:
            token['hackerrank'] = user.hackerrank
        
        print(token)
        return token
    


# Register Serializer for handling user registration
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    github = serializers.URLField(required=False, allow_blank=True)
    linkedin = serializers.URLField(required=False, allow_blank=True)
    leetcode = serializers.URLField(required=False, allow_blank=True)
    hackerrank = serializers.URLField(required=False, allow_blank=True)

    organization = serializers.PrimaryKeyRelatedField(queryset=Organization.objects.all(), required=False)
    branch = serializers.PrimaryKeyRelatedField(queryset=Branch.objects.all(), required=False)
    tracks = serializers.PrimaryKeyRelatedField(queryset=Track.objects.all(), many=True, required=False)

    class Meta:
        model = User
        fields = (
            'email', 'username', 'password', 'password2', 'organization', 
            'branch', 'tracks', 'role', 'github', 'linkedin', 'leetcode', 'hackerrank'
        )

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        
        # Custom validation based on roles
        if 'role' not in attrs:
            raise serializers.ValidationError("Role is required.")

        if attrs['role'] == Role.ADMIN:
            if not attrs.get('organization'):
                raise serializers.ValidationError({"organization": "Organization is required for admins."})
            if not attrs.get('branch'):
                raise serializers.ValidationError({"branch": "Branch is required for admins."})
        
        if attrs['role'] == Role.SUPERVISOR:
            if not attrs.get('organization'):
                raise serializers.ValidationError({"organization is required for supervisors."})
            if not attrs.get('branch'):
                raise serializers.ValidationError({"branch is required for supervisors."})
            if not attrs.get('tracks'):
                raise serializers.ValidationError({"tracks is required for supervisors."})

        if attrs['role'] == Role.STUDENT:
            required_fields = ['github', 'linkedin', 'leetcode', 'hackerrank']
            for field in required_fields:
                if not attrs.get(field):
                    raise serializers.ValidationError({field: f"{field} is required for students."})

        return attrs

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
            organization=validated_data.get('organization'),
            branch=validated_data.get('branch'),
            role=validated_data['role'],
        )
        user.set_password(validated_data['password'])
        user.is_active = False  # User will remain inactive until approved by an admin
        user.save()

        # Set tracks if provided
        if 'tracks' in validated_data:
            user.tracks.set(validated_data['tracks'])

        return user

# Password Reset Serializer for sending a password reset email
class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("No user is associated with this email address")
        return value

# Serializer for setting a new password
class SetNewPasswordSerializer(serializers.Serializer):
    new_password = serializers.CharField(write_only=True)

    def validate(self, data):
        password = data.get('new_password')
        return data

    def save(self, user):
        password = self.validated_data['new_password']
        user.set_password(password)
        user.save()

# Serializer for Organization model
class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = '__all__'  

# Serializer for Branch model
class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = ['id', 'name', 'organization']

# Serializer for Track model
class TrackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Track
        fields = ['id', 'name', 'branch']

#######################################################

class EditProfileSerializer(serializers.ModelSerializer):
    github = serializers.URLField(required=False, allow_blank=True)
    linkedin = serializers.URLField(required=False, allow_blank=True)
    leetcode = serializers.URLField(required=False, allow_blank=True)
    hackerrank = serializers.URLField(required=False, allow_blank=True)


    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'email',  
            'github', 'linkedin', 'leetcode', 'hackerrank'        ]

    def validate_email(self, value):
        user = self.context['request'].user
        if User.objects.exclude(pk=user.pk).filter(email=value).exists():
            raise serializers.ValidationError("This email is already in use.")
        return value

