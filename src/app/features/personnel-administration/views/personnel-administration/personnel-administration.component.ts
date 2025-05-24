import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecordTableComponent } from '../../../../shared/components/record-table/record-table.component';
import { InformationPanelComponent } from '../../../../shared/components/information-panel/information-panel.component';
import { InfoSectionComponent } from '../../../../shared/components/information-panel/info-section/info-section.component';
import { InfoContainerComponent } from '../../../../shared/components/information-panel/info-container/info-container.component';
import { ButtonComponent, ButtonVariant } from '../../../../shared/components/button/button.component';
import { SearchComponent } from '../../../../shared/components/search/search.component';
import { TitleViewComponent } from '../../../../shared/components/title-view/title-view.component';
import { UserApiService } from '../../services/user-api.service';
import { PersonnetAdministrationFormModalComponent } from '../../components/personnet-administration-form-modal/personnet-administration-form-modal.component';
import { UserEntity } from '../../services/user-api.service';

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
  selector: 'app-personnel-administration',
  imports: [
    CommonModule,
    RecordTableComponent,
    InformationPanelComponent,
    InfoSectionComponent,
    InfoContainerComponent,
    ButtonComponent,
    SearchComponent,
    TitleViewComponent,
    PersonnetAdministrationFormModalComponent
  ],
  templateUrl: './personnel-administration.component.html',
  styleUrl: './personnel-administration.component.scss'
})
export class PersonnelAdministrationComponent implements OnInit {
  // Estado del panel de información
  showInfoPanel = false;
  selectedUser: UserEntity | null = null;
  infoData: { subtitle: string; info: any }[] = [];
  contactData: { subtitle: string; info: any }[] = [];

  filters = [
    { key: 'role', label: 'Rol', options: [
      { value: 'admin', label: 'Administrador' },
      { value: 'user', label: 'Usuario' },
    ]}
  ];

  columns: TableColumn[] = [
    { key: 'code', label: 'Código', type: 'texto' },
    { key: 'name', label: 'Nombre', type: 'texto' },
    { key: 'role', label: 'Rol', type: 'texto' },
    { key: 'email', label: 'Email', type: 'texto' },
    { key: 'actions', label: '', type: 'cta', ctaLabel: 'Detalles', ctaVariant: 'primary' }
  ];

  data: UserEntity[] = [];
  filteredData: UserEntity[] = [];
  searchTerm = '';
  activeFilters: Record<string, string> = {};

  showCreateModal = false;
  showEditModal = false;

  constructor(private userService: UserApiService) {}

  ngOnInit() {
    this.loadUsers();
  }

  async loadUsers() {
    try {
      const users = await this.userService.getUsers();
      this.data = users as UserEntity[];
      this.filteredData = users as UserEntity[];
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    }
  }

  handleNewClick() {
    // Implementar lógica para nuevo usuario
  }

  handleInfoClick(event: any) {
    const user = event.row;
    this.selectedUser = user;
    this.updateInfoPanel(user);
    this.showInfoPanel = true;
  }

  updateInfoPanel(user: any) {
    this.infoData = [
      { subtitle: 'Código', info: user.code },
      { subtitle: 'Nombre', info: user.name },
      { subtitle: 'Rol', info: user.role }
    ];

    this.contactData = [
      { subtitle: 'Email', info: user.email },
      { subtitle: 'Teléfono', info: user.phone || 'No disponible' },
      { subtitle: 'Dirección', info: user.address || 'No disponible' }
    ];
  }

  handleFilterChange(filters: Record<string, string>) {
    this.activeFilters = filters;
    this.applyFilters();
  }

  handleSearch(term: string) {
    this.searchTerm = term;
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.data];

    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchLower) ||
        user.code.toLowerCase().includes(searchLower)
      );
    }

    if (Object.keys(this.activeFilters).length) {
      filtered = filtered.filter(user => {
        return Object.entries(this.activeFilters).every(([key, value]) => {
          if (!value) return true;
          return user[key as keyof UserEntity] === value;
        });
      });
    }

    this.filteredData = filtered;
  }

  closePanel() {
    this.showInfoPanel = false;
    setTimeout(() => {
      this.selectedUser = null;
    }, 300);
  }

  async handleCreate(userData: Partial<UserEntity>) {
    try {
      await this.userService.createUser(userData);
      this.showCreateModal = false;
      await this.loadUsers();
    } catch (error) {
      console.error('Error al crear usuario:', error);
    }
  }

  async handleEdit(userData: Partial<UserEntity>) {
    try {
      if (userData.id) {
        await this.userService.updateUser(userData.id, userData);
        this.showEditModal = false;
        this.selectedUser = null;
        await this.loadUsers();
      }
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
    }
    this.closePanel();
  }

  async handleDelete(id: number) {
    try {
      await this.userService.deleteUser(id);
      this.showEditModal = false;
      this.selectedUser = null;
      await this.loadUsers();
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
    this.closePanel();
  }
}
