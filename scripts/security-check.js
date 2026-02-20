#!/usr/bin/env node

/**
 * Script de validación de seguridad para EcoCupon
 * Verifica posibles vulnerabilidades y malas prácticas
 * 
 * Uso: node scripts/security-check.js
 */

const fs = require('fs')
const path = require('path')

// Colores para output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

let errors = 0
let warnings = 0
let passed = 0

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`)
}

function checkFile(filePath, checks) {
  const content = fs.readFileSync(filePath, 'utf8')
  const relativePath = path.relative(process.cwd(), filePath)
  
  checks.forEach(({ pattern, message, type = 'error' }) => {
    const regex = new RegExp(pattern, 'gi')
    const matches = content.match(regex)
    
    if (matches) {
      if (type === 'error') {
        errors++
        log(`❌ ERROR: ${relativePath}`, colors.red)
        log(`   ${message}`, colors.red)
        log(`   Patrón: ${pattern}`, colors.red)
      } else {
        warnings++
        log(`⚠️  WARNING: ${relativePath}`, colors.yellow)
        log(`   ${message}`, colors.yellow)
      }
    } else {
      passed++
    }
  })
}

function checkEnvFile() {
  const envExamplePath = path.join(process.cwd(), '.env.example')
  const envLocalPath = path.join(process.cwd(), '.env.local')
  
  log('\n📄 Verificando archivos de entorno...', colors.cyan)
  
  if (!fs.existsSync(envExamplePath)) {
    log('❌ ERROR: No existe .env.example', colors.red)
    errors++
  } else {
    passed++
  }
  
  if (fs.existsSync(envLocalPath)) {
    const content = fs.readFileSync(envLocalPath, 'utf8')
    
    // Verificar si hay valores reales (no placeholders)
    const hasRealValues = !content.includes('tu-') && 
                          !content.includes('YOUR_') && 
                          !content.includes('<') &&
                          !content.includes('CHANGE_ME')
    
    if (hasRealValues && content.includes('=')) {
      log('⚠️  WARNING: .env.local parece tener valores reales', colors.yellow)
      log('   Asegúrate de que esté en .gitignore', colors.yellow)
      warnings++
    } else {
      passed++
    }
  }
}

function checkGitignore() {
  const gitignorePath = path.join(process.cwd(), '.gitignore')
  
  log('\n📋 Verificando .gitignore...', colors.cyan)
  
  if (!fs.existsSync(gitignorePath)) {
    log('❌ ERROR: No existe .gitignore', colors.red)
    errors++
    return
  }
  
  const content = fs.readFileSync(gitignorePath, 'utf8')
  const requiredPatterns = [
    '.env.local',
    '.env*.local',
    'node_modules',
    '.next',
  ]
  
  requiredPatterns.forEach(pattern => {
    if (!content.includes(pattern)) {
      log(`❌ ERROR: .gitignore no incluye: ${pattern}`, colors.red)
      errors++
    } else {
      passed++
    }
  })
}

function checkSensitivePatterns() {
  log('\n🔍 Buscando patrones sensibles...', colors.cyan)
  
  const sensitiveChecks = [
    {
      pattern: /AKIA[0-9A-Z]{16}/,
      message: 'Posible AWS Access Key ID encontrado',
    },
    {
      pattern: /-----BEGIN (RSA |EC |DSA )?PRIVATE KEY-----/,
      message: 'Clave privada encontrada en el código',
    },
    {
      pattern: /ghp_[a-zA-Z0-9]{36}/,
      message: 'Posible GitHub Personal Access Token',
    },
    {
      pattern: /xox[baprs]-[0-9a-zA-Z]{10,48}/,
      message: 'Posible Slack Token',
    },
    {
      pattern: /AIza[0-9A-Za-z\-_]{35}/,
      message: 'Posible Google API Key',
    },
  ]
  
  const filesToCheck = []
  
  function walkDir(dir) {
    const files = fs.readdirSync(dir)
    
    files.forEach(file => {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)
      
      if (stat.isDirectory() && 
          !file.startsWith('.') && 
          file !== 'node_modules' &&
          file !== '.next') {
        walkDir(filePath)
      } else if (stat.isFile() && 
                 (file.endsWith('.ts') || file.endsWith('.tsx') || 
                  file.endsWith('.js') || file.endsWith('.jsx'))) {
        filesToCheck.push(filePath)
      }
    })
  }
  
  walkDir(process.cwd())
  checkFileForSensitivePatterns(filesToCheck, sensitiveChecks)
}

function checkFileForSensitivePatterns(files, checks) {
  files.forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf8')
    const relativePath = path.relative(process.cwd(), filePath)
    
    checks.forEach(({ pattern, message }) => {
      if (pattern.test(content)) {
        errors++
        log(`❌ ERROR: ${relativePath}`, colors.red)
        log(`   ${message}`, colors.red)
      }
    })
  })
}

function checkDependencies() {
  log('\n📦 Verificando dependencias...', colors.cyan)
  
  const packageJsonPath = path.join(process.cwd(), 'package.json')
  
  if (!fs.existsSync(packageJsonPath)) {
    log('❌ ERROR: No existe package.json', colors.red)
    errors++
    return
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  
  // Verificar versiones fijas vs rangos
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies }
  
  let fixedVersions = 0
  let rangeVersions = 0
  
  Object.entries(deps).forEach(([name, version]) => {
    if (typeof version === 'string') {
      if (version.startsWith('^') || version.startsWith('~')) {
        rangeVersions++
      } else if (/^\d+\.\d+\.\d+$/.test(version)) {
        fixedVersions++
      }
    }
  })
  
  log(`   Dependencias con versión fija: ${fixedVersions}`, colors.blue)
  log(`   Dependencias con rango: ${rangeVersions}`, colors.blue)
  
  if (fixedVersions > rangeVersions * 2) {
    log('⚠️  WARNING: Muchas dependencias con versión fija', colors.yellow)
    log('   Considera usar ^ o ~ para actualizaciones automáticas', colors.yellow)
    warnings++
  } else {
    passed++
  }
}

function checkSecurityHeaders() {
  log('\n🔒 Verificando headers de seguridad...', colors.cyan)
  
  const nextConfigPath = path.join(process.cwd(), 'next.config.mjs')
  
  if (!fs.existsSync(nextConfigPath)) {
    log('❌ ERROR: No existe next.config.mjs', colors.red)
    errors++
    return
  }
  
  const content = fs.readFileSync(nextConfigPath, 'utf8')
  
  const requiredHeaders = [
    { name: 'Strict-Transport-Security', pattern: /Strict-Transport-Security/ },
    { name: 'X-Frame-Options', pattern: /X-Frame-Options/ },
    { name: 'X-Content-Type-Options', pattern: /X-Content-Type-Options/ },
    { name: 'X-XSS-Protection', pattern: /X-XSS-Protection/ },
  ]
  
  requiredHeaders.forEach(({ name, pattern }) => {
    if (pattern.test(content)) {
      log(`   ✅ ${name} configurado`, colors.green)
      passed++
    } else {
      log(`   ❌ ${name} NO configurado`, colors.red)
      errors++
    }
  })
}

function printSummary() {
  log('\n' + '='.repeat(50), colors.cyan)
  log('📊 RESUMEN DE SEGURIDAD', colors.cyan)
  log('='.repeat(50), colors.cyan)
  log(`✅ Pasados: ${passed}`, colors.green)
  log(`⚠️  Advertencias: ${warnings}`, colors.yellow)
  log(`❌ Errores: ${errors}`, colors.red)
  log('='.repeat(50), colors.cyan)
  
  if (errors > 0) {
    log('\n❌ Se encontraron problemas de seguridad críticos!', colors.red)
    log('   Por favor corrígelos antes de hacer deploy.', colors.red)
    process.exit(1)
  } else if (warnings > 0) {
    log('\n⚠️  Se encontraron advertencias.', colors.yellow)
    log('   Revisa las recomendaciones para mejorar la seguridad.', colors.yellow)
    process.exit(0)
  } else {
    log('\n✅ ¡Excelente! No se encontraron problemas.', colors.green)
    process.exit(0)
  }
}

// Ejecutar checks
log('\n🛡️  EcoCupon Security Check', colors.cyan)
log('='.repeat(50), colors.cyan)

checkEnvFile()
checkGitignore()
checkSensitivePatterns()
checkDependencies()
checkSecurityHeaders()
printSummary()
