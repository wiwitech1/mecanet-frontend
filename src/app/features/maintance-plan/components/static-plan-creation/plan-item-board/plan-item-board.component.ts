import { Component, Input, ElementRef, AfterViewInit, ViewChild, EventEmitter, Output, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaintenancePlanItem } from '../../../model/maintenance-plan.entity';
import { CdkDragDrop, DragDropModule, moveItemInArray, CdkDropList } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-plan-item-board',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './plan-item-board.component.html',
  styleUrl: './plan-item-board.component.scss'
})
export class PlanItemBoardComponent implements AfterViewInit {
  @ViewChild('daysContainer') daysContainer!: ElementRef<HTMLDivElement>;
  @ViewChildren(CdkDropList) dropLists!: QueryList<CdkDropList>;

  @Input() durationDays: number = 1;
  @Input() items: MaintenancePlanItem[] = [];

  @Output() itemMoved = new EventEmitter<{ item: MaintenancePlanItem; newDay: number }>();

  get daysArray(): number[] {
    return Array(this.durationDays).fill(0).map((_, i) => i + 1);
  }

  ngAfterViewInit() {
    this.daysContainer.nativeElement.addEventListener('wheel', (event: WheelEvent) => {
      event.preventDefault();
      this.daysContainer.nativeElement.scrollLeft += event.deltaY;
    });

    // Conectar todas las listas entre sí
    this.dropLists.forEach(list => {
      list.connectedTo = this.dropLists.filter(l => l !== list);
    });
  }

  getItemsForDay(day: number): MaintenancePlanItem[] {
    return this.items.filter(i => i.dayNumber === day);
  }

  drop(event: CdkDragDrop<MaintenancePlanItem[]>, newDay: number) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const item = event.item.data;
      this.itemMoved.emit({ item, newDay });
    }
  }
}
