import { Component, signal } from '@angular/core';
import { CarouselComponent, CarouselSlide } from '../../shared/ui/carousel/carousel';
import { DrawerComponent } from '../../shared/ui/drawer/drawer';
import { MetricCardComponent } from '../../shared/ui/metric-card/metric-card';
import { ModalComponent } from '../../shared/ui/modal/modal';
import { NavbarComponent } from '../../shared/ui/navbar/navbar';
import { SidebarComponent } from '../../shared/ui/sidebar/sidebar';
import { SnackbarComponent } from '../../shared/ui/snackbar/snackbar';

@Component({
  selector: 'app-dashboard-showcase',
  imports: [
    CarouselComponent,
    DrawerComponent,
    MetricCardComponent,
    ModalComponent,
    NavbarComponent,
    SidebarComponent,
    SnackbarComponent
  ],
  templateUrl: './dashboard-showcase.html',
  styleUrl: './dashboard-showcase.scss'
})
export class DashboardShowcaseComponent {
  protected readonly modalOpen = signal(false);
  protected readonly drawerOpen = signal(false);
  protected readonly snackbarOpen = signal(false);

  protected readonly slides: CarouselSlide[] = [
    {
      image: '/assets/images/docAI.jpg',
      eyebrow: 'AI assisted care',
      title: 'Unified hospital operations at a glance',
      description: 'Track patient flow, doctor availability, billing, wards, and lab updates from one CRM workspace.'
    },
    {
      image: '/assets/images/docdata.jpg',
      eyebrow: 'Clinical records',
      title: 'Fast access to the right patient context',
      description: 'Reusable dashboard components are ready to connect with your Spring Boot APIs.'
    },
    {
      image: '/assets/images/OTDOC.jpg',
      eyebrow: 'Critical care',
      title: 'Built for busy teams and urgent decisions',
      description: 'Cards, drawer, modal, snackbar, carousel, navbar, and sidebar are ready as the UI foundation.'
    }
  ];

  protected openSnackbar(): void {
    this.snackbarOpen.set(true);
    window.setTimeout(() => this.snackbarOpen.set(false), 3000);
  }
}
