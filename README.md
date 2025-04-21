# Generador y Procesador de Cotizaciones

Esta es una aplicación web desarrollada en Angular que permite generar y procesar cotizaciones de manera eficiente.

## Características

- Generador de cotizaciones con múltiples pagadores
- Procesador de cotizaciones con cálculo automático de comisiones
- Interfaz moderna y responsiva
- Formateo de números según el estándar venezolano
- Copia automática al portapapeles

## Requisitos Previos

- Node.js (versión 14 o superior)
- Angular CLI
- Cuenta en Firebase

## Instalación

1. Clona este repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd cotizaciones-app
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia la aplicación en modo desarrollo:
```bash
ng serve
```

## Despliegue en Firebase

1. Instala Firebase CLI si no lo tienes:
```bash
npm install -g firebase-tools
```

2. Inicia sesión en Firebase:
```bash
firebase login
```

3. Inicializa Firebase en tu proyecto:
```bash
firebase init
```
   - Selecciona "Hosting"
   - Selecciona tu proyecto de Firebase
   - Usa "dist/cotizaciones-app" como directorio público
   - Configura como SPA (Single Page Application)
   - No sobrescribas el index.html

4. Construye la aplicación para producción:
```bash
ng build --configuration production
```

5. Despliega en Firebase:
```bash
firebase deploy
```

## Estructura del Proyecto

- `src/app/app.component.ts` - Componente principal con el generador de cotizaciones
- `src/app/procesador/procesador.component.ts` - Componente para procesar cotizaciones
- `src/assets/` - Recursos estáticos
- `src/environments/` - Configuraciones de entorno

## Uso

### Generador de Cotizaciones
1. Ingresa la tasa de cambio
2. Ingresa el monto en USD
3. Selecciona el pagador
4. Haz clic en "Agregar" para incluir el registro
5. Usa "Finalizar y Copiar" para generar el mensaje final

### Procesador de Cotizaciones
1. Pega el texto de la cotización
2. Haz clic en "Procesar"
3. Usa los botones de copiar según necesites

## Contribución

Las contribuciones son bienvenidas. Por favor, abre un issue para discutir los cambios propuestos.

## Licencia

Este proyecto está bajo la Licencia MIT.
