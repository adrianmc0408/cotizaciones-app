import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cotizador',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './cotizador.component.html',
  styleUrls: ['./cotizador.component.scss']
})
export class CotizadorComponent {
  tasa: string = '';
  montoUSD: string = '';
  pagadorSeleccionado: string = '';
  registros: any[] = [];
  tasaBloqueada: boolean = false;

  agregarRegistro() {
    if (!this.tasa || !this.montoUSD || !this.pagadorSeleccionado) {
      alert('Por favor complete todos los campos');
      return;
    }

    const registro = {
      tasa: this.tasa,
      montoUSD: this.montoUSD,
      pagador: this.pagadorSeleccionado
    };

    this.registros.push(registro);
    this.montoUSD = '';
    this.pagadorSeleccionado = '';
    this.tasaBloqueada = true;
  }

  limpiar() {
    this.tasa = '';
    this.montoUSD = '';
    this.pagadorSeleccionado = '';
    this.registros = [];
    this.tasaBloqueada = false;
  }
}
