# -*- coding: utf-8 -*-
# Generated by Django 1.9.2 on 2016-04-20 06:24
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('adventure', '0013_auto_20160403_0015'),
    ]

    operations = [
        migrations.AddField(
            model_name='playerartifact',
            name='hands',
            field=models.IntegerField(choices=[(1, 'One-handed'), (2, 'Two-handed')], default=1),
        ),
        migrations.AddField(
            model_name='playerartifact',
            name='weight',
            field=models.IntegerField(default=0),
        ),
    ]
