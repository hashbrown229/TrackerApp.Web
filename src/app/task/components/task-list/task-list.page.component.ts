import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, map, switchMap, tap } from 'rxjs';
import { PaginationDTO, STATUS, TaskDTO } from '../../models';
import { TaskService } from '../../services';

@Component({
  selector: 'app-task-list',
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
    'due_date',
    'details',
  ];

  dataSource!: MatTableDataSource<TaskDTO[]>;
  refresh$ = new BehaviorSubject(null);
  resultsLength = 0;
  isLoadingResults = true;
  kpi$: BehaviorSubject<number>[] = [];

  paginationParameters$ = new BehaviorSubject<PaginationDTO>(
    new PaginationDTO()
  );
  paginationParameters = new PaginationDTO();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(readonly taskServices: TaskService, public dialog: MatDialog) {}

  ngAfterViewInit() {
    //  this.dataSource.paginator = this.paginator;
  }

  todos$ = this.paginationParameters$.pipe(
    switchMap(async (paginationParameteres) => {
      this.paginationParameters = paginationParameteres;
      const res = await this.taskServices.fullTextSearchPending(
        paginationParameteres
      );
      return res;
    }),
    tap((data) => (this.resultsLength = data[1])),
    map((data) => data[0])
  );

  todoPending$ = this.refresh$.pipe(
    switchMap(() => {
      this.isLoadingResults = true;
      let pendingTask = this.taskServices.getPendingTasks(STATUS.PENDING);
      this.isLoadingResults = true;
      return pendingTask;
    })
  );

  todoCompleted$ = this.refresh$.pipe(
    switchMap(() => {
      this.isLoadingResults = true;
      let completedTask = this.taskServices.getCompletedTasks(STATUS.COMPLETED);
      this.isLoadingResults = false;
      return completedTask;
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

  updateTaskDialog(todo: TaskDTO): void {
    // const dialogRef = this.dialog.open(UpdateTaskDialogComponent, {
    //   width: '350px',
    //   data: todo,
    // });
    // dialogRef.afterClosed().subscribe((result) => {
    //   this.isLoadingResults = true;
    //   this.refresh$.next(null);
    //   this.isLoadingResults = false;
    // });
  }

  async markAsDone(id: number) {
    this.isLoadingResults = true;
    await this.taskServices.markAsDone(id, STATUS.COMPLETED);
    this.refresh$.next(null);
    this.isLoadingResults = false;
  }

  async deleteTask(id: number) {
    await this.taskServices.deleteTask(id);
    this.refresh$.next(null);
  }
}
