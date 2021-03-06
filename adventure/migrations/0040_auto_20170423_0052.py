# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-04-23 07:52
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('adventure', '0039_auto_20170423_0043'),
    ]

    operations = [
        migrations.AlterField(
            model_name='artifact',
            name='armor_class',
            field=models.IntegerField(default=0, help_text='(Armor only) How many hits does this armor protect against?'),
        ),
        migrations.AlterField(
            model_name='artifact',
            name='armor_penalty',
            field=models.IntegerField(default=0, help_text='(Armor only) How much armor expertise does the player need to use this armor without penalty?', null=True),
        ),
    ]
