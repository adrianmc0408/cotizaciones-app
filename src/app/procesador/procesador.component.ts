import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Registro {
  fecha: string;
  montoBSS: number;
  tasa: number;
  montoUSD: number;
  banco: string;
  empresa: string;
  responsable: string;
}

@Component({
  selector: 'app-procesador',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card-container">
      <div class="card">
        <h2>Procesador de Cotizaciones</h2>
        
        <div class="form-group">
          <label>Pegue el texto de la cotización</label>
          <textarea [(ngModel)]="textoEntrada" rows="10" placeholder="Pegue aquí el texto de la cotización..."></textarea>
        </div>

        <div class="button-group">
          <button class="primary" (click)="procesarDatos()">Procesar</button>
          <button class="danger" (click)="limpiarEntrada()">Limpiar Entrada</button>
        </div>
      </div>

      <div class="card" *ngIf="registros.length > 0">
        <h3>Resultados</h3>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>NRO OPERACION</th>
                <th>FECHA</th>
                <th>BANCO</th>
                <th>MONTO (BSS)</th>
                <th>TOTAL (BSS)</th>
                <th>TASA</th>
                <th>MONTO (USD)</th>
                <th>TOTAL (USD)</th>
                <th>EMPRESA</th>
                <th>RESPONSABLE</th>
                <th>ESTADO</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let registro of registros; let i = index">
                <td>{{i === 0 ? '1' : ''}}</td>
                <td>{{i === 0 || registros[i-1]?.fecha !== registro.fecha ? registro.fecha : ''}}</td>
                <td>{{registro.banco}}</td>
                <td>{{formatearNumero(registro.montoBSS)}}</td>
                <td>{{i === registros.length - 1 ? formatearNumero(totalBSS) : ''}}</td>
                <td>{{formatearNumero(registro.tasa)}}</td>
                <td>{{formatearNumero(registro.montoUSD)}}</td>
                <td>{{i === registros.length - 1 ? formatearNumero(totalUSD) : ''}}</td>
                <td>{{registro.empresa}}</td>
                <td>{{registro.responsable}}</td>
                <td>{{i === registros.length - 1 ? 'APROBADO' : ''}}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="resultados">
          <div class="total-card">
            <div class="total-item">
              <span class="label">Total USD</span>
              <span class="value">{{formatearNumero(totalUSD)}}</span>
            </div>
            <div class="total-item">
              <span class="label">Comisión (2%)</span>
              <span class="value">{{formatearNumero(comision)}}</span>
            </div>
          </div>
        </div>

        <div class="button-group">
          <button class="secondary" (click)="copiarTabla()">Copiar tabla</button>
          <button class="secondary" (click)="copiarTotal()">Copiar total</button>
          <button class="secondary" (click)="cobrarComision()">Cobrar Comisión</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card-container {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .card {
      background-color: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    h2, h3 {
      color: #333;
      margin: 0 0 1.5rem 0;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #666;
      font-weight: 500;
    }

    textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 1rem;
      resize: vertical;
      transition: border-color 0.3s ease;
    }

    textarea:focus {
      outline: none;
      border-color: #4CAF50;
    }

    .button-group {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }

    button {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    button.primary {
      background-color: #4CAF50;
      color: white;
    }

    button.secondary {
      background-color: #2196F3;
      color: white;
    }

    button.danger {
      background-color: #f44336;
      color: white;
    }

    button:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }

    .table-container {
      overflow-x: auto;
      margin: 1.5rem 0;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.9rem;
    }

    th, td {
      padding: 0.75rem;
      text-align: center;
      border-bottom: 1px solid #eee;
    }

    th {
      background-color: #f8f9fa;
      font-weight: 600;
      color: #333;
    }

    tr:hover {
      background-color: #f8f9fa;
    }

    .resultados {
      margin: 2rem 0;
    }

    .total-card {
      display: flex;
      gap: 2rem;
      justify-content: center;
      background-color: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
    }

    .total-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .label {
      color: #666;
      font-size: 0.9rem;
    }

    .value {
      color: #4CAF50;
      font-size: 1.2rem;
      font-weight: 600;
    }
  `]
})
export class ProcesadorComponent {
  textoEntrada: string = '';
  registros: Registro[] = [];
  totalBSS: number = 0;
  totalUSD: number = 0;
  comision: number = 0;

  formatearNumero(valor: number): string {
    return valor.toLocaleString('es-VE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  procesarDatos() {
    if (!this.textoEntrada) {
      alert('Por favor ingrese el texto de la cotización');
      return;
    }

    const bloques = this.textoEntrada.split(/\n(?=Lunes|Martes|Miércoles|Jueves|Viernes|Sábado|Domingo)/);
    this.registros = [];
    this.totalBSS = 0;
    this.totalUSD = 0;
    const empresa = "INVERSIONES AAG 2010 CA";

    for (const bloque of bloques) {
      const lineas = bloque.trim().split('\n');
      let fecha = '';
      let responsable = '';
      let tasa = 0;
      let banco = '';
      let montosBSS: number[] = [];

      // Primera pasada: recolectar información básica
      for (const linea of lineas) {
        if (linea.match(/^(Lunes|Martes|Miércoles|Jueves|Viernes|Sábado|Domingo)/)) {
          const partes = linea.split(' ');
          const dia = partes[1];
          const mes = partes[3];
          const anio = partes[5];
          const meses: { [key: string]: string } = {
            'Enero': '01', 'Febrero': '02', 'Marzo': '03', 'Abril': '04',
            'Mayo': '05', 'Junio': '06', 'Julio': '07', 'Agosto': '08',
            'Septiembre': '09', 'Octubre': '10', 'Noviembre': '11', 'Diciembre': '12'
          };
          fecha = `${dia.padStart(2, '0')}/${meses[mes]}/${anio}`;
        }

        if (linea.includes('Nombre:')) {
          responsable = linea.split('Nombre:')[1].trim();
        }

        if (linea.includes('Monto en Bs:')) {
          const monto = parseFloat(linea.split('Monto en Bs:')[1].replace(/\./g, '').replace(',', '.').trim());
          if (!isNaN(monto)) {
            montosBSS.push(monto);
          }
        }

        if (linea.includes('Tasa:')) {
          tasa = parseFloat(linea.split('Tasa:')[1].replace(',', '.').trim());
        }

        if (linea.includes('Mi Banco')) {
          banco = 'MI BANCO';
        }
      }

      // Segunda pasada: crear registros con la tasa
      if (tasa > 0 && montosBSS.length > 0) {
        for (const montoBSS of montosBSS) {
          const montoUSD = montoBSS / tasa;
          this.totalBSS += montoBSS;
          this.totalUSD += montoUSD;

          this.registros.push({
            fecha,
            montoBSS,
            tasa,
            montoUSD,
            banco: banco || 'MI BANCO',
            empresa,
            responsable
          });
        }
      }
    }

    this.comision = this.totalUSD * 0.02;
  }

  limpiarEntrada() {
    this.textoEntrada = '';
    this.registros = [];
    this.totalBSS = 0;
    this.totalUSD = 0;
    this.comision = 0;
  }

  copiarTabla() {
    let texto = '';
    
    for (let i = 0; i < this.registros.length; i++) {
      const registro = this.registros[i];
      
      texto += (i === 0 ? '1' : '') + '\t';
      texto += (i === 0 || (i > 0 && this.registros[i-1]?.fecha !== registro.fecha) ? registro.fecha : '') + '\t';
      texto += registro.banco + '\t';
      texto += this.formatearNumero(registro.montoBSS) + '\t';
      texto += (i === this.registros.length - 1 ? this.formatearNumero(this.totalBSS) : '') + '\t';
      texto += this.formatearNumero(registro.tasa) + '\t';
      texto += this.formatearNumero(registro.montoUSD) + '\t';
      texto += (i === this.registros.length - 1 ? this.formatearNumero(this.totalUSD) : '') + '\t';
      texto += registro.empresa + '\t';
      texto += registro.responsable + '\t';
      texto += (i === this.registros.length - 1 ? 'APROBADO' : '') + '\n';
    }
    
    navigator.clipboard.writeText(texto)
      .then(() => alert('Tabla copiada al portapapeles'))
      .catch(err => alert('Error al copiar la tabla'));
  }

  copiarTotal() {
    navigator.clipboard.writeText(this.formatearNumero(this.totalUSD))
      .then(() => alert('Total USD copiado al portapapeles'))
      .catch(err => alert('Error al copiar el total'));
  }

  cobrarComision() {
    navigator.clipboard.writeText(this.formatearNumero(this.comision))
      .then(() => alert('Comisión copiada al portapapeles'))
      .catch(err => alert('Error al copiar la comisión'));
  }
} 