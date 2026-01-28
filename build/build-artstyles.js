#!/usr/bin/env node

/**
 * Build Script for Art Styles
 * Dynamically discovers and bundles all art styles
 */

const fs = require('fs');
const path = require('path');

// First, read the BaseArtStyle class
const baseArtStylePath = path.join(__dirname, '..', 'src', 'artstyles', 'BaseArtStyle.js');
const baseArtStyleContent = fs.readFileSync(baseArtStylePath, 'utf8')
    .replace(/export\s+(default\s+)?/g, ''); // Remove export/export default statements

// Discover all art styles
const artstylesDir = path.join(__dirname, '..', 'src', 'artstyles');
const artstyles = {};

// Files to skip
const skipFiles = ['BaseArtStyle.js', 'index.js', 'README.md'];

// Get all art style files
const files = fs.readdirSync(artstylesDir)
    .filter(file => file.endsWith('.js') && !skipFiles.includes(file));

for (const file of files) {
    // Convert filename to art style name (kebab-case to snake_case)
    const styleName = file.replace('.js', '').replace(/-/g, '_');
    artstyles[styleName] = file;
}

// Start building the output
let output = `/**
 * P4RS3LT0NGV3 Art Styles - Bundled for Browser
 * Auto-generated from modular source files
 * Build date: ${new Date().toISOString()}
 * Total art styles: ${Object.keys(artstyles).length}
 */

(function() {
'use strict';

// BaseArtStyle class
${baseArtStyleContent}

const artstyles = {};

`;

// Load and bundle each art style
for (const [name, file] of Object.entries(artstyles)) {
    const fullPath = path.join(artstylesDir, file);
    
    try {
        let content = fs.readFileSync(fullPath, 'utf8');
        
        // Extract the object definition (remove comments, import, and export statements)
        const cleanContent = content
            .replace(/^\/\/.*$/gm, '') // Remove single-line comments
            .replace(/import\s+.*?from\s+['"].*?['"]\s*;?\s*/g, '') // Remove import statements
            .replace(/export default\s*/g, '') // Remove export statement
            .trim();
        
        output += `// ${name} (from ${file})\n`;
        output += `artstyles['${name}'] = ${cleanContent}\n\n`;
        
        console.log(`✅ Bundled: ${name}`);
    } catch (error) {
        console.error(`❌ Error bundling ${name}:`, error.message);
    }
}

// Close the IIFE and expose to window
output += `
// Expose to window
window.artstyles = artstyles;

})();
`;

// Write the bundled file
const outputPath = path.join(__dirname, '..', 'dist', 'js', 'bundles', 'artstyles-bundle.js');
const outputDir = path.dirname(outputPath);

// Ensure the directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, output, 'utf8');

console.log(`\n✨ Bundle created: ${outputPath}`);
console.log(`📦 Size: ${(output.length / 1024).toFixed(2)} KB`);
console.log(`🔢 Total art styles: ${Object.keys(artstyles).length}`);

