import { Component, computed, input, signal } from '@angular/core';
import { LucideChevronLeft, LucideChevronRight } from '@lucide/angular';

export interface CarouselSlide {
  image: string;
  eyebrow: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-carousel',
  imports: [LucideChevronLeft, LucideChevronRight],
  templateUrl: './carousel.html',
  styleUrl: './carousel.scss'
})
export class CarouselComponent {
  readonly slides = input.required<CarouselSlide[]>();
  protected readonly index = signal(0);
  protected readonly active = computed(() => this.slides()[this.index()] ?? this.slides()[0]);

  next(): void {
    this.index.update((value) => (value + 1) % this.slides().length);
  }

  previous(): void {
    this.index.update((value) => (value - 1 + this.slides().length) % this.slides().length);
  }

  setSlide(index: number): void {
    this.index.set(index);
  }
}
