from rest_framework import serializers
from .models import Journal, JournalEntry, Tag

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']

class JournalSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, required=False)

    class Meta:
        model = Journal
        fields = ['id', 'title', 'tags', 'created_at', 'updated_at']

    def create(self, validated_data):
        tags_data = validated_data.pop('tags', [])
        journal = Journal.objects.create(**validated_data)
        for tag_data in tags_data:
            tag, created = Tag.objects.get_or_create(name=tag_data['name'])
            journal.tags.add(tag)
        return journal

    def update(self, instance, validated_data):
        tags_data = validated_data.pop('tags', [])
        instance.title = validated_data.get('title', instance.title)
        instance.save()

        if tags_data is not None:
            instance.tags.clear()
            for tag_data in tags_data:
                tag, created = Tag.objects.get_or_create(name=tag_data['name'])
                instance.tags.add(tag)
        return instance

class JournalEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = JournalEntry
        fields = ['id', 'content', 'created_at', 'updated_at', 'journal', 'rating']
        read_only_fields = ['id', 'created_at', 'updated_at']
        extra_kwargs = {'journal': {'required': False}}