
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ExternalLink, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { WorkflowRun } from '@/types/workflow';
import { format } from 'date-fns';

interface WorkflowRunsTableProps {
  workflowRuns: WorkflowRun[];
  isLoading: boolean;
}

const WorkflowRunsTable: React.FC<WorkflowRunsTableProps> = ({ 
  workflowRuns, 
  isLoading 
}) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return format(new Date(dateString), "MMM dd, yyyy HH:mm");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Completed
          </Badge>
        );
      case "Failed":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Failed
          </Badge>
        );
      case "In Progress":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            In Progress
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">{status}</Badge>
        );
    }
  };

  const getModeBadge = (isSandbox: boolean) => {
    if (isSandbox) {
      return (
        <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-200">
          Sandbox
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-200">
        Production
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <div className="rounded-md border">
          <div className="h-12 border-b px-4 flex items-center bg-muted/50">
            <Skeleton className="h-4 w-full" />
          </div>
          {Array(3).fill(null).map((_, i) => (
            <div key={i} className="p-4 border-b last:border-b-0">
              <div className="grid grid-cols-6 gap-4">
                {Array(6).fill(null).map((_, j) => (
                  <Skeleton key={j} className="h-6" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (workflowRuns.length === 0) {
    return (
      <div className="p-8 text-center border rounded-md">
        <p className="text-muted-foreground">No workflow runs found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Started At</TableHead>
            <TableHead>Completed At</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Mode</TableHead>
            <TableHead className="text-right">Results</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workflowRuns.map((run) => (
            <TableRow key={run.id} className="group">
              <TableCell className="font-medium">{run.id}</TableCell>
              <TableCell>{run.target_companies_category}</TableCell>
              <TableCell>{formatDate(run.started_at)}</TableCell>
              <TableCell>{formatDate(run.completed_at)}</TableCell>
              <TableCell>{getStatusBadge(run.status)}</TableCell>
              <TableCell>{getModeBadge(run.data.is_sandbox)}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  className="group-hover:border-primary group-hover:text-primary transition-colors"
                  onClick={() => navigate(`/workflow-execution/${run.id}`)}
                >
                  <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                  View Results
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default WorkflowRunsTable;
