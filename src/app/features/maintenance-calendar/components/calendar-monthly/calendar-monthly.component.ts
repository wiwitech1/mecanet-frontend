import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar-monthly',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar-monthly.component.html',
  styleUrl: './calendar-monthly.component.scss'
})
export class CalendarMonthlyComponent {
  @Input() currentDate!: Date;
  currentMonth: number = new Date().getMonth();
  currentYear: number = new Date().getFullYear();

  months: string[] = [
    "Enero", "Febrero", "Marzo", "Abril",
    "Mayo", "Junio", "Julio", "Agosto",
    "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  get monthName(): string {
    return this.months[this.currentMonth];
  }

  get yearName(): number {
    return this.currentYear;
  }

  get daysInMonth(): { firstDay: number; totalDays: number } {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const totalDays = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    return { firstDay, totalDays };
  }

  get daysArray(): (number | null)[] {
    const { firstDay, totalDays } = this.daysInMonth;

    // Ajuste para que Lunes sea 0, Domingo 6
    const adjustedStart = (firstDay + 6) % 7;
    const days: (number | null)[] = [];

    for (let i = 0; i < adjustedStart; i++) {
      days.push(null); // espacios vacíos
    }

    for (let d = 1; d <= totalDays; d++) {
      days.push(d);
    }

    return days;
  }

  prevMonth(): void {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
  }

  nextMonth(): void {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
  }
}
