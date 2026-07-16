export class AppError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'No encontrado') {
    super(404, 'NOT_FOUND', message);
  }
}

export class UpstreamError extends AppError {
  constructor(message = 'No se pudo obtener la información del CMS') {
    super(502, 'UPSTREAM_ERROR', message);
  }
}

export class ValidationError extends AppError {
  constructor(public details: unknown) {
    super(400, 'VALIDATION_ERROR', 'Datos inválidos');
  }
}
