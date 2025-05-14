import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MaintenancePlanService } from '../../services/maintenance-plan.service';
import { MaintenancePlanData } from '../../model/maintenance-plan.model';

@Component({
  selector: 'app-maintenance-plan-list',
  templateUrl: './maintenance-plan-list.component.html',
  styleUrls: ['./maintenance-plan-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule, 
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule
  ]
})
export class MaintenancePlanListComponent implements OnInit {
  maintenancePlans: MaintenancePlanData[] = [];
  displayedColumns: string[] = ['planId', 'productionLineId', 'startDate', 'durationDays', 'actions'];
  isLoading = true;
  errorMessage = '';

  constructor(private maintenancePlanService: MaintenancePlanService) {}

  ngOnInit(): void {
    this.loadPlans();
  }

  loadPlans(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.maintenancePlanService.getAllPlans().subscribe({
      next: (plans) => {
        this.maintenancePlans = plans;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar los planes de mantenimiento', error);
        this.errorMessage = 'Error al cargar los planes de mantenimiento. Por favor, inténtelo de nuevo más tarde.';
        this.isLoading = false;
      }
    });
  }

  deletePlan(planId: number): void {
    if (confirm('¿Está seguro de que desea eliminar este plan de mantenimiento?')) {
      this.maintenancePlanService.deletePlan(planId).subscribe({
        next: () => {
          this.maintenancePlans = this.maintenancePlans.filter(plan => plan.planId !== planId);
        },
        error: (error) => {
          console.error('Error al eliminar el plan de mantenimiento', error);
          alert('Error al eliminar el plan. Por favor, inténtelo de nuevo más tarde.');
        }
      });
    }
  }
} 