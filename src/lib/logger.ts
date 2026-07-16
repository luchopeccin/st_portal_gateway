// Wrapper fino sobre console.*: centraliza el logging para que sumar un logger
// estructurado (pino) en el futuro sea cambiar un solo archivo.
export const logger = {
  info: (...args: unknown[]) => console.log(...args),
  error: (...args: unknown[]) => console.error(...args),
};
