import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NavBarComponent} from './routes/shared/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('spark-event-ui2');
}
