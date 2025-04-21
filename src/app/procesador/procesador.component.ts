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
  templateUrl: './procesador.component.html',
  styleUrls: ['./procesador.component.scss']
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
      let tasa = 0;
      let transacciones: any[] = [];
      let transaccionActual = {
        responsable: '',
        montoBSS: 0,
        banco: 'MI BANCO'
      };

      // Primera pasada: recolectar todas las transacciones
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

        if (linea.includes('Mi Banco')) {
          // Si ya tenemos una transacción completa, la guardamos
          if (transaccionActual.montoBSS > 0 && transaccionActual.responsable) {
            transacciones.push({...transaccionActual});
          }
          // Iniciamos una nueva transacción
          transaccionActual = {
            responsable: '',
            montoBSS: 0,
            banco: 'MI BANCO'
          };
        }

        if (linea.includes('Nombre:')) {
          transaccionActual.responsable = linea.split('Nombre:')[1].trim();
        }

        if (linea.includes('Monto en Bs:')) {
          const monto = parseFloat(linea.split('Monto en Bs:')[1].replace(/\./g, '').replace(',', '.').trim());
          if (!isNaN(monto)) {
            transaccionActual.montoBSS = monto;
          }
        }

        if (linea.includes('Tasa:')) {
          tasa = parseFloat(linea.split('Tasa:')[1].replace(',', '.').trim());
        }
      }

      // Añadir la última transacción si existe
      if (transaccionActual.montoBSS > 0 && transaccionActual.responsable) {
        transacciones.push({...transaccionActual});
      }

      // Segunda pasada: crear registros con la tasa
      for (const transaccion of transacciones) {
        if (tasa > 0) {
          const montoUSD = transaccion.montoBSS / tasa;
          this.totalBSS += transaccion.montoBSS;
          this.totalUSD += montoUSD;

          this.registros.push({
            fecha,
            montoBSS: transaccion.montoBSS,
            tasa,
            montoUSD,
            banco: transaccion.banco,
            empresa,
            responsable: transaccion.responsable
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