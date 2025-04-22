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

  private validarFormatoNumero(numero: string): boolean {
    // Eliminar espacios en blanco
    numero = numero.trim();
    
    // Verificar que solo contenga números, puntos y comas
    if (!/^[\d.,]+$/.test(numero)) {
      return false;
    }
    
    // Verificar que tenga máximo una coma
    if ((numero.match(/,/g) || []).length > 1) {
      return false;
    }
    
    // Verificar que tenga máximo un punto por cada 3 dígitos
    const digitos = numero.replace(/[.,]/g, '').length;
    const puntos = (numero.match(/\./g) || []).length;
    if (puntos > Math.ceil(digitos / 3)) {
      return false;
    }
    
    return true;
  }

  private normalizarNumero(numero: string): number {
    // Eliminar todos los puntos y reemplazar coma por punto
    return parseFloat(numero.replace(/\./g, '').replace(',', '.'));
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
      let numeroLinea = 0;

      // Primera pasada: recolectar todas las transacciones
      for (const linea of lineas) {
        numeroLinea++;
        
        if (linea.match(/^(Lunes|Martes|Miércoles|Jueves|Viernes|Sábado|Domingo)/)) {
          const partes = linea.split(' ');
          if (partes.length < 6) {
            alert(`Error en la línea ${numeroLinea}: Formato de fecha inválido. Debe ser "Día DD de Mes de AAAA"`);
            return;
          }
          const dia = partes[1];
          const mes = partes[3];
          const anio = partes[5];
          const meses: { [key: string]: string } = {
            'Enero': '01', 'Febrero': '02', 'Marzo': '03', 'Abril': '04',
            'Mayo': '05', 'Junio': '06', 'Julio': '07', 'Agosto': '08',
            'Septiembre': '09', 'Octubre': '10', 'Noviembre': '11', 'Diciembre': '12'
          };
          
          if (!meses[mes]) {
            alert(`Error en la línea ${numeroLinea}: Mes "${mes}" no válido`);
            return;
          }
          
          fecha = `${dia.padStart(2, '0')}/${meses[mes]}/${anio}`;
        }

        if (linea.includes('Mi Banco')) {
          // Si ya tenemos una transacción completa, la guardamos
          if (transaccionActual.montoBSS > 0 && transaccionActual.responsable) {
            transacciones.push({...transaccionActual});
          } else if (transaccionActual.montoBSS > 0 || transaccionActual.responsable) {
            alert(`Error en la línea ${numeroLinea}: Transacción incompleta. Faltan datos del responsable o monto`);
            return;
          }
          // Iniciamos una nueva transacción
          transaccionActual = {
            responsable: '',
            montoBSS: 0,
            banco: 'MI BANCO'
          };
        }

        if (linea.includes('Nombre:')) {
          const nombre = linea.split('Nombre:')[1]?.trim();
          if (!nombre) {
            alert(`Error en la línea ${numeroLinea}: Formato de nombre inválido`);
            return;
          }
          transaccionActual.responsable = nombre;
        }

        if (linea.includes('Monto en Bs:')) {
          const montoStr = linea.split('Monto en Bs:')[1]?.trim();
          if (!montoStr) {
            alert(`Error en la línea ${numeroLinea}: Formato de monto inválido`);
            return;
          }
          
          if (!this.validarFormatoNumero(montoStr)) {
            alert(`Error en la línea ${numeroLinea}: El monto "${montoStr}" no tiene el formato correcto. Debe ser un número válido.`);
            return;
          }
          
          const monto = this.normalizarNumero(montoStr);
          if (isNaN(monto)) {
            alert(`Error en la línea ${numeroLinea}: El monto "${montoStr}" no es un número válido`);
            return;
          }
          transaccionActual.montoBSS = monto;
        }

        if (linea.includes('Tasa:')) {
          const tasaStr = linea.split('Tasa:')[1]?.trim();
          if (!tasaStr) {
            alert(`Error en la línea ${numeroLinea}: Formato de tasa inválido`);
            return;
          }
          
          if (!this.validarFormatoNumero(tasaStr)) {
            alert(`Error en la línea ${numeroLinea}: La tasa "${tasaStr}" no tiene el formato correcto. Debe ser un número válido.`);
            return;
          }
          
          const nuevaTasa = this.normalizarNumero(tasaStr);
          if (isNaN(nuevaTasa)) {
            alert(`Error en la línea ${numeroLinea}: La tasa "${tasaStr}" no es un número válido`);
            return;
          }
          tasa = nuevaTasa;
        }
      }

      // Añadir la última transacción si existe
      if (transaccionActual.montoBSS > 0 && transaccionActual.responsable) {
        transacciones.push({...transaccionActual});
      } else if (transaccionActual.montoBSS > 0 || transaccionActual.responsable) {
        alert(`Error en la última transacción: Transacción incompleta. Faltan datos del responsable o monto`);
        return;
      }

      if (transacciones.length === 0) {
        alert('No se encontraron transacciones válidas en el texto');
        return;
      }

      if (tasa === 0) {
        alert('No se encontró la tasa de cambio en el texto');
        return;
      }

      // Segunda pasada: crear registros con la tasa
      for (const transaccion of transacciones) {
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