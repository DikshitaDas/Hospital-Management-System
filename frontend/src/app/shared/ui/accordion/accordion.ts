import { Component, input, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-accordion',
  standalone: true,
  templateUrl: './accordion.html',
  styleUrl: './accordion.scss'
})
export class AccordionComponent implements OnInit {
  readonly title = input.required<string>();
  readonly subtitle = input('');
  readonly open = input(false);

  protected readonly isOpen = signal(false);

  ngOnInit(): void {
    this.isOpen.set(this.open());
  }

  protected toggle(): void {
    this.isOpen.update(v => !v);
  }
}
