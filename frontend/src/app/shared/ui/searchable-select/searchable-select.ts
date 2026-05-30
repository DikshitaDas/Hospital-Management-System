import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-searchable-select',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './searchable-select.html',
  styleUrl: './searchable-select.scss'
})
export class SearchableSelectComponent<T extends { id: number }> {
  @Input({ required: true }) label = 'Select';
  @Input({ required: true }) placeholder = 'Type to search…';
  @Input({ required: true }) displayWith!: (item: T) => string;
  @Input({ required: true }) valueKey!: keyof T;
  @Input() required = false;
  @Input() minSearchLength = 2;
  /** Local list — filtered client-side when set */
  @Input() staticItems: T[] = [];
  /** Remote search — used when staticItems is empty */
  @Input() searchFn?: (term: string) => Observable<T[]>;

  @Input() selectedId: number | null = null;
  @Output() selectedIdChange = new EventEmitter<number | null>();
  @Output() selectedItemChange = new EventEmitter<T | null>();

  protected readonly query = signal('');
  protected readonly open = signal(false);
  protected readonly results = signal<T[]>([]);
  protected readonly selectedLabel = signal('');

  private readonly search$ = new Subject<string>();

  constructor() {
    this.search$
      .pipe(
        debounceTime(280),
        distinctUntilChanged(),
        switchMap(term => {
          if (term.length < this.minSearchLength) {
            return of([] as T[]);
          }
          if (this.staticItems.length) {
            const lower = term.toLowerCase();
            return of(
              this.staticItems.filter(item =>
                this.displayWith(item).toLowerCase().includes(lower)
              )
            );
          }
          return this.searchFn ? this.searchFn(term) : of([] as T[]);
        })
      )
      .subscribe(list => this.results.set(list));
  }

  protected onQueryInput(value: string): void {
    this.query.set(value);
    this.open.set(true);
    if (!value.trim()) {
      this.clearSelection();
      return;
    }
    this.search$.next(value.trim());
  }

  protected pick(item: T): void {
    const id = Number(item[this.valueKey]);
    this.selectedId = id;
    const label = this.displayWith(item);
    this.selectedLabel.set(label);
    this.query.set(label);
    this.open.set(false);
    this.selectedIdChange.emit(id);
    this.selectedItemChange.emit(item);
  }

  protected clearSelection(): void {
    this.selectedId = null;
    this.selectedLabel.set('');
    this.selectedIdChange.emit(null);
    this.selectedItemChange.emit(null);
    this.results.set([]);
  }

  protected onBlur(): void {
    window.setTimeout(() => this.open.set(false), 180);
  }

  protected onFocus(): void {
    if (this.query().trim().length >= this.minSearchLength) {
      this.open.set(true);
      this.search$.next(this.query().trim());
    }
  }
}
