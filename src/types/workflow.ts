
export interface WorkflowStage {
  id: number;
  name: string;
  queries: string[];
  threshold: number;
}

export interface WorkflowData {
  stages: WorkflowStage[];
}

export interface Workflow {
  id: number;
  title: string;
  target_companies_category: string;
  is_scheduled: boolean;
  schedule_frequency: number;
  is_sandbox: boolean;
  data: WorkflowData;
}

export interface WorkflowFormData {
  title: string;
  target_companies_category: string;
  is_scheduled: boolean;
  schedule_frequency: number;
  is_sandbox: boolean;
  data: {
    stages: {
      id?: number;
      name: string;
      queries: string[];
      threshold: number;
    }[];
  };
}

// Convert string booleans to actual booleans
export const normalizeWorkflow = (workflow: any): Workflow => {
  return {
    ...workflow,
    is_scheduled: typeof workflow.is_scheduled === 'string' 
      ? workflow.is_scheduled === 'true' 
      : !!workflow.is_scheduled,
    is_sandbox: typeof workflow.is_sandbox === 'string' 
      ? workflow.is_sandbox === 'true' 
      : !!workflow.is_sandbox,
  };
};

export const prepareWorkflowForSubmission = (workflow: Partial<WorkflowFormData>): Partial<WorkflowFormData> => {
  return {
    ...workflow,
    is_scheduled: !!workflow.is_scheduled,
    is_sandbox: !!workflow.is_sandbox,
  };
};

export type ScheduleType = "Hourly" | "Daily" | "Weekly" | "Monthly";

export const SCHEDULE_TYPE_MAP: Record<ScheduleType, number> = {
  Hourly: 3600,
  Daily: 86400,
  Weekly: 604800,
  Monthly: 2592000,
};

export const SCHEDULE_TYPE_REVERSE_MAP: Record<number, ScheduleType> = {
  3600: "Hourly",
  86400: "Daily",
  604800: "Weekly",
  2592000: "Monthly",
};

export const CATEGORY_OPTIONS = [
  "Fortune 500",
  "SaaS Startups",
  "Enterprise",
  "SMB",
  "Healthcare",
  "Financial Services",
  "Technology",
  "Manufacturing",
  "Retail",
];

export const SCHEDULE_TYPE_OPTIONS: ScheduleType[] = [
  "Hourly",
  "Daily",
  "Weekly",
  "Monthly",
];
