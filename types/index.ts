export type JobType = "Full Time" | "Part Time" | "Remote" | "Contract";

export interface Job {
  id: number;
  company: string;
  role: string;
  location: string;
  tags: string[];
  type: JobType;
  logo: string;
  color: string;
  description?: string;
}

export interface Category {
  icon: string;
  name: string;
  jobs: number;
  active?: boolean;
}
