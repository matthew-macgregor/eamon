# Generated by Django 2.0 on 2018-01-25 06:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('adventure', '0043_auto_20170813_1501'),
    ]

    operations = [
        migrations.AddField(
            model_name='artifact',
            name='linked_door_id',
            field=models.IntegerField(blank=True, help_text='To make a two-sided door, enter the artifact ID of the other side of the door. They will open and close as a set.', null=True),
        ),
        migrations.AddField(
            model_name='monster',
            name='container_id',
            field=models.IntegerField(blank=True, help_text='Container artifact where this monster starts. The monster will enter the room as soon as the container is opened. e.g., a vampire who awakes when you open his coffin', null=True),
        ),
    ]
