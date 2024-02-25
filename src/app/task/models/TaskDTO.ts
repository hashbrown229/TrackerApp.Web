import { PRIORITY, STATUS, CATEGORY, GUID } from './Utils';

export class TaskDTO {
  id!: any | GUID;
  name!: string;
  description?: string | undefined;
  status!: STATUS;
  priority!: PRIORITY;
  category!: CATEGORY;
  createdDate!: Date;
  updatedDate!: Date;
  dueDate?: Date | null;
  completionDate?: Date | null;
  is_subtask?: boolean;
  parent_id?: GUID | null;
}
