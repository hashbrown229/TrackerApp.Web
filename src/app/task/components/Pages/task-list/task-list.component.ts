import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, Observable, from, map, switchMap, tap } from 'rxjs';
import { PaginationDTO, STATUS, TaskDTO } from '../../../models';
import { TaskService } from '../../../services';
import { CATEGORY, GUID } from '../../../models/Utils';

@Component({
  selector: 'task-list-page',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit, AfterViewInit {
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
  isLoadingResult = true;
  kpi$: BehaviorSubject<number>[] = [];
  checked: boolean = false;

  // taskPending$: Observable<TaskDTO[]>;

  paginationParameters$ = new BehaviorSubject<PaginationDTO>(
    new PaginationDTO()
  );
  paginationParameters = new PaginationDTO();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  CATEGORY!: CATEGORY;

  constructor(readonly taskServices: TaskService, public dialog: MatDialog) {
    // this.taskPending$ = new Observable<TaskDTO[]>();
    // this.taskPending$.subscribe((x) => {
    //   x.pipe(
    //     map((a) => {
    //       return a;
    //     }),
    //     tap((b) => {
    //       b.forEach((y) => {
    //         console.log('printing subscriber - ', y);
    //       });
    //     })
    //   );
    // });
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

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
      this.isLoadingResult = true;
      const pendingTask = await this.taskServices.getPendingTasks(
        STATUS.Pending
      );
      setTimeout(() => {
        this.isLoadingResult = false;
      }, 500);
      return pendingTask;
    }),
    switchMap((tasksObservable: Observable<TaskDTO[]>) => {
      // Inside this switchMap, you'll have the TaskDTO[]
      return tasksObservable;
    }),
    tap((x) => {
      x.forEach((y) => {
        console.log('printing task - ', y.name);
      });
    })
  );

  taskCompleted$ = this.refresh$.pipe(
    switchMap(() => {
      // this.isLoadingResult = true;
      let completedTask = this.taskServices.getCompletedTasks(STATUS.Completed);
      // this.isLoadingResult = false;
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
    this.isLoadingResult = true;
    await this.taskServices.updateTaskStatus(id, { status });
    this.isLoadingResult = false;
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
