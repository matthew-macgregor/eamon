# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2017-03-31 05:32
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('adventure', '0036_activitylog'),
    ]

    operations = [
        migrations.CreateModel(
            name='Author',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
            ],
        ),
        migrations.AddField(
            model_name='adventure',
            name='authors',
            field=models.ManyToManyField(to='adventure.Author'),
        ),
    ]
