# -*- coding: utf-8 -*-
# Generated by Django 1.9.2 on 2016-03-21 05:37
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('adventure', '0007_auto_20160306_0055'),
    ]

    operations = [
        migrations.RenameField(
            model_name='roomexit',
            old_name='key_id',
            new_name='door_id',
        ),
        migrations.AddField(
            model_name='artifact',
            name='key_id',
            field=models.IntegerField(help_text='If a container or door, the artifact ID of the key that opens it', null=True),
        ),
    ]
