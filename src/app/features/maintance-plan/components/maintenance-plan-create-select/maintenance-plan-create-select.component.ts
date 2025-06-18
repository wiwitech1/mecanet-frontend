import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TitleViewComponent } from '../../../../shared/components/title-view/title-view.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-maintenance-plan-create-select',
  standalone: true,
  imports: [CommonModule, TitleViewComponent, ButtonComponent],
  template: `

<div class="header">
    <header class="breadcrumb-header">
      <button class="back-button" aria-label="Volver" (click)="goBack()">
        <span class="back-icon">&#8592;</span> <!-- Icono de flecha izquierda -->
      </button>
      <app-title-view text="Crear Plan de Mantenimiento"/>
    </header>
  </div>


    <div class="container">

  <div class="plan-type-selector">
    <h3>Seleccione el tipo de plan a crear</h3>

    <div class="plan-options">
      <!-- Plan Estático -->
      <div class="plan-option" (click)="goToStaticPlan()">
        <div class="plan-content">
          <div class="plan-icon">🗓️</div>
          <h4>Plan Estático</h4>
          <p class="plan-subtitle">Organización por días</p>
          <p class="plan-description">
            Cree un plan de mantenimiento organizado por días, con tareas específicas para cada uno.
          </p>
          <app-button 
            variant="primary" 
            size="md" 
            radius="md"
            (clicked)="goToStaticPlan()"
            class="select-button-container">
            SELECCIONAR
          </app-button>
        </div>
      </div>

      <!-- Plan Dinámico -->
      <div class="plan-option" (click)="goToDynamicPlan()">
        <div class="plan-content">
          <div class="plan-icon">⚡</div>
          <h4>Plan Dinámico</h4>
          <p class="plan-subtitle">Organización por tareas</p>
          <p class="plan-description">
            Cree un plan de mantenimiento más flexible, enfocado en tareas específicas sin estructura de días.
          </p>
          <app-button 
            variant="primary" 
            size="md" 
            radius="md"
            (clicked)="goToDynamicPlan()"
            class="select-button-container">
            SELECCIONAR
          </app-button>
        </div>
      </div>
    </div>
  </div>
</div>

  `,
  styles: [`
    .container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  margin-bottom: 20px;
}

.breadcrumb-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between; /* Asegura que el título y el botón estén en extremos opuestos */
}

.breadcrumb-header .back-button {
  background-color: #f4f4f4;
  border: none;
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px; /* Tamaño del icono */
  color: #007bff; /* Color del icono */
  display: flex;
  justify-content: center;
  align-items: center;
}

.breadcrumb-header .back-icon {
  font-size: 20px;
  color: #007bff;}

.breadcrumb-header app-title-view {
  flex-grow: 1;
}

.plan-type-selector {
  max-width: 800px;
  margin: 0 auto;
}

.plan-type-selector h3 {
  text-align: center;
  margin-bottom: 30px;
  font-size: 18px;
  color: #4a4a4a;
  font-weight: 500;
}

.plan-options {
  display: flex;
  gap: 30px;
  justify-content: center;
  flex-wrap: wrap;
}

.plan-option {
  width: 300px;
  background-color: #fff;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-align: center;
}

.plan-option:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.plan-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.plan-icon {
  font-size: 38px;
  margin-bottom: 15px;
  color: #007bff;
}

.plan-option h4 {
  font-size: 22px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.plan-subtitle {
  font-size: 15px;
  color: #666;
  margin-bottom: 15px;
}

.plan-description {
  font-size: 15px;
  margin-bottom: 25px;
  color: #777;
  line-height: 1.5;
}

.select-button-container {
  margin-top: auto;
  width: 100%;
}

  `]
})
export class MaintenancePlanCreateSelectComponent {

  constructor(private router: Router) {}

  goBack() {
    window.history.back(); // Regresa a la página anterior
  }

  goToStaticPlan() {
    this.router.navigate(['/plan-mantenimiento/crear-estatico']); // Redirige a crear plan estático
  }

  goToDynamicPlan() {
    this.router.navigate(['/plan-mantenimiento/crear-dinamico']); // Redirige a crear plan dinámico
  }
}
