# Generated by Django 4.2.4 on 2023-08-16 16:38

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('wwg', '0002_saverecord_alter_records_user_id_alter_regions_kms_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='records',
            name='user_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='wwg.kakaousers'),
        ),
    ]
