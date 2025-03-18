import axios from "axios";
import { Workflow, WorkflowFormData } from "@/types/workflow";

const API_URL = "https://zetanetra.z-apps.io/api/v1";

export const api = {
  getWorkflows: async (): Promise<Workflow[]> => {
    const response = await axios.get(`${API_URL}/workflows`);
    return response.data.workflows;
  },

  getWorkflow: async (id: number): Promise<Workflow> => {
    const response = await axios.get(`${API_URL}/workflows/${id}`);
    return response.data;
  },

  createWorkflow: async (workflowData: WorkflowFormData): Promise<Workflow> => {
    try {
      const response = await axios.post(`${API_URL}/workflows`, workflowData);
      return response.data;
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
        workflowData
      );
      return response.data;
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
