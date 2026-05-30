import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'] as const;

@Component({
  selector: 'app-shift-schedule',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './shift-schedule.html',
  styleUrl: './shift-schedule.scss'
})
export class ShiftScheduleComponent implements OnChanges {
  @Input() value = '';
  @Output() valueChange = new EventEmitter<string>();

  protected readonly days = DAYS;
  protected selectedDays = new Set<string>(['MON', 'TUE', 'WED', 'THU', 'FRI']);
  protected fromTime = '09:00';
  protected toTime = '17:00';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] && this.value) {
      this.parse(this.value);
    }
  }

  protected toggleDay(day: string): void {
    if (this.selectedDays.has(day)) {
      this.selectedDays.delete(day);
    } else {
      this.selectedDays.add(day);
    }
    this.emit();
  }

  protected isSelected(day: string): boolean {
    return this.selectedDays.has(day);
  }

  protected onTimeChange(): void {
    this.emit();
  }

  private emit(): void {
    const ordered = DAYS.filter(d => this.selectedDays.has(d));
    if (!ordered.length) {
      this.valueChange.emit('');
      return;
    }
    const range = `${this.fromTime}-${this.toTime}`;
    const dayPart =
      ordered.length === 5 &&
      ordered[0] === 'MON' &&
      ordered[4] === 'FRI' &&
      !this.selectedDays.has('SAT') &&
      !this.selectedDays.has('SUN')
        ? 'MON-FRI'
        : ordered.join(', ');
    const next = `${dayPart} ${range}`;
    this.value = next;
    this.valueChange.emit(next);
  }

  private parse(raw: string): void {
    const trimmed = raw.trim();
    const timeMatch = trimmed.match(/(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/);
    if (timeMatch) {
      this.fromTime = this.padTime(timeMatch[1]!);
      this.toTime = this.padTime(timeMatch[2]!);
    }
    const beforeTime = timeMatch ? trimmed.slice(0, timeMatch.index).trim() : trimmed;
    this.selectedDays.clear();
    if (/MON-FRI/i.test(beforeTime)) {
      ['MON', 'TUE', 'WED', 'THU', 'FRI'].forEach(d => this.selectedDays.add(d));
      return;
    }
    const parts = beforeTime.split(/[,\s]+/).filter(Boolean);
    for (const p of parts) {
      const up = p.toUpperCase().slice(0, 3);
      if (DAYS.includes(up as (typeof DAYS)[number])) {
        this.selectedDays.add(up);
      }
    }
    if (!this.selectedDays.size) {
      ['MON', 'TUE', 'WED', 'THU', 'FRI'].forEach(d => this.selectedDays.add(d));
    }
  }

  private padTime(t: string): string {
    const [h, m] = t.split(':');
    return `${h!.padStart(2, '0')}:${m ?? '00'}`;
  }
}
