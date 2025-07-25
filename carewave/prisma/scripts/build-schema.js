// buildSchema.js
const fs = require('fs').promises;
const path = require('path');

const PRISMA_DIR = path.join(__dirname, '..');
const MODULES_DIR = path.join(PRISMA_DIR, 'modules');
const OUTPUT_FILE = path.join(PRISMA_DIR, 'schema.prisma');

// List of all module files in order
const MODULE_FILES = [
  'dashboard.prisma',
  'home.prisma',
  'login.prisma',
  'register.prisma',
  'doctor.prisma',
  'nursing.prisma',
  'system-admin.prisma',
  'social-service.prisma',
  'incentive.prisma',
  'patients.prisma',
  'medical-records.prisma',
    'history-taking.prisma',
  'adt.prisma',
  'queue-mgmt.prisma',
  'clinical.prisma',
  'appointments.prisma',
  'emergency.prisma',
  'maternity.prisma',
  'vaccination.prisma',
  'operation-theatre.prisma',
  'laboratory.prisma',
  'radiology.prisma',
  'pharmacy.prisma',
  'dispensary.prisma',
  'cssd.prisma',
  'helpdesk.prisma',
  'utilities.prisma',
  'settings.prisma',
  'verification.prisma',
  'billing.prisma',
  'accounting.prisma',
  'claim-mgmt.prisma',
  'nhif.prisma',
  'inventory.prisma',
  'procurement.prisma',
  'substore.prisma',
  'fixed-assets.prisma',
  'departments.prisma',
  'reports.prisma',
  'dynamic-report.prisma',
  'mkt-referral.prisma'
];

// Base schema with generator and datasource
const BASE_SCHEMA = `// =========================================
// AUTO-GENERATED PRISMA SCHEMA
// DO NOT EDIT THIS FILE DIRECTLY!
// Edit individual module files in /modules instead
// Generated at: ${new Date().toISOString()}
// =========================================

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

`;

async function buildSchema() {
  console.log('🔨 Building Prisma schema from modules...');
  
  let schemaContent = BASE_SCHEMA;
  let processedFiles = 0;
  
  for (const moduleFile of MODULE_FILES) {
    const modulePath = path.join(MODULES_DIR, moduleFile);
    
    try {
      const moduleContent = await fs.readFile(modulePath, 'utf8');
      const cleanContent = cleanModuleContent(moduleContent);
      
      if (cleanContent.trim()) {
        schemaContent += `\n// =========================================\n`;
        schemaContent += `// ${moduleFile.replace('.prisma', '').toUpperCase().replace('-', ' ')}\n`;
        schemaContent += `// =========================================\n\n`;
        schemaContent += cleanContent;
        schemaContent += '\n';
        processedFiles++;
        console.log(`📄 Processing: ${moduleFile}`);
      }
    } catch (error) {
      console.warn(`⚠️  Module file ${moduleFile} not found - skipping`);
    }
  }
  
  // Write the combined schema
  await fs.writeFile(OUTPUT_FILE, schemaContent);
  
  const totalLines = schemaContent.split('\n').length;
  console.log(`✅ Schema built successfully!`);
  console.log(`📊 Processed ${processedFiles} modules`);
  console.log(`📏 Total lines: ${totalLines}`);
  console.log(`💾 Output: ${OUTPUT_FILE}`);
}

// Clean module content - remove generator/datasource if present
function cleanModuleContent(content) {
  const lines = content.split('\n');
  const cleanLines = [];
  let skipBlock = false;
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip generator and datasource blocks
    if (trimmed.startsWith('generator ') || trimmed.startsWith('datasource ')) {
      skipBlock = true;
      continue;
    }
    
    // End of block
    if (skipBlock && trimmed === '}') {
      skipBlock = false;
      continue;
    }
    
    // Skip lines inside generator/datasource blocks
    if (skipBlock) {
      continue;
    }
    
    cleanLines.push(line);
  }
  
  return cleanLines.join('\n').trim();
}

// Run the build
async function main() {
  try {
    await buildSchema();
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

main();