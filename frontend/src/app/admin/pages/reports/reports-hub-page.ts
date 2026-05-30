import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AdminApiService } from '../../../services/admin-api.service';
import { Appointment, DoctorProfile, User } from '../../models/admin.models';
import { downloadCsv, showSnackbar } from '../page.util';
import { SnackbarComponent } from '../../../shared/ui/snackbar/snackbar';

type ReportTab = 'patients' | 'appointments' | 'blood' | 'doctors';

@Component({
  selector: 'app-reports-hub-page',
  standalone: true,
  imports: [FormsModule, SnackbarComponent],
  templateUrl: './reports-hub-page.html',
  styleUrl: './reports-hub-page.scss'
})
export class ReportsHubPage implements OnInit {
  protected readonly loading = signal(true);
  protected readonly errorMsg = signal('');
  protected readonly tab = signal<ReportTab>('patients');
  protected readonly patients = signal<User[]>([]);
  protected readonly appointments = signal<Appointment[]>([]);
  protected readonly doctors = signal<DoctorProfile[]>([]);
  protected readonly bloodStock = signal<{ bloodGroup: string; unitsAvailable: number }[]>([]);
  // bloodStock uses BloodStock shape from API
  protected readonly fromDate = signal('');
  protected readonly toDate = signal('');
  protected readonly snackbarOpen = signal(false);
  protected readonly snackbarMessage = signal('');

  constructor(
    private adminApi: AdminApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const t = this.route.snapshot.queryParamMap.get('tab') as ReportTab | null;
    if (t && ['patients', 'appointments', 'blood', 'doctors'].includes(t)) {
      this.tab.set(t);
    }
    this.load();
  }

  protected setTab(t: ReportTab): void {
    this.tab.set(t);
    this.router.navigate([], { relativeTo: this.route, queryParams: { tab: t }, queryParamsHandling: 'merge' });
  }

  protected load(): void {
    this.loading.set(true);
    forkJoin({
      patients: this.adminApi.getAllPatients(),
      appointments: this.adminApi.getAllAppointments(),
      doctors: this.adminApi.getAllDoctors(),
      blood: this.adminApi.getAllBloodStock()
    }).subscribe({
      next: ({ patients, appointments, doctors, blood }) => {
        this.patients.set(patients);
        this.appointments.set(appointments);
        this.doctors.set(doctors);
        this.bloodStock.set(blood.map(b => ({ bloodGroup: b.bloodGroup, unitsAvailable: b.unitsAvailable })));
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg.set('Failed to load report data.');
        this.loading.set(false);
      }
    });
  }

  protected filteredAppointments(): Appointment[] {
    const from = this.fromDate();
    const to = this.toDate();
    return this.appointments().filter(a => {
      const d = a.appointmentDate?.slice(0, 10) ?? '';
      if (from && d < from) return false;
      if (to && d > to) return false;
      return true;
    });
  }

  protected exportCurrent(): void {
    const t = this.tab();
    if (t === 'patients') {
      downloadCsv('patients-report.csv', ['UHID', 'Name', 'Gender', 'Age', 'Mobile'],
        this.patients().map(p => [p.uhid, p.name, p.gender, p.age, p.mobile]));
    } else if (t === 'appointments') {
      downloadCsv('appointments-report.csv', ['Date', 'Patient', 'Doctor', 'Status', 'Token'],
        this.filteredAppointments().map(a => [a.appointmentDate, a.patient.name, a.doctor.name, a.status, a.tokenNumber]));
    } else if (t === 'doctors') {
      downloadCsv('doctors-report.csv', ['Name', 'UHID', 'Department', 'Specialization', 'Fee'],
        this.doctors().map(d => [d.user.name, d.user.uhid, d.department, d.specialization, d.consultationFee]));
    } else {
      downloadCsv('blood-bank-report.csv', ['Blood group', 'Units'],
        this.bloodStock().map(b => [b.bloodGroup, b.unitsAvailable]));
    }
    showSnackbar(this.snackbarOpen, this.snackbarMessage, 'Report exported as CSV.');
  }
}
