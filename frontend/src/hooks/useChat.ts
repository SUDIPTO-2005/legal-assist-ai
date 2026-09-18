import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '../services/chat.service';
import toast from 'react-hot-toast';

export function useChat(sessionId?: string) {
  const queryClient = useQueryClient();

  const sessionsQuery = useQuery({
    queryKey: ['chat_sessions'],
    queryFn: () => chatService.getSessions(),
  });

  const currentSessionQuery = useQuery({
    queryKey: ['chat_session', sessionId],
    queryFn: () => sessionId ? chatService.getSession(sessionId) : null,
    enabled: !!sessionId,
  });

  const createSessionMutation = useMutation({
    mutationFn: ({ documentId, title }: { documentId?: string; title?: string }) =>
      chatService.createSession(documentId, title),
    onSuccess: (newSession) => {
      queryClient.invalidateQueries({ queryKey: ['chat_sessions'] });
      return newSession;
    }
  });

  const sendMessageMutation = useMutation({
    mutationFn: ({ sId, message }: { sId: string; message: string }) =>
      chatService.sendMessage(sId, message),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['chat_session', variables.sId] });
      queryClient.invalidateQueries({ queryKey: ['chat_sessions'] });
      if (data.assistant_message.escalation_suggested) {
        toast('Professional legal consultation is advised for this matter.', {
          icon: '⚠️',
          duration: 6000,
        });
      }
    },
    onError: () => {
      toast.error('Failed to send message.');
    }
  });

  return {
    sessions: sessionsQuery.data || [],
    currentSession: currentSessionQuery.data,
    isLoadingSessions: sessionsQuery.isLoading,
    isLoadingCurrentSession: currentSessionQuery.isLoading,
    createSession: createSessionMutation.mutateAsync,
    sendMessage: sendMessageMutation.mutateAsync,
    isSending: sendMessageMutation.isPending,
  };
}
