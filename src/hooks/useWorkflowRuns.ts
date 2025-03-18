
import { useState, useCallback } from 'react';
import { WorkflowRun } from '@/types/workflow';
import { api } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';

export function useWorkflowRuns(workflowId: number | undefined) {
  const [workflowRuns, setWorkflowRuns] = useState<WorkflowRun[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchWorkflowRuns = useCallback(async () => {
    if (!workflowId) return;
    
    setLoading(true);
    try {
      const data = await api.getWorkflowRuns(workflowId);
      setWorkflowRuns(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching workflow runs:', err);
      setError(err as Error);
      toast({
        title: 'Error',
        description: 'Failed to fetch workflow runs. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [workflowId, toast]);

  return {
    workflowRuns,
    loading,
    error,
    fetchWorkflowRuns
  };
}
