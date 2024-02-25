import { PRIORITY, STATUS, CATEGORY, GUID } from './Utils';

export class TaskDTO {
  id!: any | GUID;
  name!: string;
  description?: string | undefined;
  status!: STATUS;
  priority!: PRIORITY;
  category!: CATEGORY;
  created_date!: Date;
  updated_date!: Date;
  due_date?: Date | null;
  completion_date?: Date | null;
  is_subtask?: boolean;
  parent_id?: GUID | null;
}
