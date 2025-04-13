/**
 * Icon generator for GrocerySync PWA
 * This script generates all the necessary icon sizes for PWA from the SVG icon
 * 
 * Usage: node generate-icons.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

// Get the current file URL and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const ICON_SIZES = [
  16, 32, 48, 72, 96, 120, 144, 152, 167, 180, 192, 384, 512
];
const SVG_SOURCE = path.resolve(__dirname, '../public/cart-icon-color.svg');
const OUTPUT_DIR = path.resolve(__dirname, '../public');

async function generateIcons() {
  try {
    console.log('Starting icon generation...');

    // Make sure the SVG source exists
    if (!fs.existsSync(SVG_SOURCE)) {
      console.error(`Source SVG not found: ${SVG_SOURCE}`);
      process.exit(1);
    }

    // Read the SVG file
    const svgContent = fs.readFileSync(SVG_SOURCE, 'utf8');
    
    // Generate each icon size
    for (const size of ICON_SIZES) {
      const outputFile = path.join(OUTPUT_DIR, `cart-icon-${size}x${size}.png`);
      console.log(`Generating ${size}x${size} icon...`);
      
      await sharp(Buffer.from(svgContent))
        .resize(size, size)
        .png()
        .toFile(outputFile);
      
      console.log(`Created: ${outputFile}`);
    }

    console.log('Icon generation complete!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

// Main execution
console.log('GrocerySync Icon Generator');
console.log('-------------------------');
generateIcons();

// Export for potential programmatic use
export { generateIcons }; 