import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createCanvas, loadImage } from 'canvas';
import svg2img from 'svg2img';

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Source SVG file
const svgPath = path.join(__dirname, '..', 'public', 'cart-icon-color.svg');
const outputDir = path.join(__dirname, '..', 'public');

// Sizes to generate
const sizes = [16, 32, 152, 167, 180, 192, 512];

// Read the SVG file
const svgContent = fs.readFileSync(svgPath, 'utf8');

// Generate PNGs for each size
async function generatePNGs() {
  for (const size of sizes) {
    console.log(`Generating ${size}x${size} icon...`);
    
    // Convert SVG to PNG
    svg2img(svgContent, { width: size, height: size }, (error, buffer) => {
      if (error) {
        console.error(`Error generating ${size}x${size} icon:`, error);
        return;
      }
      
      // Write to file
      const outputPath = path.join(outputDir, `cart-icon-${size}x${size}.png`);
      fs.writeFileSync(outputPath, buffer);
      console.log(`Created ${outputPath}`);
    });
  }
}

// Generate a specific size for browsers that don't support SVG favicons
function generateFavicon() {
  svg2img(svgContent, { width: 32, height: 32 }, (error, buffer) => {
    if (error) {
      console.error('Error generating favicon:', error);
      return;
    }
    
    const outputPath = path.join(outputDir, 'favicon.ico');
    fs.writeFileSync(outputPath, buffer);
    console.log(`Created ${outputPath}`);
  });
}

// Update manifest.json with the correct icons
function updateManifest() {
  const manifestPath = path.join(outputDir, 'manifest.json');
  let manifest;
  
  try {
    const manifestContent = fs.readFileSync(manifestPath, 'utf8');
    manifest = JSON.parse(manifestContent);
  } catch (error) {
    console.log('Creating new manifest.json');
    manifest = {
      name: "GrocerySync",
      short_name: "GrocerySync",
      start_url: "/",
      display: "standalone",
      background_color: "#1a1a1a",
      theme_color: "#1a1a1a",
      icons: []
    };
  }
  
  // Update icons array
  manifest.icons = [
    {
      src: "/cart-icon-192x192.png",
      sizes: "192x192",
      type: "image/png"
    },
    {
      src: "/cart-icon-512x512.png",
      sizes: "512x512",
      type: "image/png"
    }
  ];
  
  // Write updated manifest
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log('Updated manifest.json');
}

// Run the generation process
console.log('Generating favicons...');
generatePNGs();
generateFavicon();
updateManifest();
console.log('Done!'); 