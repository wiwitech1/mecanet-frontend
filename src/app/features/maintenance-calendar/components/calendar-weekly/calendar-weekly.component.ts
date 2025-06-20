import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar-weekly',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar-weekly.component.html',
  styleUrl: './calendar-weekly.component.scss'
})
export class CalendarWeeklyComponent {
  @Input() currentDate!: Date;
  currentMonth: number = new Date().getMonth();
  currentYear: number = new Date().getFullYear();
  currentWeek: number = 0; // Semana actual dentro del mes (0-based)

  months: string[] = [
    "Enero", "Febrero", "Marzo", "Abril",
    "Mayo", "Junio", "Julio", "Agosto",
    "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  get monthName(): string {
    return this.months[this.currentMonth];
  }

  get weekRange(): string {
    const startDate = this.getStartOfWeek();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);

    const formatDate = (date: Date): string => {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  }

  get daysArray(): number[] {
    const startDate = this.getStartOfWeek();
    const days: number[] = [];

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      days.push(currentDate.getDate());
    }

    return days;
  }

  getStartOfWeek(): Date {
    // Calcula el primer día de la semana actual (lunes)
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1);
    const firstDayOfWeek = firstDayOfMonth.getDay();

    // Ajuste para que Lunes sea el primer día (0)
    const adjustedFirstDay = (firstDayOfWeek + 6) % 7;

    const startDate = new Date(this.currentYear, this.currentMonth,
      1 + (this.currentWeek * 7) - adjustedFirstDay);

    // Asegurarse de que no nos salimos del mes anterior
    if (startDate.getMonth() < this.currentMonth) {
      startDate.setDate(1);
    }

    return startDate;
  }

  prevWeek(): void {
    const startDate = this.getStartOfWeek();
    startDate.setDate(startDate.getDate() - 7);

    if (startDate.getMonth() !== this.currentMonth) {
      if (this.currentMonth === 0) {
        this.currentMonth = 11;
        this.currentYear--;
      } else {
        this.currentMonth--;
      }
      // Ir a la última semana del mes anterior
      this.currentWeek = this.getTotalWeeksInMonth() - 1;
    } else {
      this.currentWeek--;
    }
  }

  nextWeek(): void {
    const startDate = this.getStartOfWeek();
    startDate.setDate(startDate.getDate() + 7);

    if (startDate.getMonth() !== this.currentMonth) {
      if (this.currentMonth === 11) {
        this.currentMonth = 0;
        this.currentYear++;
      } else {
        this.currentMonth++;
      }
      // Ir a la primera semana del siguiente mes
      this.currentWeek = 0;
    } else {
      this.currentWeek++;
    }
  }

  getTotalWeeksInMonth(): number {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const totalDays = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();

    // Ajuste para que Lunes sea el primer día (0)
    const adjustedFirstDay = (firstDay + 6) % 7;

    return Math.ceil((adjustedFirstDay + totalDays) / 7);
  }
}
