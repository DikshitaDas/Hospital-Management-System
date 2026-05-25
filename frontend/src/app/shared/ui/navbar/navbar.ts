import { Component, output } from '@angular/core';
import {
  LucideBell,
  LucideMenu,
  LucidePanelLeft,
  LucidePlus,
  LucideSearch
} from '@lucide/angular';

@Component({
  selector: 'app-navbar',
  imports: [LucideBell, LucideMenu, LucidePanelLeft, LucidePlus, LucideSearch],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class NavbarComponent {
  readonly openDrawer = output<void>();
  readonly openModal = output<void>();
  readonly showSnackbar = output<void>();
}
