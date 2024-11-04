from rest_framework import serializers
from .models import *

class LessonsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = '__all__'

class MyLessonsSerializer(serializers.ModelSerializer):
    lesson = LessonsSerializer()  # Nesting the LessonSerializer to include full lesson details

    class Meta:
        model = UserLesson
        fields = ['id', 'lesson', 'finished', 'value']

class UserLessonSerializer(serializers.ModelSerializer):
    lesson = serializers.PrimaryKeyRelatedField(queryset=Lesson.objects.all())
    
    class Meta:
        model = UserLesson
        fields = ['id', 'lesson', 'finished', 'value']
    
    def validate(self, data):
        user = self.context['request'].user
        lesson = data['lesson']
        
        # Check if the user already has a UserLesson for this lesson
        user_lesson = UserLesson.objects.filter(user=user, lesson=lesson).first()
        if user_lesson:
            # Return the existing lesson ID if it already exists
            self.context['existing_lesson_id'] = user_lesson.id  # Store ID in context
            return data  # Continue without raising an error

        return data

    def create(self, validated_data):
        user = self.context['request'].user
        lesson = validated_data.get('lesson')
        
        user_lesson = UserLesson.objects.create(
            user=user,
            lesson=lesson,
            finished=False,
            value=0
        )
        return user_lesson

class RegisterSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'full_name']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        username = validated_data['username']
        password = validated_data['password']
        full_name = validated_data['full_name']
        user = User.objects.create_user(username=username, password=password)
        Profile.objects.create(
            user=user,
            full_name=full_name,
        )
        
        return user

class ProfileSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()
    lessons = UserLessonSerializer(many=True, read_only=True)

    class Meta:
        model = Profile
        fields = '__all__'

    def get_avatar(self, obj):
        name = obj.full_name or "Anonymous"
        f = name.split(' ')[0]
        default_avatar_url = f"https://ui-avatars.com/api/?name={f}"
        return default_avatar_url