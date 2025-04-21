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
        
        <div class="registros-container">
          <div *ngFor="let registro of registros; let i = index">
            <div class="fecha-container" *ngIf="i === 0 || registros[i-1]?.fecha !== registro.fecha">
              <span class="fecha">{{registro.fecha}}</span>
            </div>
            
            <div class="registro-card">
              <div class="registro-header">
                <span class="banco">{{registro.banco}}</span>
              </div>
              <div class="registro-body">
                <div class="registro-item">
                  <span class="label">Monto BSS</span>
                  <span class="value">{{formatearNumero(registro.montoBSS)}}</span>
                </div>
                <div class="registro-item">
                  <span class="label">Tasa</span>
                  <span class="value">{{formatearNumero(registro.tasa)}}</span>
                </div>
                <div class="registro-item">
                  <span class="label">Monto USD</span>
                  <span class="value">{{formatearNumero(registro.montoUSD)}}</span>
                </div>
                <div class="registro-item">
                  <span class="label">Responsable</span>
                  <span class="value">{{registro.responsable}}</span>
                </div>
              </div>
            </div>

            <div class="totales-card" *ngIf="i === registros.length - 1">
              <div class="total-item">
                <span class="label">Total BSS</span>
                <span class="value">{{formatearNumero(totalBSS)}}</span>
              </div>
              <div class="total-item">
                <span class="label">Total USD</span>
                <span class="value">{{formatearNumero(totalUSD)}}</span>
              </div>
              <div class="total-item">
                <span class="label">Estado</span>
                <span class="value">APROBADO</span>
              </div>
            </div>
          </div>
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
          <button class="secondary" (click)="cobrarComision()">Copiar Comisión</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card-container {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .card {
      background-color: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    h2, h3 {
      color: #333;
      margin: 0 0 1rem 0;
      font-size: 1.3rem;
      font-weight: 600;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #666;
      font-weight: 500;
      font-size: 0.9rem;
    }

    textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 1rem;
      resize: vertical;
      transition: border-color 0.3s ease;
      background-color: #f8f9fa;
      box-sizing: border-box;
    }

    textarea:focus {
      outline: none;
      border-color: #4CAF50;
      background-color: white;
    }

    .button-group {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-top: 1.5rem;
      width: 100%;
    }

    button {
      width: 100%;
      padding: 0.75rem;
      border: none;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.9rem;
      box-sizing: border-box;
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

    .registros-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .fecha-container {
      margin: 1rem 0 0.5rem;
      padding: 0.5rem 0;
      border-bottom: 2px solid #4CAF50;
    }

    .fecha {
      font-weight: 600;
      color: #333;
      font-size: 1rem;
    }

    .registro-card {
      background-color: #f8f9fa;
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 1rem;
    }

    .registro-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #eee;
    }

    .banco {
      color: #4CAF50;
      font-weight: 500;
      font-size: 0.9rem;
    }

    .registro-body {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
    }

    .registro-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .registro-item .label {
      color: #666;
      font-size: 0.8rem;
    }

    .registro-item .value {
      color: #333;
      font-weight: 500;
      font-size: 0.9rem;
    }

    .totales-card {
      background-color: #f8f9fa;
      border-radius: 8px;
      padding: 1rem;
      margin: 1rem 0;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .total-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .total-item .label {
      color: #666;
      font-size: 0.8rem;
    }

    .total-item .value {
      color: #4CAF50;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .resultados {
      margin: 1.5rem 0;
    }

    .total-card {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      background-color: #f8f9fa;
      padding: 1rem;
      border-radius: 8px;
    }

    @media (min-width: 768px) {
      .button-group {
        flex-direction: row;
        gap: 1rem;
      }

      .total-card {
        flex-direction: row;
        gap: 2rem;
        justify-content: center;
        padding: 1.5rem;
      }

      .registro-body {
        grid-template-columns: repeat(4, 1fr);
      }

      .totales-card {
        grid-template-columns: repeat(3, 1fr);
      }
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