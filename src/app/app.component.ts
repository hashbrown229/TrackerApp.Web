import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TaskModule } from './task';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TaskModule, MatSlideToggleModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Tracker Application';
}
