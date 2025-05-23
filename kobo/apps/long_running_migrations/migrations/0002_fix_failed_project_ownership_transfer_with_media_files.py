# Generated by Django 4.2.15 on 2024-12-18 20:00

from django.db import migrations


def add_long_running_migration(apps, schema_editor):
    LongRunningMigration = apps.get_model('long_running_migrations', 'LongRunningMigration')  # noqa
    LongRunningMigration.objects.create(
        name='0002_fix_project_ownership_transfer_with_media_files'
    )


def noop(*args, **kwargs):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('long_running_migrations', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(add_long_running_migration, noop),
    ]
