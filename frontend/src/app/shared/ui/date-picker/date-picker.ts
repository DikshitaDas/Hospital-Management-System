import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { isPastDate, todayIsoDate, toApiDate, toInputDate } from '../../utils/date.util';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './date-picker.html',
  styleUrl: './date-picker.scss'
})
export class DatePickerComponent {
  @Input() label = 'Date';
  @Input() required = false;
  @Input() disallowPast = true;
  @Input() hint = 'Appointments use date only (no time slot).';

  @Input() value = '';
  @Output() valueChange = new EventEmitter<string>();

  protected readonly error = signal('');

  protected get minDate(): string {
    return this.disallowPast ? todayIsoDate() : '';
  }

  protected onChange(raw: string): void {
    const date = toApiDate(raw);
    if (this.disallowPast && isPastDate(date)) {
      this.error.set('Date cannot be in the past.');
      return;
    }
    this.error.set('');
    this.value = date;
    this.valueChange.emit(date);
  }

  protected displayValue(): string {
    return toInputDate(this.value);
  }
}
