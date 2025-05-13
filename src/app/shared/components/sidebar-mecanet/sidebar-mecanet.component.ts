import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar-mecanet',
  templateUrl: './sidebar-mecanet.component.html',
  styleUrls: ['./sidebar-mecanet.component.scss'],
  imports: [MatIconModule, CommonModule],
})
export class SidebarMecanetComponent {
  isExpanded = false;

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
  }

  expandSidebar() {
    this.isExpanded = true;
  }

  collapseSidebar() {
    this.isExpanded = false;
  }
}
