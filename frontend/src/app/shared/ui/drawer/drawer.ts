import { Component, input, output } from '@angular/core';
import { LucideX } from '@lucide/angular';

@Component({
  selector: 'app-drawer',
  imports: [LucideX],
  templateUrl: './drawer.html',
  styleUrl: './drawer.scss'
})
export class DrawerComponent {
  readonly open = input(false);
  readonly title = input('Drawer');
  readonly closed = output<void>();
}
