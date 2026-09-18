import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { analysisService } from '../services/analysis.service';
import toast from 'react-hot-toast';

export function useAnalysis(documentId?: string) {
  const queryClient = useQueryClient();

  const analysisQuery = useQuery({
    queryKey: ['document_analysis', documentId],
    queryFn: () => documentId ? analysisService.getLatestAnalysis(documentId) : null,
    enabled: !!documentId,
    retry: 1,
  });

  const triggerMutation = useMutation({
    mutationFn: ({ docId, mode, lang }: { docId: string; mode?: string; lang?: string }) => 
      analysisService.triggerAnalysis(docId, mode, lang),
    onSuccess: (data) => {
      queryClient.setQueryData(['document_analysis', data.document], data);
      toast.success('Document analysis completed.');
    },
    onError: () => {
      toast.error('Failed to complete AI analysis.');
    }
  });

  const comparisonMutation = useMutation({
    mutationFn: ({ docA, docB }: { docA: string; docB: string }) => 
      analysisService.compareDocuments(docA, docB),
    onSuccess: () => {
      toast.success('Contract comparison generated.');
    },
    onError: () => {
      toast.error('Failed to compare documents.');
    }
  });

  return {
    analysis: analysisQuery.data,
    isLoading: analysisQuery.isLoading,
    isError: analysisQuery.isError,
    triggerAnalysis: triggerMutation.mutateAsync,
    isAnalyzing: triggerMutation.isPending,
    compareDocuments: comparisonMutation.mutateAsync,
    isComparing: comparisonMutation.isPending,
    refetch: analysisQuery.refetch,
  };
}
