import { PRIORITY, STATUS, CATEGORY, GUID } from './Utils';

export class CreateTaskDTO {
  name!: string;
  description?: string | undefined;
  status: STATUS;
  priority: PRIORITY;
  category: CATEGORY;
  dueDate: Date | null;
  isSubTask: boolean;
  parentTaskId: GUID | null;

  constructor() {
    this.status = STATUS.Pending;
    this.priority = PRIORITY.Low;
    this.category = CATEGORY.General;
    this.dueDate = null;
    this.isSubTask = false;
    this.parentTaskId = null;
  }
}
