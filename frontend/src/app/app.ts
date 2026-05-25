import { Component, signal } from '@angular/core';
import { DashboardShowcaseComponent } from './pages/dashboard-showcase/dashboard-showcase';

@Component({
  selector: 'app-root',
  imports: [DashboardShowcaseComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('MediCare Hub');
}
