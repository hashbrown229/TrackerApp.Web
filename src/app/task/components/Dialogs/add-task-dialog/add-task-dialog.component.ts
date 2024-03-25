import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  CATEGORY,
  CreateTaskDTO,
  PRIORITY,
  STATUS,
  TaskDTO,
} from '../../../models';
import { ObservedValueTupleFromArray } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TaskService } from '../../../services';

@Component({
  selector: 'add-task-dialog',
  templateUrl: './add-task-dialog.component.html',
  styleUrl: './add-task-dialog.component.scss',
})
export class AddTaskDialogComponent {
  addForm: FormGroup;
  isLoadingResult: boolean = false;
  dialog_title = 'Add Task';

  // taskStatus = STATUS.Completed;
  priorities = Object.values(PRIORITY).filter(
    (value) => typeof value === 'string'
  );
  categories = Object.values(CATEGORY).filter(
    (value) => typeof value === 'string'
  );
  // defaultCategory = Object.keys(CATEGORY).map(
  //   (key) => key == CATEGORY.General.toString()
  // );
  indexOfCategory = this.categories.indexOf('General');
  isCompleted = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: TaskDTO,
    private taskServices: TaskService,
    fb: FormBuilder,
    private ref: MatDialogRef<AddTaskDialogComponent>
  ) {
    this.addForm = fb.group({
      name: [null, Validators.required],
      description: [null],
      dueDate: [null, Validators.required],
      priority: [this.priorities[0], Validators.required],
      category: [this.categories[this.indexOfCategory], Validators.required],
      status: [false, Validators.required],
    });
  }

  async createNewTodo() {
    try {
      this.isLoadingResult = true;
      console.log(this.addForm.value);
      const createTodo = new CreateTaskDTO();
      createTodo.name = this.addForm.value.name;
      createTodo.description = this.addForm.value.description;
      createTodo.dueDate = this.addForm.value.dueDate;
      createTodo.priority = this.addForm.value.priority;
      createTodo.status = this.addForm.value.status;
      createTodo.isSubTask = false;
      createTodo.parentTaskId = null;

      await this.taskServices.createTask(createTodo);
      setTimeout(() => {
        this.isLoadingResult = false;
        this.ref.close();
      }, 500);
    } catch (error) {
      this.ref.close();
      throw new Error(`Sorry! An error occurred: ${error}`);
    }
  }
}
