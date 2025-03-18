import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import WorkflowStageFields from './WorkflowStageFields';
import {
  Workflow,
  WorkflowFormData,
  CATEGORY_OPTIONS,
  SCHEDULE_TYPE_OPTIONS,
  SCHEDULE_TYPE_MAP,
  SCHEDULE_TYPE_REVERSE_MAP,
  WorkflowStage,
} from '@/types/workflow';

interface EditWorkflowModalProps {
  isOpen: boolean;
  workflow: Workflow | null;
  onClose: () => void;
  onSubmit: (id: number, data: Partial<WorkflowFormData>) => Promise<void>;
}

const EditWorkflowModal: React.FC<EditWorkflowModalProps> = ({
  isOpen,
  workflow,
  onClose,
  onSubmit,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<WorkflowFormData>({
    title: '',
    target_companies_category: '',
    is_scheduled: false,
    schedule_frequency: SCHEDULE_TYPE_MAP.Daily,
    is_sandbox: false,
    data: {
      stages: [],
    },
  });

  useEffect(() => {
    if (workflow) {
      setFormData({
        title: workflow.title,
        target_companies_category: workflow.target_companies_category,
        is_scheduled: workflow.is_scheduled,
        schedule_frequency: workflow.schedule_frequency,
        is_sandbox: workflow.is_sandbox,
        data: {
          stages: workflow.data.stages.map(stage => ({
            id: stage.id,
            name: stage.name,
            queries: [...stage.queries],
            threshold: stage.threshold,
          })),
        },
      });
    }
  }, [workflow]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleScheduleTypeChange = (value: string) => {
    const scheduleType = value as keyof typeof SCHEDULE_TYPE_MAP;
    setFormData((prev) => ({
      ...prev,
      schedule_frequency: SCHEDULE_TYPE_MAP[scheduleType],
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleStagesChange = (stages: Partial<WorkflowStage>[]) => {
    setFormData((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        stages: stages as WorkflowStage[],
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!workflow) return;
    
    if (!formData.title) {
      alert('Please enter a workflow name');
      return;
    }
    
    if (!formData.target_companies_category) {
      alert('Please select a category');
      return;
    }
    
    if (formData.data.stages.length === 0) {
      alert('Please add at least one stage');
      return;
    }
    
    for (const stage of formData.data.stages) {
      if (!stage.name) {
        alert('Please enter a name for all stages');
        return;
      }
      
      if (!stage.queries || stage.queries.length === 0) {
        alert('Please add at least one question to each stage');
        return;
      }
      
      for (const query of stage.queries) {
        if (!query) {
          alert('Please fill in all questions');
          return;
        }
      }
    }
    
    try {
      setIsSubmitting(true);
      const formattedData: Partial<WorkflowFormData> = {
        ...formData,
        data: {
          stages: formData.data.stages.map((stage) => ({
            ...stage,
            id: stage.id || Math.floor(Math.random() * 10000),
          })),
        },
      };
      
      await onSubmit(workflow.id, formattedData);
      onClose();
    } catch (error) {
      console.error('Error updating workflow:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentScheduleType = () => {
    return SCHEDULE_TYPE_REVERSE_MAP[formData.schedule_frequency] || 'Daily';
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">Edit Workflow</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Update the workflow details below.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="edit-title" className="text-sm font-medium">Workflow Name</Label>
                <Input
                  id="edit-title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter workflow name"
                  className="transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-category" className="text-sm font-medium">Category</Label>
                <Select
                  value={formData.target_companies_category}
                  onValueChange={(value) => handleSelectChange('target_companies_category', value)}
                >
                  <SelectTrigger id="edit-category" className="transition-all duration-200">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="edit-schedule" className="text-sm font-medium">Schedule Type</Label>
                <Select
                  value={getCurrentScheduleType()}
                  onValueChange={handleScheduleTypeChange}
                  disabled={!formData.is_scheduled}
                >
                  <SelectTrigger id="edit-schedule" className="transition-all duration-200">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {SCHEDULE_TYPE_OPTIONS.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 h-full pt-6">
                <Switch
                  id="edit-is_scheduled"
                  checked={formData.is_scheduled}
                  onCheckedChange={(checked) => handleSwitchChange('is_scheduled', checked)}
                />
                <Label htmlFor="edit-is_scheduled" className="text-sm font-medium cursor-pointer">
                  {formData.is_scheduled ? 'Active' : 'Inactive'}
                </Label>
              </div>
            </div>

            <div className="flex items-center space-x-2 h-full">
              <Switch
                id="edit-is_sandbox"
                checked={formData.is_sandbox}
                onCheckedChange={(checked) => handleSwitchChange('is_sandbox', checked)}
              />
              <Label htmlFor="edit-is_sandbox" className="text-sm font-medium cursor-pointer">
                {formData.is_sandbox ? 'Sandbox Mode' : 'Production Mode'}
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description" className="text-sm font-medium">Description (Optional)</Label>
              <Textarea
                id="edit-description"
                name="description"
                placeholder="Enter a description for this workflow"
                className="min-h-24 transition-all duration-200"
              />
            </div>

            <div className="pt-4">
              <WorkflowStageFields
                stages={formData.data.stages}
                onStagesChange={handleStagesChange}
              />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
              className="transition-all duration-200"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="min-w-24 transition-all duration-200"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditWorkflowModal;
