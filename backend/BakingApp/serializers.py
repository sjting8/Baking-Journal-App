from rest_framework import serializers
from .models import Journal, JournalEntry

class JournalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Journal
        fields = ['id', 'title', 'created_at', 'updated_at']

class JournalEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = JournalEntry
        fields = ['id', 'content', 'created_at', 'updated_at', 'journal', 'rating']
        read_only_fields = ['id', 'created_at', 'updated_at']
        extra_kwargs = {'journal': {'required': False}}