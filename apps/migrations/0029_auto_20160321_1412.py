# -*- coding: utf-8 -*-
# Generated by Django 1.9.2 on 2016-03-21 13:12
from __future__ import unicode_literals

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('apps', '0028_user_profile_public'),
    ]

    operations = [
        migrations.AddField(
            model_name='historicalreference',
            name='search_terms',
            field=models.CharField(blank=True, default='', help_text='Дополнительные фразы, по которым можно найти данную статью, например: <i>«список», для «list»</i>', max_length=500, verbose_name='Термины поиска'),
        ),
        migrations.AddField(
            model_name='reference',
            name='search_terms',
            field=models.CharField(blank=True, default='', help_text='Дополнительные фразы, по которым можно найти данную статью, например: <i>«список», для «list»</i>', max_length=500, verbose_name='Термины поиска'),
        ),
        migrations.AlterField(
            model_name='article',
            name='location',
            field=models.PositiveIntegerField(choices=[(1, 'На этом сайте')], default=1, help_text='Статью можно написать прямо на этом сайте, либо сформировать статью-ссылку на внешний ресурс.', verbose_name='Расположение статьи'),
        ),
        migrations.AlterField(
            model_name='historicalarticle',
            name='location',
            field=models.PositiveIntegerField(choices=[(1, 'На этом сайте')], default=1, help_text='Статью можно написать прямо на этом сайте, либо сформировать статью-ссылку на внешний ресурс.', verbose_name='Расположение статьи'),
        ),
        migrations.AlterField(
            model_name='historicalreference',
            name='parent',
            field=models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='apps.HistoricalReference'),
        ),
        migrations.AlterField(
            model_name='user',
            name='username',
            field=models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 30 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=30, unique=True, validators=[django.core.validators.RegexValidator('^[\\w.@+-]+$', 'Enter a valid username. This value may contain only letters, numbers and @/./+/-/_ characters.')], verbose_name='username'),
        ),
    ]
