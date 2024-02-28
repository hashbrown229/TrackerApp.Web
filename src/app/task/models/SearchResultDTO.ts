import { TaskDTO } from './TaskDTO';
export interface SearchResultDTO {
  TaskList: TaskDTO[];
  TaskCount: number;
}
