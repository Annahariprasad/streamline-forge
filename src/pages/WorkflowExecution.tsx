
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { WorkflowRun } from '@/types/workflow';
import axios from 'axios';

const WorkflowExecution: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workflowRun, setWorkflowRun] = useState<WorkflowRun | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchWorkflowRunDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        // Fetch the specific workflow run
        const response = await axios.get(`http://127.0.0.1:8000/api/v1/workflow_runs/${id}`);
        setWorkflowRun(response.data);
      } catch (err) {
        console.error("Error fetching workflow run details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkflowRunDetails();
  }, [id]);
  
  const calculateProgress = () => {
    if (!workflowRun) return 0;
    
    const { total_companies, processed_companies } = workflowRun.data;
    if (total_companies === 0) return 0;
    
    return Math.round((processed_companies / total_companies) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 md:p-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center mb-6">
            <Skeleton className="h-10 w-24" />
          </div>
          <Skeleton className="h-10 w-2/3 mb-4" />
          <Skeleton className="h-6 w-1/3 mb-8" />
          <Skeleton className="h-8 w-full mb-4" />
          <Skeleton className="h-[200px] w-full mb-6 rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-[300px] rounded-lg" />
            <Skeleton className="h-[300px] rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!workflowRun) {
    return (
      <div className="min-h-screen p-6 md:p-10">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Workflow Run Not Found</h2>
          <p className="mb-6">The workflow run you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/')}>Return to Dashboard</Button>
        </div>
      </div>
    );
  }

  const progress = calculateProgress();
  
  return (
    <div className="min-h-screen p-6 md:p-10 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Workflow Run #{workflowRun.id} - {workflowRun.status}
            </h1>
            <p className="text-muted-foreground">
              {workflowRun.target_companies_category} • 
              {workflowRun.data.is_sandbox ? ' Sandbox Mode' : ' Production Mode'}
            </p>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>
                    Processed {workflowRun.data.processed_companies} of {workflowRun.data.total_companies} companies
                  </span>
                  <span className="font-semibold">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="overflow-hidden">
              <CardHeader className="bg-green-50 dark:bg-green-900/20">
                <CardTitle className="flex items-center text-lg">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
                  Successful Companies
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[300px]">
                  {workflowRun.data.successful_companies.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      No successful companies
                    </div>
                  ) : (
                    <ul className="divide-y">
                      {workflowRun.data.successful_companies.map((company) => (
                        <li key={company.id} className="p-4 hover:bg-muted/50 transition-colors">
                          <div className="font-medium">{company.name}</div>
                          <div className="text-sm text-muted-foreground">ID: {company.id}</div>
                        </li>
                      ))}
                    </ul>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="bg-red-50 dark:bg-red-900/20">
                <CardTitle className="flex items-center text-lg">
                  <XCircle className="h-5 w-5 mr-2 text-red-600 dark:text-red-400" />
                  Unsuccessful Companies
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[300px]">
                  {workflowRun.data.unsuccessful_companies.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      No unsuccessful companies
                    </div>
                  ) : (
                    <ul className="divide-y">
                      {workflowRun.data.unsuccessful_companies.map((company) => (
                        <li key={company.id} className="p-4 hover:bg-muted/50 transition-colors">
                          <div className="font-medium">{company.name}</div>
                          <div className="text-sm text-muted-foreground">ID: {company.id}</div>
                        </li>
                      ))}
                    </ul>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowExecution;
