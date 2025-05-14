import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MaintenancePlanService } from '../../services/maintenance-plan.service';
import { MaintenancePlanData, MaintenancePlanItem } from '../../model/maintenance-plan.model';

@Component({
  selector: 'app-maintenance-plan-detail',
  templateUrl: './maintenance-plan-detail.component.html',
  styleUrls: ['./maintenance-plan-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatListModule,
    MatChipsModule,
    MatExpansionModule,
    MatTooltipModule
  ]
})
export class MaintenancePlanDetailComponent implements OnInit {
  plan: MaintenancePlanData | null = null;
  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private maintenancePlanService: MaintenancePlanService
  ) {}

  ngOnInit(): void {
    this.loadPlanDetails();
  }

  loadPlanDetails(): void {
    const planId = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(planId)) {
      this.errorMessage = 'ID de plan inválido';
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    
    this.maintenancePlanService.getPlanById(planId).subscribe({
      next: (plan) => {
        this.plan = plan;
        this.isLoading = false;
        
        if (!plan) {
          this.errorMessage = `No se encontró el plan con ID ${planId}`;
        }
      },
      error: (error) => {
        console.error('Error al cargar los detalles del plan', error);
        this.errorMessage = 'Error al cargar los detalles del plan. Por favor, inténtelo de nuevo más tarde.';
        this.isLoading = false;
      }
    });
  }

  deletePlan(): void {
    if (!this.plan) return;
    
    if (confirm('¿Está seguro de que desea eliminar este plan de mantenimiento?')) {
      this.maintenancePlanService.deletePlan(this.plan.planId).subscribe({
        next: () => {
          this.router.navigate(['/plan-mantenimiento']);
        },
        error: (error) => {
          console.error('Error al eliminar el plan de mantenimiento', error);
          alert('Error al eliminar el plan. Por favor, inténtelo de nuevo más tarde.');
        }
      });
    }
  }

  // Ordenar los items del plan por número de día
  get sortedItems(): MaintenancePlanItem[] {
    return this.plan?.items?.sort((a, b) => a.dayNumber - b.dayNumber) || [];
  }
} 