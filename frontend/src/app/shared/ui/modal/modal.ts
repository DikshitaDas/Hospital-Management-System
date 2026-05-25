import { Component, input, output } from '@angular/core';
import { LucideX } from '@lucide/angular';

@Component({
  selector: 'app-modal',
  imports: [LucideX],
  templateUrl: './modal.html',
  styleUrl: './modal.scss'
})
export class ModalComponent {
  readonly open = input(false);
  readonly title = input('Modal');
  readonly closed = output<void>();
}
