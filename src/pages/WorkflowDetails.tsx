import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Edit,
  LayoutGrid,
  AlertTriangle,
  Check,
  Clock,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import StatusBadge from "@/components/StatusBadge";
import { Workflow, SCHEDULE_TYPE_REVERSE_MAP } from "@/types/workflow";
import { useWorkflows } from "@/hooks/useWorkflows";
import { Badge } from "@/components/ui/badge";
import EditWorkflowModal from "@/components/EditWorkflowModal";

const WorkflowDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getWorkflow, updateWorkflow } = useWorkflows();
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchWorkflowDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const workflowData = await getWorkflow(Number(id));
        setWorkflow(workflowData);
      } catch (err) {
        console.error("Error fetching workflow details:", err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkflowDetails();
  }, [id, getWorkflow]);

  const handleUpdateWorkflow = async (id: number, data: Workflow) => {
    await updateWorkflow(id, data);
    setWorkflow((prev) => (prev ? { ...prev, ...data } : null));
    setIsEditModalOpen(false);
  };

  const getScheduleTypeLabel = (frequency: number) => {
    return SCHEDULE_TYPE_REVERSE_MAP[frequency] || "Unknown";
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 md:p-10">
        <div className="max-w-5xl mx-auto">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="space-y-8">
            <div>
              <Skeleton className="h-10 w-1/3 mb-2" />
              <Skeleton className="h-6 w-1/4" />
            </div>

            <Skeleton className="h-[300px] w-full rounded-xl" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton className="h-[100px] rounded-xl" />
              <Skeleton className="h-[100px] rounded-xl" />
              <Skeleton className="h-[100px] rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !workflow) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              Error Loading Workflow
            </h2>
            <p className="text-muted-foreground mb-6">
              {error?.message || "The workflow could not be found or loaded."}
            </p>
            <Button onClick={() => navigate("/")}>Return to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-10 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Workflows
          </Button>

          <Button
            variant="outline"
            onClick={() => setIsEditModalOpen(true)}
            className="group transition-all duration-300"
          >
            <Edit className="h-4 w-4 mr-2 transition-all duration-300 group-hover:translate-y-[-1px]" />
            Edit Workflow
          </Button>
        </div>

        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{workflow.title}</h1>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="bg-secondary/50">
                  {workflow.target_companies_category}
                </Badge>
                <StatusBadge isActive={workflow.is_scheduled} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="overflow-hidden group hover:shadow-md transition-all duration-300">
              <CardHeader className="bg-secondary/30 pb-3">
                <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2 text-primary" />
                  Schedule Type
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3">
                <div className="text-lg font-semibold">
                  {getScheduleTypeLabel(workflow.schedule_frequency)}
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden group hover:shadow-md transition-all duration-300">
              <CardHeader className="bg-secondary/30 pb-3">
                <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
                  <LayoutGrid className="h-4 w-4 mr-2 text-primary" />
                  Total Stages
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3">
                <div className="text-lg font-semibold">
                  {workflow.data.stages.length} Stages
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden group hover:shadow-md transition-all duration-300">
              <CardHeader className="bg-secondary/30 pb-3">
                <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
                  <Settings className="h-4 w-4 mr-2 text-primary" />
                  Status
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3">
                <div className="text-lg font-semibold flex items-center">
                  {workflow.is_scheduled ? (
                    <>
                      <Check className="h-5 w-5 mr-2 text-green-500" />
                      Active
                    </>
                  ) : (
                    <>
                      <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                      Inactive
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="overflow-hidden">
            <CardHeader className="bg-secondary/30">
              <CardTitle>Workflow Stages</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {workflow.data && Array.isArray(workflow.data.stages) ? (
                workflow.data.stages.map((stage, index) => (
                  <div
                    key={stage.id}
                    className="p-6 group hover:bg-secondary/20 transition-all duration-300"
                  >
                    {index > 0 && <Separator className="mb-6" />}
                    <div className="flex flex-col space-y-4">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-semibold">{stage.name}</h3>
                        <Badge variant="outline" className="bg-secondary/50">
                          Threshold: {stage.threshold}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Questions:
                        </h4>
                        <ul className="space-y-2 ml-6 list-disc">
                          {stage.queries.map((query, qIndex) => (
                            <li key={qIndex} className="text-sm">
                              {query}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 px-6 text-center text-muted-foreground">
                  No stages have been defined for this workflow.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <EditWorkflowModal
        isOpen={isEditModalOpen}
        workflow={workflow}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateWorkflow}
      />
    </div>
  );
};

export default WorkflowDetails;
