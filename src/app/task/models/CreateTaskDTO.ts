import { PRIORITY, STATUS, CATEGORY, GUID } from './Utils';

export class CreateTaskDTO {
  name!: string;
  description?: string | undefined;
  status: STATUS;
  priority: PRIORITY;
  category: CATEGORY;
  due_date: Date | null;
  is_subtask: boolean;
  parent_id: GUID | null;

  constructor() {
    this.status = STATUS.Pending;
    this.priority = PRIORITY.Low;
    this.category = CATEGORY.General;
    this.due_date = null;
    this.is_subtask = false;
    this.parent_id = null;
  }
}
