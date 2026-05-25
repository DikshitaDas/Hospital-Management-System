import { Component, input } from '@angular/core';

@Component({
  selector: 'app-metric-card',
  templateUrl: './metric-card.html',
  styleUrl: './metric-card.scss'
})
export class MetricCardComponent {
  readonly title = input.required<string>();
  readonly value = input.required<string>();
  readonly detail = input<string>('');
  readonly tone = input<'mint' | 'sky' | 'rose' | 'warning'>('mint');
}
