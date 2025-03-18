
import { useState, useEffect, useCallback } from 'react';
import { Workflow, WorkflowFormData } from '@/types/workflow';
import { api } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';

export function useWorkflows() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const { toast } = useToast();

  const refreshWorkflows = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  useEffect(() => {
    const fetchWorkflows = async () => {
      setLoading(true);
      try {
        const data = await api.getWorkflows();
        setWorkflows(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching workflows:', err);
        setError(err as Error);
        toast({
          title: 'Error',
          description: 'Failed to fetch workflows. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWorkflows();
  }, [refreshTrigger, toast]);

  const getWorkflow = useCallback(async (id: number) => {
    try {
      return await api.getWorkflow(id);
    } catch (err) {
      toast({
        title: 'Error',
        description: `Failed to fetch workflow details.`,
        variant: 'destructive',
      });
      throw err;
    }
  }, [toast]);

  const createWorkflow = useCallback(async (workflowData: WorkflowFormData) => {
    try {
      const result = await api.createWorkflow(workflowData);
      refreshWorkflows();
      toast({
        title: 'Success',
        description: 'Workflow created successfully.',
      });
      return result;
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to create workflow.',
        variant: 'destructive',
      });
      throw err;
    }
  }, [refreshWorkflows, toast]);

  const updateWorkflow = useCallback(async (id: number, workflowData: Partial<WorkflowFormData>) => {
    try {
      const result = await api.updateWorkflow(id, workflowData);
      refreshWorkflows();
      toast({
        title: 'Success',
        description: 'Workflow updated successfully.',
      });
      return result;
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update workflow.',
        variant: 'destructive',
      });
      throw err;
    }
  }, [refreshWorkflows, toast]);

  const deleteWorkflow = useCallback(async (id: number) => {
    try {
      await api.deleteWorkflow(id);
      refreshWorkflows();
      toast({
        title: 'Success',
        description: 'Workflow deleted successfully.',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete workflow.',
        variant: 'destructive',
      });
      throw err;
    }
  }, [refreshWorkflows, toast]);

  return {
    workflows,
    loading,
    error,
    refreshWorkflows,
    getWorkflow,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
  };
}
