# Generated by Django 5.1.1 on 2024-10-06 22:39

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('exams', '0008_alter_assignedexams_subject_alter_exam_subject'),
    ]

    operations = [
        migrations.AlterField(
            model_name='supervisorquestion',
            name='exam',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='SupervisorExam', to='exams.supervisorexam'),
        ),
        migrations.AlterField(
            model_name='supervisorquestion',
            name='question',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='exams.question'),
        ),
    ]
