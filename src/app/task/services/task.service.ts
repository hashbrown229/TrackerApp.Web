import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  CreateTaskDTO,
  STATUS,
  SearchResultDTO,
  TaskDTO,
  UpdateTaskDTO,
} from '../models';
import { Observable, firstValueFrom } from 'rxjs';
import { GUID } from '../models/Utils';
import { UpdateTaskStatusDTO } from '../models/UpdateTaskStatusDTO';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private http: HttpClient) {}

  private BaseURL = 'http://localhost:5235/api/Tasks';

  public getAllTasks(): Observable<TaskDTO[]> {
    const Tasks = this.http.get<TaskDTO[]>(this.BaseURL + '?status=All', {
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
    return Tasks;
  }

  public async getPendingTasks(
    pending: STATUS
  ): Promise<Observable<TaskDTO[]>> {
    const Tasks = this.http.get<TaskDTO[]>(
      this.BaseURL + `?status=${pending}`,
      {
        headers: { 'Access-Control-Allow-Origin': '*' },
      }
    );
    console.log(Tasks);
    return Tasks;
  }

  public async getCompletedTasks(
    completed: STATUS
  ): Promise<Observable<TaskDTO[]>> {
    const Tasks = this.http.get<TaskDTO[]>(
      this.BaseURL + `?status=${completed}`,
      {
        headers: { 'Access-Control-Allow-Origin': '*' },
      }
    );

    console.log(Tasks);
    return Tasks;
  }

  public getTaskByID(id: GUID): Observable<TaskDTO> {
    const Task = this.http.get<TaskDTO>(this.BaseURL + `/${id}`, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
    return Task;
  }

  public async createTask(
    payload: CreateTaskDTO
  ): Promise<Observable<TaskDTO>> {
    const Task = this.http.post<TaskDTO>(this.BaseURL, payload);
    Task.subscribe();
    return Task;
  }

  public async updateTask(id: GUID, payload: UpdateTaskDTO): Promise<TaskDTO> {
    const Task = this.http.put<TaskDTO>(this.BaseURL + `/${id}`, payload);
    return await firstValueFrom(Task);
  }

  async updateTaskStatus(id: GUID, payload: UpdateTaskStatusDTO) {
    return await firstValueFrom(
      this.http.put(this.BaseURL + `/${id}`, payload)
    );
  }

  async deleteTask(id: GUID) {
    return await firstValueFrom(this.http.delete(this.BaseURL + `/${id}`));
  }

  async textBasedSearch(queryParams: any): Promise<TaskDTO[]> {
    console.log('Service - Text search - ', queryParams);
    const Tasks = await firstValueFrom(
      this.http.post<Promise<TaskDTO[]>>(this.BaseURL + '/search', queryParams)
    );
    console.log('Returned from result', Tasks);
    return Tasks;
  }
}
