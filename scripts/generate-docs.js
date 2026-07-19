#!/usr/bin/env node

/**
 * Generic documentation generation script for GridStack.js
 * Generates both HTML and Markdown documentation for the main library and Angular components
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  // Main library paths
  mainLib: {
    root: '.',
    typedocConfig: 'typedoc.json',
    typedocHtmlConfig: 'typedoc.html.json',
    outputDir: 'doc'
  },
  
  // Angular library paths
  angular: {
    root: 'angular',
    typedocConfig: 'typedoc.json',
    typedocHtmlConfig: 'typedoc.html.json',
    outputDir: 'doc'
  },

  // React library paths
  react: {
    root: 'react',
    typedocConfig: 'typedoc.json',
    typedocHtmlConfig: 'typedoc.html.json',
    outputDir: 'doc'
  },

  // Vue library paths
  vue: {
    root: 'vue',
    typedocConfig: 'typedoc.json',
    typedocHtmlConfig: 'typedoc.html.json',
    outputDir: 'doc'
  },
  
  // Output configuration
  output: {
    cleanup: true,
    verbose: true
  }
};

/**
 * Execute a command and handle errors
 * @param {string} command - Command to execute
 * @param {string} cwd - Working directory
 * @param {string} description - Description for logging
 */
function execCommand(command, cwd = '.', description = '') {
  if (config.output.verbose) {
    console.log(`\n📋 ${description || command}`);
    console.log(`   Working directory: ${cwd}`);
    console.log(`   Command: ${command}`);
  }
  
  try {
    const result = execSync(command, { 
      cwd, 
      stdio: config.output.verbose ? 'inherit' : 'pipe',
      encoding: 'utf8'
    });
    
    if (config.output.verbose) {
      console.log(`✅ Success`);
    }
    
    return result;
  } catch (error) {
    console.error(`❌ Error executing: ${command}`);
    console.error(`   Working directory: ${cwd}`);
    console.error(`   Error: ${error.message}`);
    
    if (error.stdout) {
      console.error(`   Stdout: ${error.stdout}`);
    }
    if (error.stderr) {
      console.error(`   Stderr: ${error.stderr}`);
    }
    
    throw error;
  }
}

/**
 * Check if a file exists
 * @param {string} filePath - Path to check
 * @returns {boolean}
 */
function fileExists(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}

/**
 * Generate documentation for a library
 * @param {Object} libConfig - Library configuration
 * @param {string} libName - Library name for logging
 */
function generateLibraryDocs(libConfig, libName) {
  const { root, typedocConfig, typedocHtmlConfig } = libConfig;
  
  console.log(`\n🔧 Generating documentation for ${libName}...`);
  
  // Check if TypeDoc config files exist
  const markdownConfigPath = path.join(root, typedocConfig);
  const htmlConfigPath = path.join(root, typedocHtmlConfig);
  
  if (!fileExists(markdownConfigPath)) {
    console.warn(`⚠️  Markdown config not found: ${markdownConfigPath}`);
  }
  
  if (!fileExists(htmlConfigPath)) {
    console.warn(`⚠️  HTML config not found: ${htmlConfigPath}`);
  }
  
  // Generate Markdown documentation
  if (fileExists(markdownConfigPath)) {
    execCommand(
      `npx typedoc --options ${typedocConfig}`,
      root,
      `Generating Markdown docs for ${libName}`
    );
    
    // Remove _media directory if it exists (not needed for API markdown docs)
    const mediaPath = path.join(root, libConfig.outputDir, 'api', '_media');
    if (fs.existsSync(mediaPath)) {
      execCommand(
        `rm -rf ${path.join(libConfig.outputDir, 'api', '_media')}`,
        root,
        `Removing _media directory for ${libName}`
      );
    }
  }
  
  // Generate HTML documentation
  if (fileExists(htmlConfigPath)) {
    execCommand(
      `npx typedoc --options ${typedocHtmlConfig}`,
      root,
      `Generating HTML docs for ${libName}`
    );
  }
  
  console.log(`✅ ${libName} documentation generated successfully`);
}

/**
 * Run post-processing scripts if they exist
 */
function runPostProcessing() {
  console.log(`\n🔧 Running post-processing...`);
  
  // Main library post-processing
  if (fileExists('scripts/reorder-docs.js')) {
    execCommand(
      'node scripts/reorder-docs.js',
      '.',
      'Reordering Markdown documentation'
    );
  }
  
  if (fileExists('scripts/reorder-html-docs.js')) {
    execCommand(
      'node scripts/reorder-html-docs.js',
      '.',
      'Reordering HTML documentation'
    );
  }
  
  console.log(`✅ Post-processing completed`);
}

/**
 * Clean up old documentation if requested
 */
