import { PRIORITY, GUID, CATEGORY, STATUS } from './Utils';

export class UpdateTaskDTO {
  name!: string;
  description?: string | undefined;
  priority!: PRIORITY;
  category!: CATEGORY;
  due_date?: Date | null;
}
