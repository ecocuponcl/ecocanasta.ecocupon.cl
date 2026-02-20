/**
 * Utilidad de logging seguro para EcoCupon
 * - Previene leakage de información sensible en producción
 * - Centraliza el manejo de logs
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogOptions {
  namespace?: string
  sensitive?: boolean
}

class Logger {
  private isDevelopment: boolean
  private logLevel: LogLevel

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development'
    this.logLevel = (process.env.NEXT_PUBLIC_LOG_LEVEL as LogLevel) || 'error'
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error']
    const currentLevelIndex = levels.indexOf(this.logLevel)
    const targetLevelIndex = levels.indexOf(level)
    return targetLevelIndex >= currentLevelIndex
  }

  private sanitizeMessage(message: string): string {
    // Sanitizar posibles datos sensibles
    return message
      .replace(/(password|secret|key|token|Bearer\s+\w+)=?[^\s]*/gi, '$1=[REDACTED]')
      .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]')
      .replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, '[IP]')
  }

  private formatMessage(
    level: LogLevel,
    message: string,
    options?: LogOptions,
    ...args: unknown[]
  ): string {
    const timestamp = new Date().toISOString()
    const namespace = options?.namespace ? `[${options.namespace}]` : ''
    const sanitizedMessage = options?.sensitive 
      ? this.sanitizeMessage(message) 
      : message

    return `[${timestamp}] [${level.toUpperCase()}]${namespace} ${sanitizedMessage}`
  }

  debug(message: string, options?: LogOptions, ...args: unknown[]): void {
    if (!this.isDevelopment || !this.shouldLog('debug')) return
    console.debug(this.formatMessage('debug', message, options), ...args)
  }

  info(message: string, options?: LogOptions, ...args: unknown[]): void {
    if (!this.shouldLog('info')) return
    console.info(this.formatMessage('info', message, options), ...args)
  }

  warn(message: string, options?: LogOptions, ...args: unknown[]): void {
    if (!this.shouldLog('warn')) return
    console.warn(this.formatMessage('warn', message, options), ...args)
  }

  error(message: string, options?: LogOptions, error?: Error): void {
    if (!this.shouldLog('error')) return
    
    const sanitizedMessage = options?.sensitive 
      ? this.sanitizeMessage(message) 
      : message

    // En producción, no exponer stack traces completos
    if (this.isDevelopment) {
      console.error(this.formatMessage('error', sanitizedMessage, options), error || '')
    } else {
      console.error(this.formatMessage('error', sanitizedMessage, options))
    }
  }
}

// Exportar instancia singleton
export const logger = new Logger()

// Funciones helper para uso común
export function logError(
  context: string, 
  message: string, 
  error?: Error
): void {
  logger.error(message, { namespace: context, sensitive: true }, error)
}

export function logInfo(
  context: string, 
  message: string
): void {
  logger.info(message, { namespace: context })
}
