import { Component, OnInit, signal } from '@angular/core';
import { AdminApiService } from '../../../services/admin-api.service';
import { Ward } from '../../models/admin.models';

@Component({
  selector: 'app-wards-types-page',
  standalone: true,
  templateUrl: './wards-types-page.html',
  styleUrl: './wards-types-page.scss'
})
export class WardsTypesPage implements OnInit {
  protected readonly loading = signal(true);
  protected readonly errorMsg = signal('');
  protected readonly icu = signal<Ward[]>([]);
  protected readonly general = signal<Ward[]>([]);
  protected readonly filter = signal<'ALL' | 'ICU' | 'GENERAL'>('ALL');

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void {
    this.adminApi.getAllWards().subscribe({
      next: list => {
        this.icu.set(list.filter(w => w.wardType.toUpperCase() === 'ICU'));
        this.general.set(list.filter(w => w.wardType.toUpperCase() === 'GENERAL'));
        this.loading.set(false);
      },
      error: () => { this.errorMsg.set('Failed to load wards.'); this.loading.set(false); }
    });
  }
}
