
import axios from "axios";
import { Workflow, WorkflowFormData, normalizeWorkflow, prepareWorkflowForSubmission } from "@/types/workflow";

const API_URL = "http://127.0.0.1:8000/api/v1";

export const api = {
  getWorkflows: async (): Promise<Workflow[]> => {
    const response = await axios.get(`${API_URL}/workflows`);
    return response.data.workflows.map(normalizeWorkflow);
  },

  getWorkflow: async (id: number): Promise<Workflow> => {
    const response = await axios.get(`${API_URL}/workflows/${id}`);
    return normalizeWorkflow(response.data);
  },

  createWorkflow: async (workflowData: WorkflowFormData): Promise<Workflow> => {
    try {
      const response = await axios.post(
        `${API_URL}/workflows`, 
        prepareWorkflowForSubmission(workflowData)
      );
      return normalizeWorkflow(response.data);
    } catch (error) {
      console.error("Error creating workflow:", error);
      throw error;
    }
  },

  updateWorkflow: async (
    id: number,
    workflowData: Partial<WorkflowFormData>
  ): Promise<Workflow> => {
    try {
      const response = await axios.patch(
        `${API_URL}/workflows/${id}`,
        prepareWorkflowForSubmission(workflowData)
      );
      return normalizeWorkflow(response.data);
    } catch (error) {
      console.error(`Error updating workflow with id ${id}:`, error);
      throw error;
    }
  },

  deleteWorkflow: async (id: number): Promise<void> => {
    try {
      const response = await axios.delete(`${API_URL}/workflows/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting workflow with id ${id}:`, error);
      throw error;
    }
  },
};
