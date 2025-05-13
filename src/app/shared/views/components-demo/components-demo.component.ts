import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent, ButtonVariant, ButtonSize, ButtonRadius } from '../../components/button/button.component';
import { SearchComponent } from '../../components/search/search.component';
import { RecordTableComponent, RecordTableColumn } from '../../components/record-table/record-table.component';
import { SidebarMecanetComponent } from '../../components/sidebar-mecanet/sidebar-mecanet.component';
@Component({
  selector: 'app-components-demo',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    SearchComponent,
    RecordTableComponent,
    SidebarMecanetComponent
  ],
  templateUrl: './components-demo.component.html',
  styleUrl: './components-demo.component.scss'
})
export class ComponentsDemoComponent {
  buttonVariants: ButtonVariant[] = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'outline', 'ghost'];
  buttonSizes: ButtonSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
  buttonRadiuses: ButtonRadius[] = ['none', 'sm', 'md', 'lg', 'full'];

  userFilters = [
    {
      label: 'Estado',
      value: 'estado',
      options: [
        { label: 'Todos', value: 'all' },
        { label: 'Activo', value: 'active' },
        { label: 'Inactivo', value: 'inactive' }
      ]
    },
    {
      label: 'Rol',
      value: 'rol',
      options: [
        { label: 'Todos', value: 'all' },
        { label: 'Admin', value: 'admin' },
        { label: 'Usuario', value: 'user' }
      ]
    }
  ];

  recordTableColumns: RecordTableColumn[] = [
    { key: 'nombre', label: 'Nombre', type: 'texto' },
    { key: 'edad', label: 'Edad', type: 'numero' },
    { key: 'info', label: 'Info', type: 'informacion' },
    { key: 'accion', label: 'Acción', type: 'cta', ctaLabel: 'Ver', ctaVariant: 'primary' }
  ];

  recordTableData = [
    { nombre: 'Juan', edad: 30, info: 'Usuario activo', accion: null },
    { nombre: 'Ana', edad: 25, info: 'Usuario nuevo', accion: null }
  ];

  handleButtonClick(event: MouseEvent): void {
    console.log('Botón clickeado:', event);
  }

  handleSearch(event: string): void {
    console.log('Búsqueda:', event);
  }

  handleFilterChange(event: string): void {
    console.log('Filtro cambiado:', event);
  }

  handleAction(): void {
    console.log('Acción ejecutada');
  }

  openNewUserModal() {
    console.log('Abriendo modal para crear nuevo usuario');
    // Aquí puedes agregar la lógica para abrir un modal
  }

  handleCtaClick(event: any) {
    // Aquí tu lógica, por ejemplo:
    console.log('Acción CTA:', event);
  }
}