function cleanup() {
  if (!config.output.cleanup) return;
  
  console.log(`\n🧹 Cleaning up old documentation...`);
  
  // Clean main library docs (API.md and HTML docs)
  const mainDocsPath = path.join(config.mainLib.root, config.mainLib.outputDir);
  if (fs.existsSync(mainDocsPath)) {
    execCommand(`rm -rf ${mainDocsPath}/classes ${mainDocsPath}/interfaces ${mainDocsPath}/type-aliases ${mainDocsPath}/variables`, '.', 'Cleaning main library markdown docs');
  }
  
  // Clean HTML docs
  if (fs.existsSync('doc/html')) {
    execCommand(`rm -rf doc/html`, '.', 'Cleaning main library HTML docs');
  }
  
  // Clean Angular docs
  const angularDocsPath = path.join(config.angular.root, config.angular.outputDir);
  if (fs.existsSync(angularDocsPath)) {
    execCommand(`rm -rf ${angularDocsPath}`, config.angular.root, 'Cleaning Angular library docs');
  }

  // Clean React docs
  const reactDocsPath = path.join(config.react.root, config.react.outputDir);
  if (fs.existsSync(reactDocsPath)) {
    execCommand(`rm -rf ${reactDocsPath}`, config.react.root, 'Cleaning React library docs');
  }

  // Clean Vue docs
  const vueDocsPath = path.join(config.vue.root, config.vue.outputDir);
  if (fs.existsSync(vueDocsPath)) {
    execCommand(`rm -rf ${vueDocsPath}`, config.vue.root, 'Cleaning Vue library docs');
  }
  
  console.log(`✅ Cleanup completed`);
}

/**
 * Display help information
 */
function showHelp() {
  console.log(`
📚 GridStack Documentation Generator

Usage: node scripts/generate-docs.js [options]

Options:
  --main-only       Generate only main library documentation
  --angular-only    Generate only Angular library documentation
  --react-only      Generate only React library documentation
  --vue-only        Generate only Vue library documentation
  --no-cleanup      Skip cleanup of existing documentation
  --quiet           Reduce output verbosity
  --help, -h        Show this help message

Examples:
  node scripts/generate-docs.js                    # Generate all documentation
  node scripts/generate-docs.js --main-only        # Main library only
  node scripts/generate-docs.js --angular-only     # Angular library only
  node scripts/generate-docs.js --react-only       # React library only
  node scripts/generate-docs.js --vue-only         # Vue library only
  node scripts/generate-docs.js --no-cleanup       # Keep existing docs

Environment:
  NODE_ENV          Set to 'development' for verbose output
  `);
}

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    mainOnly: false,
    angularOnly: false,
    reactOnly: false,
    vueOnly: false,
    cleanup: true,
    verbose: process.env.NODE_ENV === 'development'
  };
  
  for (const arg of args) {
    switch (arg) {
      case '--main-only':
        options.mainOnly = true;
        break;
      case '--angular-only':
        options.angularOnly = true;
        break;
      case '--react-only':
        options.reactOnly = true;
        break;
      case '--vue-only':
        options.vueOnly = true;
        break;
      case '--no-cleanup':
        options.cleanup = false;
        break;
      case '--quiet':
        options.verbose = false;
        break;
      case '--help':
      case '-h':
        showHelp();
        process.exit(0);
        break;
      default:
        console.warn(`⚠️  Unknown argument: ${arg}`);
    }
  }
  
  return options;
}

/**
 * Main execution function
 */
function main() {
  const options = parseArgs();
  
  // Update config with options
  config.output.cleanup = options.cleanup;
  config.output.verbose = options.verbose;

  // Determine which libraries to build
  const onlyFlag = options.mainOnly || options.angularOnly || options.reactOnly || options.vueOnly;
  const buildMain    = !onlyFlag || options.mainOnly;
  const buildAngular = !onlyFlag || options.angularOnly;
  const buildReact   = !onlyFlag || options.reactOnly;
  const buildVue     = !onlyFlag || options.vueOnly;
  
  console.log(`🚀 GridStack Documentation Generator`);
  console.log(`   Main library: ${buildMain}`);
  console.log(`   Angular library: ${buildAngular}`);
  console.log(`   React library: ${buildReact}`);
  console.log(`   Vue library: ${buildVue}`);
  console.log(`   Cleanup: ${config.output.cleanup}`);
  console.log(`   Verbose: ${config.output.verbose}`);
  
  try {
    // Cleanup if requested
    if (config.output.cleanup) {
      cleanup();
    }
    
    // Generate main library documentation
    if (buildMain) {
      generateLibraryDocs(config.mainLib, 'Main Library');
    }
    
    // Generate Angular library documentation
    if (buildAngular) {
      generateLibraryDocs(config.angular, 'Angular Library');
    }

    // Generate React library documentation
    if (buildReact) {
      generateLibraryDocs(config.react, 'React Library');
    }

    // Generate Vue library documentation
    if (buildVue) {
      generateLibraryDocs(config.vue, 'Vue Library');
    }
    
    // Run post-processing (main library reorder scripts)
    if (buildMain) {
      runPostProcessing();
    }
    
    console.log(`\n🎉 Documentation generation completed successfully!`);
    console.log(`\nGenerated documentation:`);
    
    if (buildMain) {
      console.log(`   📄 Main Library Markdown: doc/API.md`);
      console.log(`   🌐 Main Library HTML: doc/html/`);
    }
    if (buildAngular) {
      console.log(`   📄 Angular Library Markdown: angular/doc/api/`);
      console.log(`   🌐 Angular Library HTML: angular/doc/html/`);
    }
    if (buildReact) {
      console.log(`   📄 React Library Markdown: react/doc/api/`);
      console.log(`   🌐 React Library HTML: react/doc/html/`);
    }
    if (buildVue) {
      console.log(`   📄 Vue Library Markdown: vue/doc/api/`);
      console.log(`   🌐 Vue Library HTML: vue/doc/html/`);
    }
    
  } catch (error) {
    console.error(`\n💥 Documentation generation failed!`);
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  generateLibraryDocs,
  config
};
