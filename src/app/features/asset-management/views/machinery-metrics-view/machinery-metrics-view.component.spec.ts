import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MachineryMetricsViewComponent } from './machinery-metrics-view.component';
import { MachineryService } from '../../services/machinery.service';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { MachineryEntity } from '../../models/machinery.entity';
import { MachineryMeasurementEntity } from '../../models/measurement.entity';

describe('MachineryMetricsViewComponent', () => {
  let component: MachineryMetricsViewComponent;
  let fixture: ComponentFixture<MachineryMetricsViewComponent>;
  let mockMachineryService: jasmine.SpyObj<MachineryService>;

  const mockMachinery: MachineryEntity = {
    id: 1,
    name: 'Test Machinery',
    model: 'Test Model',
    brand: 'Test Brand',
    serialNumber: 'TEST123',
    productionCapacity: 100,
    recommendations: 'Test recommendations',
    status: 1,
    userCreator: 1,
    userUpdater: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    measurements: [
      {
        id: 1,
        name: 'Test Measurement',
        unit: 'units',
        value: 100,
        lastUpdated: new Date()
      }
    ]
  };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('MachineryService', ['getAllMachineriesWithMeasurements', 'updateMachineryMeasurement']);

    await TestBed.configureTestingModule({
      imports: [
        MachineryMetricsViewComponent,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: MachineryService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MachineryMetricsViewComponent);
    component = fixture.componentInstance;
    mockMachineryService = TestBed.inject(MachineryService) as jasmine.SpyObj<MachineryService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load machineries on init', () => {
    mockMachineryService.getAllMachineriesWithMeasurements.and.returnValue(of([mockMachinery]));

    component.ngOnInit();

    expect(mockMachineryService.getAllMachineriesWithMeasurements).toHaveBeenCalled();
    expect(component.machineries).toEqual([mockMachinery]);
    expect(component.filteredMachineries).toEqual([mockMachinery]);
  });

  it('should handle error when loading machineries', () => {
    mockMachineryService.getAllMachineriesWithMeasurements.and.returnValue(throwError('Test error'));

    component.ngOnInit();

    expect(component.error).toBe('Error al cargar las maquinarias');
    expect(component.loading).toBeFalse();
  });

  it('should filter machineries by search term', () => {
    component.machineries = [mockMachinery];
    component.filteredMachineries = [mockMachinery];

    component.handleSearch('Test');

    expect(component.filteredMachineries).toEqual([mockMachinery]);

    component.handleSearch('NonExistent');

    expect(component.filteredMachineries).toEqual([]);
  });

  it('should update measurement value', () => {
    component.onMeasurementValueChange(1, 1, '50');

    expect(component.measurementValues[1][1]).toBe(50);
  });

  it('should get correct status text', () => {
    expect(component.getStatusText(0)).toBe('Inactiva');
    expect(component.getStatusText(1)).toBe('Activa');
    expect(component.getStatusText(2)).toBe('Mantenimiento');
    expect(component.getStatusText(3)).toBe('Reparación');
  });

  it('should get correct status class', () => {
    expect(component.getStatusClass(0)).toBe('status-inactive');
    expect(component.getStatusClass(1)).toBe('status-active');
    expect(component.getStatusClass(2)).toBe('status-maintenance');
    expect(component.getStatusClass(3)).toBe('status-repair');
  });

  it('should format date correctly', () => {
    const testDate = new Date('2023-01-01T12:00:00');
    const formatted = component.formatDate(testDate);
    
    expect(formatted).toContain('01/01/2023');
  });

  it('should handle invalid date formatting', () => {
    expect(component.formatDate(null as any)).toBe('N/A');
    expect(component.formatDate('invalid-date')).toBe('Fecha inválida');
  });
}); 