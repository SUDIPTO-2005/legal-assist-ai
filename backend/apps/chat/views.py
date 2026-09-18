from rest_framework import generics, permissions, status, views, viewsets
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import ChatSession, ChatMessage
from .serializers import ChatSessionSerializer, ChatMessageSerializer
from apps.documents.models import Document
from apps.ai_engine.rag_pipeline import RAGPipeline
from apps.ai_engine.safety import SecurityGuardrail

class ChatSessionViewSet(viewsets.ModelViewSet):
    serializer_class = ChatSessionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ChatSession.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(
            user=self.request.user,
            explanation_mode=self.request.user.explanation_mode or 'beginner',
            language=self.request.user.preferred_language or 'en'
        )


class SendChatMessageView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, session_id):
        session = get_object_or_404(ChatSession, id=session_id, user=request.user)
        user_message_text = request.data.get('message', '').strip()

        if not user_message_text:
            return Response({'error': 'Message content cannot be empty.'}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Sanitize input
        sanitized_query = SecurityGuardrail.sanitize_input(user_message_text)

        # 2. Store User Message
        user_msg = ChatMessage.objects.create(
            session=session,
            role='user',
            content=sanitized_query
        )

        # Update session title if first message
        if session.messages.count() <= 2:
            session.title = sanitized_query[:45] + ("..." if len(sanitized_query) > 45 else "")
            session.save()

        # Build conversation history
        history_msgs = session.messages.order_by('created_at')[:6]
        history_text = "\n".join([f"{m.role.capitalize()}: {m.content}" for m in history_msgs])

        # 3. Call RAG pipeline
        pipeline = RAGPipeline()
        rag_response = pipeline.answer_chat_query(
            query=sanitized_query,
            document_id=str(session.document.id) if session.document else None,
            history=history_text,
            explanation_mode=session.explanation_mode,
            language=session.language
        )

        # 4. Store AI Assistant Message
        assistant_msg = ChatMessage.objects.create(
            session=session,
            role='assistant',
            content=rag_response['answer'],
            sources=rag_response.get('sources', []),
            escalation_suggested=rag_response.get('escalation_suggested', False),
            escalation_reason=rag_response.get('escalation_reason', ''),
            model_used='gpt-4o'
        )

        return Response({
            'user_message': ChatMessageSerializer(user_msg).data,
            'assistant_message': ChatMessageSerializer(assistant_msg).data
        }, status=status.HTTP_201_CREATED)
