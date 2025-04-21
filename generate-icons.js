const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputFile = 'src/assets/favicon.svg';
const outputDir = 'src/assets/icons';

// Asegurar que el directorio de salida existe
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Generar cada tamaño de icono
sizes.forEach(size => {
    const outputFile = path.join(outputDir, `icon-${size}x${size}.png`);
    try {
        execSync(`svgexport ${inputFile} ${outputFile} ${size}:${size}`);
        console.log(`Generated ${outputFile}`);
    } catch (error) {
        console.error(`Error generating ${outputFile}:`, error);
    }
}); 