import { Component,Input, ElementRef, AfterViewInit,ViewChild  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaintenancePlanItem } from '../../../model/maintenance-plan.entity';


@Component({
  selector: 'app-plan-item-board',
  imports: [CommonModule],
  templateUrl: './plan-item-board.component.html',
  styleUrl: './plan-item-board.component.scss'
})
export class PlanItemBoardComponent implements AfterViewInit{
  @ViewChild('daysContainer') daysContainer!: ElementRef<HTMLDivElement>;

  @Input() durationDays: number = 1;
  @Input() items: MaintenancePlanItem[] = [];

  get daysArray(): number[] {
    return Array(this.durationDays).fill(0).map((_, i) => i + 1);
  }

  ngAfterViewInit() {
    this.daysContainer.nativeElement.addEventListener('wheel', (event: WheelEvent) => {
      event.preventDefault(); // evita scroll vertical
      this.daysContainer.nativeElement.scrollLeft += event.deltaY;
    });
  }

  getItemsForDay(day: number): MaintenancePlanItem[] {
    return this.items.filter(i => i.dayNumber === day);
  }
}
