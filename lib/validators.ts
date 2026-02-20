/**
 * Utilidades de validación y seguridad para EcoCupon
 */

/**
 * Valida y sanitiza un número de teléfono para WhatsApp
 * Solo permite números con formato internacional válido
 * @param phone - Número de teléfono a validar
 * @returns Número limpio o null si es inválido
 */
export function validatePhoneNumber(phone: string): string | null {
  // Remover todos los caracteres no numéricos excepto +
  const cleaned = phone.replace(/[^\d+]/g, "")
  
  // Remover + si no está al inicio
  const normalized = cleaned.replace(/\+/g, "").replace(/^(\d)/, "+$1")
  
  // Validar formato internacional (mínimo 8 dígitos, máximo 15)
  const phoneRegex = /^\+?\d{8,15}$/
  
  if (!phoneRegex.test(normalized.replace("+", ""))) {
    return null
  }
  
  // Limitar longitud máxima para prevenir DoS
  if (normalized.length > 20) {
    return null
  }
  
  return normalized.replace("+", "")
}

/**
 * Valida que una URL sea segura y permita solo protocolos http/https
 * @param url - URL a validar
 * @returns URL válida o null si es inválida o insegura
 */
export function validateExternalUrl(url: string | null | undefined): string | null {
  if (!url) return null
  
  try {
    const parsedUrl = new URL(url)
    
    // Solo permitir protocolos seguros
    if (!["https:", "http:"].includes(parsedUrl.protocol)) {
      return null
    }
    
    // Prevenir javascript: y data: URLs
    if (parsedUrl.protocol === "javascript:" || parsedUrl.protocol === "data:") {
      return null
    }
    
    // Validar hostname
    if (!parsedUrl.hostname || parsedUrl.hostname.includes("..")) {
      return null
    }
    
    return url
  } catch {
    return null
  }
}

/**
 * Sanitiza un string para prevenir XSS básico
 * @param input - String a sanitizar
 * @returns String sanitizado
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

/**
 * Valida un email básico
 * @param email - Email a validar
 * @returns true si es válido
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Limita la longitud de un string para prevenir ataques de densidad
 * @param input - String a limitar
 * @param maxLength - Longitud máxima
 * @returns String truncado
 */
export function truncateString(input: string, maxLength: number): string {
  if (input.length <= maxLength) return input
  return input.slice(0, maxLength)
}
