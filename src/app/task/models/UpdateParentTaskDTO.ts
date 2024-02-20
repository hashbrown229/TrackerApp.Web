import { GUID } from './Utils';

export class UpdateParentTaskDTO {
  is_subtask?: boolean;
  parent_id?: GUID | null;
}
