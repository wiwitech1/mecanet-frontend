import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductionLineService } from '../services/production-line.service';
import { ProductionLine } from '../models/production-line.model';

@Component({
  selector: 'app-proprueba',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './proprueba.component.html',
  styleUrl: './proprueba.component.scss'
})
export class PropruebaComponent implements OnInit {

  productionLines: ProductionLine[] = [];

  constructor(private productionLineService: ProductionLineService) { }

  ngOnInit(): void {
    // Llamar al servicio para obtener las líneas de producción
    this.productionLineService.getProductionLines().subscribe(data => {
      this.productionLines = data;
    });
  }
}