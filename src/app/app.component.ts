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
            <h1>Adi's Exchange Hub</h1>
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
              <input type="text" [(ngModel)]="tasa" placeholder="Ej: 35,50" [disabled]="tasaBloqueada">
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
      background-color: #4CAF50;
      padding: 1rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .logo {
      color: white;
      text-align: center;
    }

    h1 {
      color: white;
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .subtitle {
      font-size: 0.8rem;
      opacity: 0.9;
    }

    nav {
      display: flex;
      justify-content: center;
    }

    .nav-buttons {
      display: flex;
      gap: 0.5rem;
      background-color: rgba(255, 255, 255, 0.1);
      padding: 0.5rem;
      border-radius: 50px;
      backdrop-filter: blur(10px);
      width: 100%;
      max-width: 300px;
    }

    .nav-buttons button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 25px;
      background: transparent;
      color: white;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 500;
      flex: 1;
    }

    .nav-buttons button:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }

    .nav-buttons button.active {
      background-color: white;
      color: #4CAF50;
    }

    .nav-buttons button .icon {
      font-size: 1rem;
    }

    .nav-buttons button .text {
      font-size: 0.8rem;
    }

    main {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem;
    }

    .card-container {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .card {
      background-color: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    h2 {
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

    input, select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s ease;
      background-color: #f8f9fa;
      box-sizing: border-box;
    }

    input:focus, select:focus {
      outline: none;
      border-color: #4CAF50;
      background-color: white;
    }

    .button-group {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-top: 1.5rem;
    }

    button {
      padding: 0.75rem;
      border: none;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.9rem;
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
      margin-bottom: 0.75rem;
    }

    .registro-header {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .pagador {
      font-weight: 500;
      color: #333;
      font-size: 0.9rem;
    }

    .monto {
      color: #4CAF50;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .registro-details {
      text-align: right;
    }

    .total {
      color: #666;
      font-size: 0.8rem;
    }

    @media (min-width: 768px) {
      header {
        padding: 1.5rem 2rem;
      }

      .header-content {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }

      .logo {
        text-align: left;
      }

      h1 {
        font-size: 1.8rem;
      }

      .subtitle {
        font-size: 0.9rem;
      }

      .nav-buttons {
        width: auto;
      }

      .nav-buttons button {
        padding: 0.75rem 1.5rem;
      }

      main {
        padding: 2rem;
      }

      .card-container {
        gap: 2rem;
      }

      .card {
        padding: 2rem;
      }

      h2 {
        font-size: 1.5rem;
        margin-bottom: 1.5rem;
      }

      .button-group {
        flex-direction: row;
        gap: 1rem;
      }

      .registro-header {
        flex-direction: row;
        justify-content: space-between;
      }
    }
  `]
})
export class AppComponent {
  mostrarGenerador = true;
  tasa: string = '';
  montoUSD: string = '';
  pagadorSeleccionado: string = '';
  registros: Registro[] = [];
  tasaBloqueada: boolean = false;

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
    this.pagadorSeleccionado = '';
    this.tasaBloqueada = true;
  }

  finalizar() {
    if (this.registros.length === 0) {
      alert('Agregue al menos un registro');
      return;
    }

    const fecha = new Date();
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
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
    this.tasaBloqueada = false;
  }
}
