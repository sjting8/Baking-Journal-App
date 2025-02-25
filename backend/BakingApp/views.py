from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Journal, JournalEntry
from .serializers import JournalSerializer, JournalEntrySerializer
from django.shortcuts import get_object_or_404

class JournalViewSet(viewsets.ModelViewSet):
    queryset = Journal.objects.all()
    serializer_class = JournalSerializer

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            journal = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = serializer.data
        data['entries'] = JournalEntrySerializer(
            instance.entries.all().order_by('-created_at'),
            many=True
        ).data
        return Response(data)

class JournalEntryViewSet(viewsets.ModelViewSet):
    serializer_class = JournalEntrySerializer

    def get_queryset(self):
        journal_id = self.kwargs.get('journal_id')
        if journal_id:
            return JournalEntry.objects.filter(journal_id=journal_id)
        return JournalEntry.objects.all()

    def create(self, request, journal_id=None):
        print("Received data:", request.data)
        print("Journal ID:", journal_id)   
        
        try:
            journal = get_object_or_404(Journal, id=journal_id)
        
            serializer = self.get_serializer(data={
                'content': request.data.get('content'),
                'journal': journal.id
            })
            
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                print("Serializer errors:", serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            print("Error creating entry:", str(e)) 
            return Response(
                {'detail': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response(
                {'detail': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
    def update(self, request, journal_id=None, pk=None):
        try:
            entry = get_object_or_404(JournalEntry, id=pk, journal_id=journal_id)
            
            serializer = self.get_serializer(entry, data={
                'content': request.data.get('content'),
                'rating': request.data.get('rating'),
                'journal': journal_id
            }, partial=True)
            
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            print("Error updating entry:", str(e))
            return Response(
                {'detail': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )