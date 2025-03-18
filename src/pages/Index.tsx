
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WorkflowTable from '@/components/WorkflowTable';
import AddWorkflowModal from '@/components/AddWorkflowModal';
import EditWorkflowModal from '@/components/EditWorkflowModal';
import { useWorkflows } from '@/hooks/useWorkflows';
import { Workflow, WorkflowFormData } from '@/types/workflow';

const Index: React.FC = () => {
  const {
    workflows,
    loading,
    error,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
  } = useWorkflows();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation after component mounts
    const timer = setTimeout(() => {
      setFadeIn(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleAddWorkflow = async (data: WorkflowFormData) => {
    await createWorkflow(data);
    setIsAddModalOpen(false);
  };

  const handleEditWorkflow = (workflow: Workflow) => {
    setSelectedWorkflow(workflow);
    setIsEditModalOpen(true);
  };

  const handleUpdateWorkflow = async (id: number, data: Partial<WorkflowFormData>) => {
    await updateWorkflow(id, data);
    setIsEditModalOpen(false);
    setSelectedWorkflow(null);
  };

  const handleDeleteWorkflow = async (id: number) => {
    await deleteWorkflow(id);
  };

  return (
    <div className={`min-h-screen flex flex-col p-6 md:p-10 transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold">Workflow Management</h1>
            <p className="text-muted-foreground mt-1 md:mt-2">
              Create and manage intelligent workflows for your sales processes
            </p>
          </div>
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="mt-4 md:mt-0 bg-primary hover:bg-primary/90 transition-all duration-300 group"
          >
            <Plus className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
            Add Workflow
          </Button>
        </div>
      </header>

      <main className="flex-1 animate-fade-in">
        <div className="rounded-xl border border-gray-100 overflow-hidden">
          <WorkflowTable
            workflows={workflows}
            onEdit={handleEditWorkflow}
            onDelete={handleDeleteWorkflow}
            isLoading={loading}
          />
        </div>
      </main>

      <AddWorkflowModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddWorkflow}
      />

      <EditWorkflowModal
        isOpen={isEditModalOpen}
        workflow={selectedWorkflow}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedWorkflow(null);
        }}
        onSubmit={handleUpdateWorkflow}
      />
    </div>
  );
};

export default Index;
