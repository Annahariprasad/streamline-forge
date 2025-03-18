import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, Trash, Eye, MoreHorizontal } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { Workflow, SCHEDULE_TYPE_REVERSE_MAP } from "@/types/workflow";
import DeleteConfirmDialog from "./DeleteConfirmDialog";

interface WorkflowTableProps {
  workflows: Workflow[];
  onEdit: (workflow: Workflow) => void;
  onDelete: (id: number) => Promise<void>;
  isLoading: boolean;
}

const WorkflowTable: React.FC<WorkflowTableProps> = ({
  workflows,
  onEdit,
  onDelete,
  isLoading,
}) => {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [workflowToDelete, setWorkflowToDelete] = useState<Workflow | null>(
    null
  );

  const handleViewDetails = (id: number) => {
    navigate(`/workflow/${id}`);
  };

  const handleOpenDeleteDialog = (workflow: Workflow) => {
    setWorkflowToDelete(workflow);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (workflowToDelete) {
      await onDelete(workflowToDelete.id);
      setDeleteDialogOpen(false);
      setWorkflowToDelete(null);
    }
  };

  const getScheduleTypeLabel = (frequency: number) => {
    return SCHEDULE_TYPE_REVERSE_MAP[frequency] || "Unknown";
  };

  const getStageSummary = (stages: Workflow["data"]["stages"]) => {
    if (!stages || stages.length === 0) return "No stages";

    if (stages.length <= 2) {
      return stages.map((stage) => stage.name).join(", ");
    } else {
      return `${stages.length} stages (${stages[0].name}, ${stages[1].name}, ...)`;
    }
  };

  return (
    <>
      <Table className="border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
        <TableHeader className="bg-secondary/50">
          <TableRow>
            <TableHead className="w-[250px] font-medium">
              Workflow Name
            </TableHead>
            <TableHead className="font-medium">Category</TableHead>
            <TableHead className="font-medium">Schedule Type</TableHead>
            <TableHead className="font-medium">Status</TableHead>
            <TableHead className="font-medium">Mode</TableHead>
            <TableHead className="font-medium">Stages</TableHead>
            <TableHead className="text-right font-medium">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </TableCell>
            </TableRow>
          ) : workflows && workflows.length > 0 ? (
            workflows.map((workflow: Workflow) => (
              <TableRow
                key={workflow.id}
                className="group transition-colors hover:bg-secondary/30 animate-fade-in"
              >
                <TableCell className="font-medium">{workflow.title}</TableCell>
                <TableCell>{workflow.target_companies_category}</TableCell>
                <TableCell>
                  {getScheduleTypeLabel(workflow.schedule_frequency)}
                </TableCell>
                <TableCell>
                  <StatusBadge isActive={workflow.is_scheduled} />
                </TableCell>
                <TableCell>
                  {workflow.is_sandbox ? "Sandbox" : "Normal"}
                </TableCell>
                <TableCell>
                  <span className="text-muted-foreground text-sm">
                    {getStageSummary(workflow.data.stages)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewDetails(workflow.id)}
                      className="h-8 w-8 text-gray-500 hover:text-primary"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(workflow)}
                      className="h-8 w-8 text-gray-500 hover:text-primary"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDeleteDialog(workflow)}
                      className="h-8 w-8 text-gray-500 hover:text-destructive"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild className="md:hidden">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleViewDetails(workflow.id)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(workflow)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleOpenDeleteDialog(workflow)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-8 text-muted-foreground"
              >
                No workflows found. Create your first workflow to get started.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        workflowName={workflowToDelete?.title || ""}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default WorkflowTable;
