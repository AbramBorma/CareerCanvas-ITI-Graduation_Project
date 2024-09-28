from users.models import Branch, Course, Organization, Profile, User
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from users.models import Branch, Course, Organization, User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)


        token['full_name'] = user.profile.full_name
        token['username'] = user.username
        token['email'] = user.email
        token['bio'] = user.profile.bio
        token['image'] = str(user.profile.image)

        token['linkedin'] = user.profile.linkedin
        token['github'] = user.profile.github
        token['leetcode'] = user.profile.leetcode
        token['hackerrank'] = user.profile.hackerrank
        
        
        return token

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    
    github = serializers.URLField(required=False, allow_blank=True)
    linkedin = serializers.URLField(required=False, allow_blank=True)
    leetcode = serializers.URLField(required=False, allow_blank=True)
    hackerrank = serializers.URLField(required=False, allow_blank=True)

    branch = serializers.ChoiceField(choices=Branch.choices, required=False)
    course = serializers.ChoiceField(choices=Course.choices, required=False)

    class Meta:
        model = User
        fields = ('email', 'username', 'password', 'password2', 'organization', 'branch', 'course', 'github', 'linkedin', 'leetcode', 'hackerrank')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        
        if attrs['organization'] == Organization.ITI:
            if not attrs.get('branch'):
                raise serializers.ValidationError({"branch": "Branch is required when organization is ITI."})
            if not attrs.get('course'):
                raise serializers.ValidationError({"course": "Course is required when organization is ITI."})

        return attrs

    def create(self, validated_data):
        github = validated_data.pop('github', None)
        linkedin = validated_data.pop('linkedin', None)
        leetcode = validated_data.pop('leetcode', None)
        hackerrank = validated_data.pop('hackerrank', None)

        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            organization=validated_data['organization'],
            branch=validated_data.get('branch'),
            course=validated_data.get('course'),
            is_active=False,
        )
        user.set_password(validated_data['password'])
        user.save()

        Profile.objects.create(
            user=user,
            github=github,
            linkedin=linkedin,
            leetcode=leetcode,
            hackerrank=hackerrank,
        )

        return user
    
class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("No user is associated with this email address")
        return value
    


class SetNewPasswordSerializer(serializers.Serializer):
    new_password = serializers.CharField(write_only=True)

    def validate(self, data):
        password = data.get('new_password')
        return data

    def save(self, user):
        password = self.validated_data['new_password']
        user.set_password(password)
        user.save()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'organization', 'role')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    branch = serializers.ChoiceField(choices=Branch.choices, required=False)
    course = serializers.ChoiceField(choices=Course.choices, required=False)

    class Meta:
        model = User
        fields = ('email', 'username', 'password', 'password2', 'organization', 'branch', 'course')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        
        if attrs['organization'] == Organization.ITI:
            if not attrs.get('branch'):
                raise serializers.ValidationError({"branch": "Branch is required when organization is ITI."})
            if not attrs.get('course'):
                raise serializers.ValidationError({"course": "Course is required when organization is ITI."})

        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            organization=validated_data['organization'],
            branch=validated_data.get('branch'),
            course=validated_data.get('course'),
            is_active=False,
        )
        user.set_password(validated_data['password'])
        user.save()

        return user

class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = '__all__'  
        
class BranchSerializer(serializers.Serializer):
    value = serializers.CharField()
    label = serializers.CharField()

class CourseSerializer(serializers.Serializer):
    value = serializers.CharField()
    label = serializers.CharField()
