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
