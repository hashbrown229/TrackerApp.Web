import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  CreateTaskDTO,
  PaginationDTO,
  STATUS,
  TaskDTO,
  UpdateTaskDTO,
} from '../models';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private http: HttpClient) {}

  private BaseURL = 'http://localhost:7149/api/Task';

  public getAllTasks(): Observable<TaskDTO[]> {
    const Tasks = this.http.get<TaskDTO[]>(this.BaseURL + '/GetAll', {
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
    return Tasks;
  }

  public getPendingTasks(pending: STATUS): Observable<TaskDTO[]> {
    const Tasks = this.http.get<TaskDTO[]>(
      this.BaseURL + `/getPending/${pending}`,
      {
        headers: { 'Access-Control-Allow-Origin': '*' },
      }
    );
    return Tasks;
  }

  public getCompletedTasks(completed: STATUS): Observable<TaskDTO[]> {
    const Tasks = this.http.get<TaskDTO[]>(
      this.BaseURL + `/getCompleted/${completed}`,
      {
        headers: { 'Access-Control-Allow-Origin': '*' },
      }
    );

    return Tasks;
  }

  public getTaskByID(id: number): Observable<TaskDTO> {
    const Task = this.http.get<TaskDTO>(this.BaseURL + `/GetOne/${id}`, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
    return Task;
  }

  public async createTask(
    payload: CreateTaskDTO
  ): Promise<Observable<TaskDTO>> {
    const Task = this.http.post<TaskDTO>(this.BaseURL + `/Create`, payload);
    Task.subscribe();
    return Task;
  }

  async updateTask(id: number, payload: UpdateTaskDTO): Promise<void> {
    // if (payload.status != "Completed") {
    //   payload.updated_date = new Date(0);
    // }
    const Task = this.http.put<TaskDTO>(
      this.BaseURL + `/updateTask/${id}`,
      payload
    );
    await firstValueFrom(Task);
  }

  async markAsDone(id: number, payload: STATUS) {
    return await firstValueFrom(
      this.http.put(this.BaseURL + `/markAsDone/${id}`, payload)
    );
  }

  async deleteTask(id: number) {
    return await firstValueFrom(
      this.http.delete(this.BaseURL + `/removeTask/${id}`)
    );
  }

  async fullTextSearchPending(
    queryParams: PaginationDTO
  ): Promise<[TaskDTO[], number]> {
    const Tasks = await firstValueFrom(
      this.http.post<[TaskDTO[], number]>(
        this.BaseURL + `/searchPending`,
        queryParams
      )
    );
    return Tasks;
  }

  public getPendingTasks1(pending: STATUS): Observable<TaskDTO[]> {
    const Tasks = this.http.get<TaskDTO[]>(
      this.BaseURL + `/getPending/${pending}`,
      {
        headers: { 'Access-Control-Allow-Origin': '*' },
      }
    );
    // }).pipe(map((res: any) => <TaskDTO[]><unknown>res.Json()));
    // console.log("Printing TaskDTO from get Pending service");
    // console.log(Tasks);
    return Tasks;
  }
}
