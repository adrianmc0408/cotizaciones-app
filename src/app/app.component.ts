import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProcesadorComponent } from './procesador/procesador.component';

interface Pagador {
  nombre: string;
  cuenta: string;
}

interface Registro {
  pagador: string;
  usd: number;
  bs: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, ProcesadorComponent],
  template: `
    <div class="app-container">
      <header>
        <div class="header-content">
          <div class="logo">
            <h1>Cotizaciones App</h1>
            <span class="subtitle">Gestión de cotizaciones</span>
          </div>
          <nav>
            <div class="nav-buttons">
              <button (click)="mostrarGenerador = true" [class.active]="mostrarGenerador">
                <span class="icon">📝</span>
                <span class="text">Generador</span>
              </button>
              <button (click)="mostrarGenerador = false" [class.active]="!mostrarGenerador">
                <span class="icon">📊</span>
                <span class="text">Procesador</span>
              </button>
            </div>
          </nav>
        </div>
      </header>

      <main>
        <div *ngIf="mostrarGenerador" class="card-container">
          <div class="card">
            <h2>Generador de Cotizaciones</h2>
            
            <div class="form-group">
              <label>Tasa de cambio</label>
              <input type="text" [(ngModel)]="tasa" placeholder="Ej: 35,50">
            </div>

            <div class="form-group">
              <label>Monto en USD</label>
              <input type="text" [(ngModel)]="montoUSD" placeholder="Ej: 100">
            </div>

            <div class="form-group">
              <label>Pagador</label>
              <select [(ngModel)]="pagadorSeleccionado">
                <option value="">Seleccione un pagador</option>
                <option *ngFor="let pagador of pagadores" [value]="pagador.nombre">
                  {{pagador.nombre}}
                </option>
              </select>
            </div>

            <div class="button-group">
              <button class="primary" (click)="agregarRegistro()">Agregar</button>
              <button class="secondary" (click)="finalizar()">Finalizar y Copiar</button>
              <button class="danger" (click)="limpiar()">Limpiar</button>
            </div>
          </div>

          <div class="card" *ngIf="registros.length > 0">
            <h3>Registros</h3>
            <div class="registros-list">
              <div class="registro-item" *ngFor="let registro of registros">
                <div class="registro-header">
                  <span class="pagador">{{registro.pagador}}</span>
                  <span class="monto">{{formatearNumero(registro.usd)}} USD</span>
                </div>
                <div class="registro-details">
                  <span class="total">{{formatearNumero(registro.bs)}} Bs</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <app-procesador *ngIf="!mostrarGenerador"></app-procesador>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background-color: #f5f5f5;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    header {
      background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
      padding: 1.5rem 2rem;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      color: white;
    }

    h1 {
      color: white;
      margin: 0;
      font-size: 1.8rem;
      font-weight: 600;
    }

    .subtitle {
      font-size: 0.9rem;
      opacity: 0.9;
    }

    nav {
      display: flex;
      align-items: center;
    }

    .nav-buttons {
      display: flex;
      gap: 1rem;
      background-color: rgba(255, 255, 255, 0.1);
      padding: 0.5rem;
      border-radius: 50px;
      backdrop-filter: blur(10px);
    }

    .nav-buttons button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 25px;
      background: transparent;
      color: white;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 500;
    }

    .nav-buttons button:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }

    .nav-buttons button.active {
      background-color: white;
      color: #4CAF50;
    }

    .nav-buttons button .icon {
      font-size: 1.2rem;
    }

    .nav-buttons button .text {
      font-size: 0.9rem;
    }

    main {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .card-container {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .card {
      background-color: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    h2 {
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

    input, select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 1rem;
      transition: border-color 0.3s ease;
    }

    input:focus, select:focus {
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

    .registros-list {
      margin-top: 1rem;
    }

    .registro-item {
      background-color: #f8f9fa;
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 1rem;
    }

    .registro-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }

    .pagador {
      font-weight: 500;
      color: #333;
    }

    .monto {
      color: #4CAF50;
      font-weight: 600;
    }

    .registro-details {
      text-align: right;
    }

    .total {
      color: #666;
      font-size: 0.9rem;
    }
  `]
})
export class AppComponent {
  mostrarGenerador = true;
  tasa: string = '';
  montoUSD: string = '';
  pagadorSeleccionado: string = '';
  registros: Registro[] = [];

  pagadores: Pagador[] = [
    {
      nombre: "Grupo Centígrado CA",
      cuenta: "Cuenta jurídica\nCuenta: 01690001071001476989\nNombre: Grupo Centígrado CA\nRif: J-502088520"
    },
    {
      nombre: "Jorge Ramírez",
      cuenta: "Cuenta: Corriente\nNúmero: 01690001051001457585\nNombre: Jorge Ramírez"
    },
    {
      nombre: "Aj Producciones CA",
      cuenta: "Cuenta jurídica\nNombre: Aj Producciones CA\nRif: J-401862926\nCuenta: 01690001011001445889"
    },
    {
      nombre: "Axel Buchszer",
      cuenta: "Cuenta: 0169-0001-04-1001493530\nNombre: Axel Buchszer.\nC.I.: V-21127103"
    },
    {
      nombre: "Lorena Centeno",
      cuenta: "Cuenta Personal\nNombre: Lorena Centeno\nCuenta: 01690001011001469478\nCedula: 19782093"
    }
  ];

  formatearNumero(valor: number): string {
    return valor.toLocaleString('es-VE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  agregarRegistro() {
    if (!this.tasa || !this.montoUSD || !this.pagadorSeleccionado) {
      alert('Por favor complete todos los campos');
      return;
    }

    const usd = parseFloat(this.montoUSD.replace(',', '.'));
    const tasa = parseFloat(this.tasa.replace(',', '.'));
    const bs = usd * tasa;

    this.registros.push({
      pagador: this.pagadorSeleccionado,
      usd: usd,
      bs: bs
    });

    this.montoUSD = '';
  }

  finalizar() {
    if (this.registros.length === 0) {
      alert('Agregue al menos un registro');
      return;
    }

    const fecha = new Date();
    const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const fechaFormateada = `${diasSemana[fecha.getDay()]} ${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}`;

    let mensaje = `${fechaFormateada}\n\nPARTE ZELLE\n\n`;
    let totalUSD = 0;

    for (const registro of this.registros) {
      const pagador = this.pagadores.find(p => p.nombre === registro.pagador);
      if (pagador) {
        mensaje += `Mi Banco\n${pagador.cuenta}\nMonto en Bs: ${this.formatearNumero(registro.bs)}\n\n`;
      }
      totalUSD += registro.usd;
    }

    mensaje += `Tasa: ${this.formatearNumero(parseFloat(this.tasa.replace(',', '.')))}\nMonto total: ${this.formatearNumero(totalUSD)} USD`;

    navigator.clipboard.writeText(mensaje)
      .then(() => alert('Mensaje copiado al portapapeles'))
      .catch(err => alert('Error al copiar al portapapeles'));
  }

  limpiar() {
    this.tasa = '';
    this.montoUSD = '';
    this.pagadorSeleccionado = '';
    this.registros = [];
  }
}
