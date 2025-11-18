import type { IComment } from "./IComment.interface";

export interface IDefect {
  _id?: string;
  raisedByTeam: string;
  description: string;
  activities: string;
  responsible: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  dueDate?: string;
  status: "Open" | "In Progress" | "Blocked" | "Closed" | "Reopened";
  nextCheck?: string;
  remark?: string;
  comments?: IComment[];
}

