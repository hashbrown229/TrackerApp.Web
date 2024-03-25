import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .append('Access-Control-Allow-Origin', '*');

  public getAllTasks(): Observable<TaskDTO[]> {
    const Tasks = this.http.get<TaskDTO[]>(this.BaseURL + '?status=All', {
      headers: this.headers,
    });
    return Tasks;
  }

  public async getPendingTasks(
    pending: STATUS
  ): Promise<Observable<TaskDTO[]>> {
    const Tasks = this.http.get<TaskDTO[]>(
      this.BaseURL + `?status=${pending}`,
      {
        headers: this.headers,
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
        headers: this.headers,
      }
    );
    return Tasks;
  }

  public getTaskByID(id: GUID): Observable<TaskDTO> {
    const Task = this.http.get<TaskDTO>(this.BaseURL + `/${id}`, {
      headers: this.headers,
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
    const Task = firstValueFrom(
      this.http.put<TaskDTO>(this.BaseURL + `/${id}`, payload)
    );
    return await Task;
  }

  async updateTaskStatus(id: GUID, payload: UpdateTaskStatusDTO) {
    try {
      const result = await firstValueFrom(
        this.http.patch(this.BaseURL + `/Status/${id}`, payload, {
          headers: this.headers,
        })
      );
      console.log(
        `Status chnage to be - ${payload.status} for ${id} - updated ${result}`
      );
      return result;
    } catch (error) {
      console.error('error - ', JSON.stringify(error));
      return false;
    }
  }

  // async deleteTask(id: GUID) {
  //   return await firstValueFrom(this.http.delete(this.BaseURL + `/${id}`));
  // }

  async PaginationSearch(queryParams: any): Promise<TaskDTO[]> {
    console.log('Service - search query - ', queryParams);
    const Tasks = await firstValueFrom(
      this.http.post<Promise<TaskDTO[]>>(this.BaseURL, queryParams, {
        headers: this.headers,
      })
    );
    // console.log('Returned from result', Tasks);
    return Tasks;
  }
}
