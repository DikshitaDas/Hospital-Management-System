import { Component, input, output } from '@angular/core';
import { LucideX } from '@lucide/angular';

@Component({
  selector: 'app-snackbar',
  imports: [LucideX],
  templateUrl: './snackbar.html',
  styleUrl: './snackbar.scss'
})
export class SnackbarComponent {
  readonly open = input(false);
  readonly message = input('Saved');
  readonly closed = output<void>();
}
