import { Component, input, output } from '@angular/core';
import {
  LucideBell,
  LucideLogOut,
  LucideMenu,
  LucidePanelLeft,
  LucidePlus,
  LucideSearch
} from '@lucide/angular';

@Component({
  selector: 'app-navbar',
  imports: [LucideBell, LucideLogOut, LucideMenu, LucidePanelLeft, LucidePlus, LucideSearch],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class NavbarComponent {
  readonly eyebrow = input('Operations center');
  readonly title = input('MediCare Hub');
  readonly userName = input('');
  readonly showNewPatient = input(false);
  readonly searchPlaceholder = input('Search patients, doctors, wards');

  readonly openDrawer = output<void>();
  readonly openModal = output<void>();
  readonly showSnackbar = output<void>();
  readonly logout = output<void>();
}
