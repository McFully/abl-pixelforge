// Telemetry Service para ABL PIXELFORGE
// © 2026 Aritz Bahamonde Larxé. Todos los derechos reservados.

class TelemetryService {
  constructor() {
    this.logs = [];
    this.maxLogs = 200;
    this.listeners = new Set();
    this.initGlobalHandlers();
    this.info('System', 'Motor de Telemetría 360 inicializado', {
      platform: 'Windows Desktop (Electron)',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A'
    });
  }

  initGlobalHandlers() {
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        this.error('GlobalWindowError', event.message, {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack || null
        });
      });

      window.addEventListener('unhandledrejection', (event) => {
        this.error('UnhandledRejection', 'Promesa rechazada no controlada', {
          reason: event.reason?.stack || event.reason
        });
      });
    }
  }

  log(level, tag, message, details = null) {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      tag,
      message,
      details: details instanceof Error ? { message: details.message, stack: details.stack } : details
    };

    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    if (level === 'error') {
      console.error(`[${tag}] ${message}`, details || '');
    } else if (level === 'warn') {
      console.warn(`[${tag}] ${message}`, details || '');
    } else {
      console.log(`[${tag}] ${message}`, details || '');
    }

    this.notify();
  }

  info(tag, message, details) { this.log('info', tag, message, details); }
  warn(tag, message, details) { this.log('warn', tag, message, details); }
  error(tag, message, details) { this.log('error', tag, message, details); }

  getLogs() {
    return [...this.logs];
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      listener(this.getLogs());
    }
  }

  getFormattedReport() {
    let report = '=========================================\n';
    report += 'ABL PIXELFORGE — REPORTE DE TELEMETRÍA 360\n';
    report += `Fecha: ${new Date().toISOString()}\n`;
    report += 'Titular: © 2026 Aritz Bahamonde Larxé\n';
    report += `Total eventos registrados: ${this.logs.length}\n`;
    report += '=========================================\n\n';

    this.logs.forEach((l, idx) => {
      report += `[#${idx + 1}] [${l.timestamp}] [${l.level.toUpperCase()}] [${l.tag}]: ${l.message}\n`;
      if (l.details) {
        report += `    Detalles: ${JSON.stringify(l.details, null, 2)}\n`;
      }
    });

    return report;
  }
}

export const telemetry = new TelemetryService();
