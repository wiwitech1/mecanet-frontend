import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleViewComponent } from '../../../../shared/components/title-view/title-view.component';
import { SearchComponent } from '../../../../shared/components/search/search.component';
import { InformationPanelComponent } from '../../../../shared/components/information-panel/information-panel.component';
import { CalendarMonthlyComponent } from '../../components/calendar-monthly/calendar-monthly.component';
import { CalendarWeeklyComponent } from '../../components/calendar-weekly/calendar-weekly.component';

@Component({
  selector: 'app-maintenance-calendar',
  standalone: true,
  imports: [
    CommonModule,
    TitleViewComponent,
    SearchComponent,
    InformationPanelComponent,
    CalendarMonthlyComponent,
    CalendarWeeklyComponent
  ],
  templateUrl: './maintenance-calendar.component.html',
  styleUrl: './maintenance-calendar.component.scss'
})
export class MaintenanceCalendarComponent {
  isWeeklyView: boolean = true;
  currentDate = new Date();

  get currentPeriod(): string {
    const months = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    return `${months[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
  }

  // Aquí podrías tener lógica para manejar la búsqueda y los datos del panel
  searchText: string = '';
  activityDetails = {
    nombre: '',
    fecha: '',
    hora: '',
    personal: '',
    anotaciones: ''
  };

  setWeeklyView(): void {
    this.isWeeklyView = true;
  }

  setMonthlyView(): void {
    this.isWeeklyView = false;
  }

  onSearch(text: string) {
    this.searchText = text;
    // Aquí podrías filtrar actividades, etc.
  }

  navigateNext(): void {
    const newDate = new Date(this.currentDate);
    if (this.isWeeklyView) {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    this.currentDate = newDate;
  }

  navigatePrevious(): void {
    const newDate = new Date(this.currentDate);
    if (this.isWeeklyView) {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    this.currentDate = newDate;
  }
}
