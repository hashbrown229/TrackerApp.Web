import { GUID } from './Utils';

export class UpdateParentTaskDTO {
  isSubTask?: boolean;
  parentTaskId?: GUID | null;
}
