import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskDialogComponent } from '../../Dialogs';

@Component({
  selector: 'navbar',
  // imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  constructor(public dialog: MatDialog) {}

  @Output() refreshRequested = new EventEmitter();

  openDialog(): void {
    const dialogRef = this.dialog.open(AddTaskDialogComponent, {
      width: '350px',
      height: '350px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.refreshRequested.emit();
    });
  }
}
