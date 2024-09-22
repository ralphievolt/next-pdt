import { ObjectId } from "mongodb";

export interface Jobs {
  _id: string;
  job_number: number;
  shelves: number;
  status: string;
  so_date: string;
  completion_date: string;
  state: string;
}

export interface JobsList {
  _id: string;
  job_number: number;
  brand: string;
  state: string;
  so_date: string;
  delivered_date: string;
  last_update: string;
  updated_by: string;
  rate: number;
}
export type JobsListProps = {
  jobslist: JobsList[];
};

export type JobsProps = {
  jobslist: Jobs[];
};

export interface Findings {
  shelf: string;
  part: string;
  round: number;
  status: string;
  issue: string;
  detail: string;
  action: string;
  responsible: string;
  entry_date: string;
  date_started: string;
  issue_status: string;
}

export type FindingsProps = {
  results: Findings[];
};

export interface Issues {
  job_number: number;
  brand: string;
  status: string;
  created_by: string;
  created_date: number;
  issues_count: number;
  closed_date: string;
  closed_by: string;
}

export type IssuesProps = {
  results: Issues[];
};
