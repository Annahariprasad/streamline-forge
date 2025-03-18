
import React, { useState } from 'react';
import { Trash, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { WorkflowStage } from '@/types/workflow';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface WorkflowStageFieldsProps {
  stages: Partial<WorkflowStage>[];
  onStagesChange: (stages: Partial<WorkflowStage>[]) => void;
}

const WorkflowStageFields: React.FC<WorkflowStageFieldsProps> = ({
  stages,
  onStagesChange,
}) => {
  const addStage = () => {
    const newStage: Partial<WorkflowStage> = {
      name: '',
      queries: [''],
      threshold: 0.5,
    };
    onStagesChange([...stages, newStage]);
  };

  const removeStage = (index: number) => {
    const updatedStages = [...stages];
    updatedStages.splice(index, 1);
    onStagesChange(updatedStages);
  };

  const updateStage = (index: number, field: keyof WorkflowStage, value: any) => {
    const updatedStages = [...stages];
    updatedStages[index] = { ...updatedStages[index], [field]: value };
    onStagesChange(updatedStages);
  };

  const addQuery = (stageIndex: number) => {
    const updatedStages = [...stages];
    const currentQueries = updatedStages[stageIndex].queries || [];
    updatedStages[stageIndex] = {
      ...updatedStages[stageIndex],
      queries: [...currentQueries, ''],
    };
    onStagesChange(updatedStages);
  };

  const removeQuery = (stageIndex: number, queryIndex: number) => {
    const updatedStages = [...stages];
    const currentQueries = [...(updatedStages[stageIndex].queries || [])];
    currentQueries.splice(queryIndex, 1);
    updatedStages[stageIndex] = {
      ...updatedStages[stageIndex],
      queries: currentQueries,
    };
    onStagesChange(updatedStages);
  };

  const updateQuery = (stageIndex: number, queryIndex: number, value: string) => {
    const updatedStages = [...stages];
    const currentQueries = [...(updatedStages[stageIndex].queries || [])];
    currentQueries[queryIndex] = value;
    updatedStages[stageIndex] = {
      ...updatedStages[stageIndex],
      queries: currentQueries,
    };
    onStagesChange(updatedStages);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Label className="text-lg font-semibold">Workflow Stages</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addStage}
          className="group transition-all duration-300 ease-in-out hover:bg-primary hover:text-primary-foreground"
        >
          <Plus className="w-4 h-4 mr-2 transition-transform group-hover:rotate-90 duration-300" />
          Add Stage
        </Button>
      </div>

      <div className="space-y-6">
        {stages.map((stage, stageIndex) => (
          <Card key={stageIndex} className="overflow-hidden animate-fade-in">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-md font-medium">Stage {stageIndex + 1}</h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeStage(stageIndex)}
                  className="h-8 w-8 text-gray-500 hover:text-destructive transition-colors duration-200"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`stage-name-${stageIndex}`}>Stage Name</Label>
                  <Input
                    id={`stage-name-${stageIndex}`}
                    value={stage.name || ''}
                    onChange={(e) => updateStage(stageIndex, 'name', e.target.value)}
                    placeholder="Enter stage name"
                    className="transition-all duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`stage-threshold-${stageIndex}`}>Threshold (0-1)</Label>
                  <Input
                    id={`stage-threshold-${stageIndex}`}
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={stage.threshold || 0}
                    onChange={(e) => updateStage(stageIndex, 'threshold', Number(e.target.value))}
                    className="transition-all duration-300"
                  />
                </div>

                <Separator className="my-4" />

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label>Questions</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => addQuery(stageIndex)}
                      className="h-7 px-2 text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" /> Add Question
                    </Button>
                  </div>

                  {stage.queries?.map((query, queryIndex) => (
                    <div key={queryIndex} className="flex items-center gap-2 animate-fade-in">
                      <Input
                        value={query}
                        onChange={(e) => updateQuery(stageIndex, queryIndex, e.target.value)}
                        placeholder="Enter question"
                        className="transition-all duration-300"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeQuery(stageIndex, queryIndex)}
                        className="h-8 w-8 flex-shrink-0 text-gray-500 hover:text-destructive transition-colors duration-200"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {stages.length === 0 && (
          <div className="text-center p-8 border border-dashed rounded-lg">
            <p className="text-muted-foreground">No stages added yet</p>
            <Button
              type="button"
              variant="outline"
              onClick={addStage}
              className="mt-4 hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Stage
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowStageFields;
