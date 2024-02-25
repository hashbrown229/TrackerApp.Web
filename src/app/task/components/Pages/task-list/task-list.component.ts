import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, from, map, switchMap, tap } from 'rxjs';
import { PaginationDTO, STATUS, TaskDTO } from '../../../models';
import { TaskService } from '../../../services';
import { GUID } from '../../../models/Utils';

@Component({
  selector: 'task-list-page',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements AfterViewInit {
  displayedPendingColumns: string[] = [
    'name',
    'priority',
    'category',
    'created',
    'due_date',
    'details',
  ];

  displayedCompletedColumns: string[] = [
    'name',
    'priority',
    'category',
    'created',
    'completed_date',
    'details',
  ];

  dataSource!: MatTableDataSource<TaskDTO[]>;
  refresh$ = new BehaviorSubject(null);
  resultsLength = 0;
  isPendingLoading = true;
  isCompletedLoading = true;
  kpi$: BehaviorSubject<number>[] = [];
  checked: boolean = false;

  paginationParameters$ = new BehaviorSubject<PaginationDTO>(
    new PaginationDTO()
  );
  paginationParameters = new PaginationDTO();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(readonly taskServices: TaskService, public dialog: MatDialog) {}

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
  }

  tasks$ = this.paginationParameters$.pipe(
    switchMap(async (paginationParameters) => {
      this.paginationParameters = paginationParameters;
      console.log('Service - Text search - {0}', paginationParameters);

      const res = await this.taskServices.fullTextSearchPending(
        paginationParameters
      );
      return res;
    }),
    tap((data) => (this.resultsLength = data[1])),
    map((data) => data[0])
  );

  taskPending$ = this.refresh$.pipe(
    switchMap(async () => {
      this.isPendingLoading = true;
      const pendingTask = await this.taskServices.getPendingTasks(
        STATUS.Pending
      );
      // setTimeout(() => {
      //   console.log('interval');
      // }, 500000);
      this.isPendingLoading = false;
      return from(pendingTask);
    })
    // map((tasksObservable: TaskDTO[]) => tasksObservable),
    // tap((x) => {
    //   x.forEach((y) => {
    //     console.log('printing task - ', y);
    //   });
    // })
  );

  taskCompleted$ = this.refresh$.pipe(
    switchMap(() => {
      this.isCompletedLoading = true;
      let completedTask = this.taskServices.getCompletedTasks(STATUS.Completed);
      this.isCompletedLoading = false;
      return completedTask;
    }),
    tap((x) => {
      x.forEach((y) => {
        console.log('printing task - ', y.name);
      });
    })
  );

  async searchClick(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value;
    // this.paginationParameters.search = event.target.value;
    this.paginationParameters.search = searchValue.trim().toLowerCase();
    this.paginationParameters$.next(this.paginationParameters);
    this.paginator.firstPage();
    console.log(this.paginationParameters);
    console.log('search clicked');
  }

  updateTaskDialog(task: TaskDTO): void {
    // const dialogRef = this.dialog.open(UpdateTaskDialogComponent, {
    //   width: '350px',
    //   data: task,
    // });
    // dialogRef.afterClosed().subscribe((result) => {
    //   this.isLoadingResults = true;
    //   this.refresh$.next(null);
    //   this.isLoadingResults = false;
    // });
  }

  async updateTaskStatus(id: GUID, status: STATUS) {
    this.isCompletedLoading = this.isPendingLoading = true;
    await this.taskServices.updateTaskStatus(id, { status });
    this.isCompletedLoading = this.isPendingLoading = false;
    this.refresh$.next(null);
  }

  async deleteTask(id: GUID) {
    await this.taskServices.deleteTask(id);
    this.refresh$.next(null);
  }

  changed() {
    this.checked = !this.checked;
  }
}
