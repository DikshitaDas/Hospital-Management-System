import { Directive, ElementRef, HostListener, input, OnDestroy, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  standalone: true
})
export class TooltipDirective implements OnDestroy {
  readonly appTooltip = input.required<string>();
  readonly tooltipPosition = input<'top' | 'bottom'>('top');

  private tipEl: HTMLElement | null = null;

  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2
  ) {}

  @HostListener('mouseenter')
  onEnter(): void {
    this.show();
  }

  @HostListener('mouseleave')
  onLeave(): void {
    this.hide();
  }

  @HostListener('focusin')
  onFocus(): void {
    this.show();
  }

  @HostListener('focusout')
  onBlur(): void {
    this.hide();
  }

  ngOnDestroy(): void {
    this.hide();
  }

  private show(): void {
    const text = this.appTooltip();
    if (!text || this.tipEl) return;

    this.tipEl = this.renderer.createElement('span');
    this.renderer.addClass(this.tipEl, 'ui-tooltip');
    this.renderer.addClass(this.tipEl, this.tooltipPosition());
    this.renderer.appendChild(this.tipEl, this.renderer.createText(text));
    this.renderer.appendChild(this.el.nativeElement, this.tipEl);
    this.renderer.addClass(this.el.nativeElement, 'has-tooltip');
  }

  private hide(): void {
    if (this.tipEl) {
      this.renderer.removeChild(this.el.nativeElement, this.tipEl);
      this.tipEl = null;
      this.renderer.removeClass(this.el.nativeElement, 'has-tooltip');
    }
  }
}
