import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalApiService } from '../../services/personal-api.service';
import { PersonalEntity } from '../../model/personal.model';
import { PersonalFormComponent } from '../../components/personal-form/personal-form.component';
import { RecordTableComponent } from '../../../../shared/components/record-table/record-table.component';
import { InformationPanelComponent } from '../../../../shared/components/information-panel/information-panel.component';
import { InfoSectionComponent } from '../../../../shared/components/information-panel/info-section/info-section.component';
import { ButtonComponent, ButtonVariant } from '../../../../shared/components/button/button.component';
import { SearchComponent } from '../../../../shared/components/search/search.component';
import { TitleViewComponent } from '../../../../shared/components/title-view/title-view.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

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
  selector: 'app-personal-view',
  templateUrl: './personal-view.component.html',
  styleUrls: ['./personal-view.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RecordTableComponent,
    InformationPanelComponent,
    TitleViewComponent,
    InfoSectionComponent,
    ButtonComponent,
    PersonalFormComponent,
    SearchComponent,
    TranslateModule
  ]
})
export class PersonalViewComponent implements OnInit {
  personalList: PersonalEntity[] = [];
  selectedPerson: any = null;
  showInfoPanel = false;
  showCreateModal = false;
  searchTerm = '';

  columns: TableColumn[] = [
    { key: 'username', label: 'personal.table.username', type: 'texto' },
    { key: 'name', label: 'personal.table.fullName', type: 'texto' },
    { key: 'email', label: 'personal.table.email', type: 'texto' },
    { key: 'role', label: 'personal.table.role', type: 'texto', filterable: true },
    { key: 'actions', label: '', type: 'cta', ctaLabel: 'personal.table.details', ctaVariant: 'primary' }
  ];

  get filteredPersonalList() {
    if (!this.searchTerm) return this.personalList;

    const searchLower = this.searchTerm.toLowerCase();
    return this.personalList.filter(person =>
      person.username.toLowerCase().includes(searchLower) ||
      person.name?.toLowerCase().includes(searchLower) ||
      person.email.toLowerCase().includes(searchLower)
    );
  }

  constructor(
    private personalService: PersonalApiService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.loadPersonal();
  }

  async loadPersonal() {
    try {
      const data = await this.personalService.getPersonals();
      this.personalList = data.map(p => ({
        ...p,
        name: `${p.firstName} ${p.lastName}`,
        role: p.roles[0] === 'ROLE_TECHNICAL'
          ? this.translate.instant('personal.roles.technical')
          : this.translate.instant('personal.roles.admin')
      }));
    } catch (error) {
      console.error('Error loading personal:', error);
    }
  }

  handleSearch(term: string) {
    this.searchTerm = term;
  }

  async handleCtaClick(event: { row: any; column: any }) {
    try {
      const person = await this.personalService.getPersonalById(event.row.id);
      this.selectedPerson = {
        ...person,
        name: `${person.firstName} ${person.lastName}`,
        role: person.roles[0] === 'ROLE_TECHNICAL'
          ? this.translate.instant('personal.roles.technical')
          : this.translate.instant('personal.roles.admin'),
        generalInfo: [
          { subtitle: this.translate.instant('personal.infoPanel.username'), info: person.username },
          { subtitle: this.translate.instant('personal.infoPanel.fullName'), info: `${person.firstName} ${person.lastName}` },
          { subtitle: this.translate.instant('personal.infoPanel.email'), info: person.email },
          { subtitle: this.translate.instant('personal.infoPanel.role'), info: person.roles[0] === 'ROLE_TECHNICAL'
            ? this.translate.instant('personal.roles.technical')
            : this.translate.instant('personal.roles.admin') }
        ]
      };
      this.showInfoPanel = true;
    } catch (error) {
      console.error('Error loading personal detail:', error);
    }
  }

  closePanel() {
    this.showInfoPanel = false;
    setTimeout(() => {
      this.selectedPerson = null;
    }, 300);
  }

  handleNewClick = () => {
    this.selectedPerson = null;
    this.showCreateModal = true;
  }

  async handleCreate(formData: Partial<PersonalEntity>) {
    try {
      await this.personalService.createPersonal(formData);
      this.showCreateModal = false;
      await this.loadPersonal();
    } catch (error) {
      console.error('Error creating person:', error);
    }
  }
}
