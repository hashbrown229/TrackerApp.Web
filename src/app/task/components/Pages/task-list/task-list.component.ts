import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, combineLatest, map, switchMap, tap } from 'rxjs';
import {
  PendingPaginationDTO,
  CompletedPaginationDTO,
  STATUS,
  TaskDTO,
} from '../../../models';
import { TaskService } from '../../../services';
import { GUID } from '../../../models/Utils';

@Component({
  selector: 'task-list-page',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent {
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
  pendingResultsLength = 0;
  completedResultsLength = 0;
  isLoadingResult = true;
  checked: boolean = false;

  pendingPgnParameters$ = new BehaviorSubject<PendingPaginationDTO>(
    new PendingPaginationDTO()
  );
  pendingPgnParameters = new PendingPaginationDTO();

  completedPgnParameters$ = new BehaviorSubject<CompletedPaginationDTO>(
    new CompletedPaginationDTO()
  );
  completedPgnParameters = new CompletedPaginationDTO();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    readonly taskServices: TaskService,
    public dialog: MatDialog // private cdr: ChangeDetectorRef
  ) {}

  // TODO: use combine latest in future
  // tasks$ = this.paginationParameters$.pipe(
  //   switchMap(async (paginationParameters) => {
  //     this.paginationParameters = paginationParameters;
  //     console.log('Service - Text search - {0}', paginationParameters);

  //     const res = await this.taskServices.PaginationSearch(
  //       paginationParameters
  //     );
  //     return res;
  //   }),
  //   tap((data) => (this.resultsLength = data[1])),
  //   map((data) => data[0])
  // );

  // taskPending$: Observable<TaskDTO[]> = new Observable();
  // taskCompleted$: Observable<TaskDTO[]> = new Observable();

  // taskPending$ = combineLatest([
  //   this.refresh$,
  //   this.paginationParameters$,
  // ]).pipe(
  //   switchMap(async ([refresh, pgnParameters]) => {
  //     this.isLoadingResult = true;
  //     this.paginationParameters = pgnParameters;
  //     // const pendingTask = await this.taskServices.getPendingTasks(
  //     //   STATUS.Pending
  //     // );
  //     console.log('Pending List - ', pgnParameters.search);

  //     const pendingTask = await this.taskServices.PaginationSearch(
  //       pgnParameters
  //     );
  //     setTimeout(() => {
  //       this.isLoadingResult = false;
  //     }, 500);
  //     return pendingTask;
  //   }),
  //   // tap((data) => (this.pendingResultsLength = data[1])),
  //   switchMap((data) => {
  //     console.log('Pending List - ', data);
  //     return data;
  //   }),
  //   // tap((searchRes) => {
  //   //   // Inside this switchMap, you'll have the TaskDTO[]
  //   //   this.taskPending$ = searchRes.PendingResults;
  //   //   this.pendingResultsLength = searchRes.PendingRecords;
  //   //   this.taskCompleted$ = searchRes.CompletedResults;
  //   //   this.completedResultsLength = searchRes.CompletedRecords;

  //   //   // return searchRes.PendingResults;
  //   // }),
  //   map((searchRes) => {
  //     this.taskPending$ = of(searchRes.PendingResults);
  //     this.pendingResultsLength = searchRes.PendingRecords;
  //     this.taskCompleted$ = of(searchRes.CompletedResults);
  //     this.completedResultsLength = searchRes.CompletedRecords;
  //     return searchRes.PendingResults;
  //   })
  //   // tap((x) => {
  //   //   x.forEach((y) => {
  //   //     console.log('printing task - ', y.name);
  //   //   });
  //   // })
  // );

  // taskCompleted$ = combineLatest([
  //   this.refresh$,
  //   this.paginationParameters$,
  // ]).pipe(
  //   switchMap(async () => {
  //     // this.isLoadingResult = true;
  //     let completedTask = await this.taskServices.getCompletedTasks(
  //       STATUS.Completed
  //     );
  //     // this.isLoadingResult = false;
  //     return completedTask;
  //   }),
  //   tap((x) => {
  //     x.forEach((y) => {
  //       console.log('printing task - ', y);
  //     });
  //   })
  // );

  taskPending$ = combineLatest([
    this.refresh$,
    this.pendingPgnParameters$,
  ]).pipe(
    switchMap(async ([refresh, pgnParameters]) => {
      this.isLoadingResult = true;
      this.pendingPgnParameters = pgnParameters;
      let searchResult = await this.taskServices.PaginationSearch(
        pgnParameters
      );
      setTimeout(() => {
        this.isLoadingResult = false;
      }, 500);
      return searchResult;
    }),
    tap((searchResult) => {
      this.pendingResultsLength = searchResult.length;
    })
  );

  taskCompleted$ = combineLatest([
    this.refresh$,
    this.completedPgnParameters$,
  ]).pipe(
    switchMap(async ([refresh, pgnParameters]) => {
      this.completedPgnParameters = pgnParameters;
      let searchResult = await this.taskServices.PaginationSearch(
        pgnParameters
      );
      return searchResult;
    }),
    tap((searchResult) => {
      this.completedResultsLength = searchResult.length;
    })
  );

  async searchClick(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value;
    this.pendingPgnParameters.search = this.completedPgnParameters.search =
      searchValue.trim().toLowerCase();
    this.pendingPgnParameters$.next(this.pendingPgnParameters);
    if (this.checked)
      this.completedPgnParameters$.next(this.completedPgnParameters);
    this.paginator.firstPage();
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

  updateTaskStatus(id: GUID, status: STATUS) {
    this.isLoadingResult = true;
    this.taskServices.updateTaskStatus(id, { status });
    setTimeout(() => {
      this.refresh$.next(null);
      this.isLoadingResult = false;
    }, 500);
  }

  async deleteTask(id: GUID) {
    // await this.taskServices.deleteTask(id);
    // this.refresh$.next(null);
  }

  changed() {
    this.checked = !this.checked;
    // this.cdr.detectChanges();
  }
}
