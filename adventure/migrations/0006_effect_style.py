# -*- coding: utf-8 -*-
# Generated by Django 1.9.2 on 2016-03-06 08:02
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('adventure', '0005_auto_20160305_1457'),
    ]

    operations = [
        migrations.AddField(
            model_name='effect',
            name='style',
            field=models.TextField(max_length=20, null=True),
        ),
    ]
