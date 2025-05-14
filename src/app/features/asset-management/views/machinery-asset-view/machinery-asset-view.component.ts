import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InformationPanelComponent } from '../../../../shared/components/information-panel/information-panel.component';
import { SearchComponent } from '../../../../shared/components/search/search.component';
import { RecordTableComponent } from '../../../../shared/components/record-table/record-table.component';
import { TitleViewComponent } from '../../../../shared/components/title-view/title-view.component';
import { InfoSectionComponent } from '../../../../shared/components/information-panel/info-section/info-section.component';
import { InfoListItemsComponent } from '../../../../shared/components/information-panel/info-list-items/info-list-items.component';
import { InfoContainerComponent } from '../../../../shared/components/information-panel/info-container/info-container.component';

@Component({
  selector: 'app-machinery-asset-view',
  standalone: true,
  imports: [
    CommonModule,
    InformationPanelComponent,
    SearchComponent,
    RecordTableComponent,
    TitleViewComponent,
    InfoSectionComponent,
    InfoListItemsComponent,
    InfoContainerComponent
  ],
  templateUrl: './machinery-asset-view.component.html',
  styleUrl: './machinery-asset-view.component.scss'
})
export class MachineryAssetViewComponent implements OnInit {
  selectedMachineId: number = 1;
  selectedMachine: any = null;
  
  // Columnas corregidas según la interfaz RecordTableColumn
  columns = [
    { key: 'id', label: 'ID', type: 'texto' as 'texto' },
    { key: 'modelo', label: 'Modelo', type: 'texto' as 'texto' },
    { key: 'estado', label: 'Estado', type: 'texto' as 'texto' },
    { key: 'ultimoMantenimiento', label: 'Último mantenimiento', type: 'texto' as 'texto' },
    { key: 'informacion', label: 'Información', type: 'informacion' as 'informacion' }
  ];
  
  // Datos para la tabla
  machines = [
    { id: 1, modelo: 'MT-450', estado: 'Activo', ultimoMantenimiento: '15/04/2025', informacion: 'info' },
    { id: 2, modelo: 'MT-430', estado: 'Activo', ultimoMantenimiento: '10/04/2025', informacion: 'info' },
    { id: 3, modelo: 'MT-450', estado: 'Activo', ultimoMantenimiento: '10/04/2025', informacion: 'info' },
    { id: 4, modelo: 'MT-150', estado: 'Activo', ultimoMantenimiento: '24/04/2025', informacion: 'info' }
  ];
  
  // Datos técnicos para mostrar en el panel de información
  infoData = [
    { subtitle: 'Modelo', info: 'MT-450' },
    { subtitle: 'Estado actual', info: 'Activo' },
    { subtitle: 'Fecha instalación', info: '10/01/2024' },
    { subtitle: 'Último mantenimiento', info: '15/04/2025' }
  ];
  
  // Especificaciones técnicas
  techData = [
    { subtitle: 'Potencia', info: '450kW' },
    { subtitle: 'Peso', info: '2.500Kg' },
    { subtitle: 'Dimensiones', info: '4.2 x 2.1 x 1.8 m' }
  ];
  
  // Historial de mantenimiento
  maintenanceItems = [
    { 
      date: '01/10/2024', 
      type: 'Preventivo', 
      responsible: 'María López' 
    },
    { 
      date: '15/04/2025', 
      type: 'Correctivo', 
      responsible: 'Luis Ramírez' 
    }
  ];
  
  // Para el botón Nueva Máquina
  newMachineAction = () => {
    console.log('Nueva máquina');
  };
  
  ngOnInit() {
    // Simula la selección del primer elemento
    this.selectMachine(this.machines[0]);
  }
  
  selectMachine(machine: any) {
    this.selectedMachine = machine;
    this.selectedMachineId = machine.id;
  }
  
  onCtaClick(event: {row: any, column: any}) {
    this.selectMachine(event.row);
  }
}
