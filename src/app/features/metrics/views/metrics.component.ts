import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-metrics',
  standalone: true,
  imports: [CommonModule],
  template: `<h1>Métricas</h1>`,
  styleUrls: ['./metrics.component.scss']
})
export class MetricsComponent {
  constructor() {}
} 