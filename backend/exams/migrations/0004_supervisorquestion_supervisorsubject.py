# Generated by Django 5.1.1 on 2024-10-06 00:54

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('exams', '0003_assignedexams'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='SupervisorQuestion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('question_text', models.TextField()),
                ('level', models.CharField(choices=[('easy', 'Easy'), ('intermediate', 'Intermediate'), ('advanced', 'Advanced'), ('coding', 'Coding')], max_length=20)),
                ('option1', models.CharField(max_length=200)),
                ('option2', models.CharField(max_length=200)),
                ('option3', models.CharField(max_length=200)),
                ('option4', models.CharField(max_length=200)),
                ('correct_answer', models.CharField(max_length=200)),
                ('subject', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='supervisorQuestions', to='exams.subject')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='SupervisorSubject',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('number_of_questions', models.CharField(max_length=200)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
