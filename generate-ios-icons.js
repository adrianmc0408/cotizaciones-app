const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputFile = 'src/assets/favicon.svg';
const outputDir = 'src/assets/icons';

// Asegurarse de que el directorio de salida existe
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function generateIOSIcon(size) {
    try {
        // Crear un SVG con fondo y esquinas suavemente redondeadas
        const cornerRadius = Math.floor(size * 0.225); // Radio de las esquinas redondeadas (22.5% del tamaño)
        const background = Buffer.from(`
            <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#4CAF50"/>
                        <stop offset="100%" style="stop-color:#45A049"/>
                    </linearGradient>
                </defs>
                <rect
                    width="${size}"
                    height="${size}"
                    rx="${cornerRadius}"
                    ry="${cornerRadius}"
                    fill="url(#iconGradient)"
                />
            </svg>
        `);

        // Calcular el tamaño del icono (85% del tamaño total para mejor proporción)
        const iconSize = Math.floor(size * 0.85);
        const padding = Math.floor((size - iconSize) / 2);

        // Redimensionar el SVG con mejor calidad
        const resizedIcon = await sharp(inputFile)
            .resize(iconSize, iconSize, {
                kernel: sharp.kernel.lanczos3,
                fit: 'contain'
            })
            .toBuffer();

        // Combinar el fondo y el icono con sombra suave
        await sharp(background)
            .composite([{
                input: resizedIcon,
                top: padding,
                left: padding,
                blend: 'over'
            }])
            .toFile(path.join(outputDir, `icon-${size}x${size}.png`));

        console.log(`Icono generado: icon-${size}x${size}.png`);
    } catch (error) {
        console.error(`Error generando ${outputDir}/icon-${size}x${size}.png:`, error);
    }
}

// Generar todos los iconos
Promise.all(sizes.map(size => generateIOSIcon(size)))
    .then(() => console.log('Todos los iconos generados exitosamente'))
    .catch(error => console.error('Error al generar los iconos:', error)); 