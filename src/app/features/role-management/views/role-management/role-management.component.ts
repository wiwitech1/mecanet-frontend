import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecordTableComponent } from '../../../../shared/components/record-table/record-table.component';
import { InformationPanelComponent } from '../../../../shared/components/information-panel/information-panel.component';
import { InfoSectionComponent } from '../../../../shared/components/information-panel/info-section/info-section.component';
import { InfoContainerComponent } from '../../../../shared/components/information-panel/info-container/info-container.component';
import { ButtonComponent, ButtonVariant } from '../../../../shared/components/button/button.component';
import { SearchComponent } from '../../../../shared/components/search/search.component';
import { TitleViewComponent } from '../../../../shared/components/title-view/title-view.component';

interface TableColumn {
  key: string;
  label: string;
  type: 'texto' | 'numero' | 'informacion' | 'cta';
  filterable?: boolean;
  ctaLabel?: string;
  ctaVariant?: ButtonVariant;
  width?: string;
}


@Component({
  selector: 'app-role-management',
  imports: [
    CommonModule,
    RecordTableComponent,
    InformationPanelComponent,
    InfoSectionComponent,
    InfoContainerComponent,
    ButtonComponent,
    SearchComponent,
    TitleViewComponent,
  ],
  templateUrl: './role-management.component.html',
  styleUrl: './role-management.component.scss'
})
export class RoleManagementComponent {
  showInfoPanel = false;
  infoData: { subtitle: string; info: any }[] = [];
  contactData: { subtitle: string; info: any }[] = [];
  selectedRole: any | null = null;

  columns: TableColumn[] = [
    { key: 'id', label: 'ID', type: 'numero' },
    { key: 'name', label: 'Nombre', type: 'texto' },
    { key: 'description', label: 'Descripción', type: 'texto' },
    { key: 'actions', label: '', type: 'cta', ctaLabel: 'Detalles', ctaVariant: 'primary' }
  ];

  data: any[] = [];
  filteredData: any[] = [];
  searchTerm = '';
  activeFilters: Record<string, string> = {};

  constructor() {}

  ngOnInit() {
    this.loadRoles();
  }

  loadRoles() {
    this.data = [
      { id: 1, name: 'Administrador', description: 'Administrador del sistema' },
      { id: 2, name: 'Usuario', description: 'Usuario del sistema' },
    ];
    this.filteredData = [...this.data];
  }

  handleSearch(term: string) {
    this.searchTerm = term;
    this.applyFilters();
  }

  handleFilterChange(filters: Record<string, string>) {
    this.activeFilters = filters;
    this.applyFilters();
  }

  applyFilters() {
    this.filteredData = this.data.filter((role) => {
      return Object.entries(this.activeFilters).every(([key, value]) => {
        return role[key].toString().toLowerCase().includes(value.toLowerCase());
      });
    });
  }

  closePanel() {
    this.showInfoPanel = false;
  }

  showEditModal = false;

  handleInfoClick(event: any) {
    this.showInfoPanel = true;
    this.selectedRole = this.filteredData[event.index];

    this.infoData = [
      { subtitle: 'Información del Rol', info: this.selectedRole }
    ];

    this.contactData = [
      { subtitle: 'Datos de Contacto', info: this.selectedRole }
    ];
  }

  handleNewClick() {
    this.showEditModal = true;
  }

  handleEdit(role: any) {
    this.showEditModal = true;
    this.selectedRole = role;
  }

  handleDelete(id: number) {
    console.log('Eliminar rol', id);
  }




}
