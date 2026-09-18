import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentsService } from '../services/documents.service';
import toast from 'react-hot-toast';

export function useDocuments(params?: { search?: string; document_type?: string; folder?: string }) {
  const queryClient = useQueryClient();

  const documentsQuery = useQuery({
    queryKey: ['documents', params],
    queryFn: () => documentsService.getDocuments(params),
  });

  const foldersQuery = useQuery({
    queryKey: ['document_folders'],
    queryFn: () => documentsService.getFolders(),
  });

  const uploadMutation = useMutation({
    mutationFn: (formData: FormData) => documentsService.uploadDocument(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Document uploaded and queued for processing.');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.file?.[0] || 'Upload failed.';
      toast.error(msg);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => documentsService.deleteDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Document moved to trash.');
    },
    onError: () => {
      toast.error('Failed to delete document.');
    }
  });

  return {
    documents: documentsQuery.data?.results || [],
    folders: foldersQuery.data || [],
    isLoading: documentsQuery.isLoading,
    isError: documentsQuery.isError,
    uploadDocument: uploadMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
    deleteDocument: deleteMutation.mutateAsync,
    refetch: documentsQuery.refetch,
  };
}
