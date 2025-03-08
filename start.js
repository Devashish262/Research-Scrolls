/**
 * Research Scrolls Starter Script
 * 
 * This script starts the Research Scrolls application by:
 * 1. Changing to the ResearchScrolls directory
 * 2. Running the development server
 * 
 * Usage: node start.js
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Get the absolute path to the ResearchScrolls directory
const researchScrollsPath = path.join(__dirname, 'ResearchScrolls');

// Check if the directory exists
if (!fs.existsSync(researchScrollsPath)) {
  console.error(`Error: Could not find ResearchScrolls directory at ${researchScrollsPath}`);
  process.exit(1);
}

// Check if package.json exists
const packageJsonPath = path.join(researchScrollsPath, 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error(`Error: Could not find package.json at ${packageJsonPath}`);
  process.exit(1);
}

console.log('Starting Research Scrolls application...');
console.log(`Directory: ${researchScrollsPath}`);

try {
  // Change to the ResearchScrolls directory and run npm
  process.chdir(researchScrollsPath);
  console.log('Running npm run dev...');
  
  // Run the command and pipe output to the console
  execSync('npm run dev', { stdio: 'inherit' });
} catch (error) {
  console.error('Error running the application:', error.message);
  process.exit(1);
} 