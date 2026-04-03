/**
 * Formatea un número como precio en Guaraníes paraguayos
 * El Guaraní no usa decimales, solo números enteros
 */
export function formatPrice(amount: number): string {
  return `₲${Math.round(amount).toLocaleString('es-PY')}`;
}

/**
 * Formatea un número sin símbolo de moneda
 */
export function formatNumber(amount: number): string {
  return Math.round(amount).toLocaleString('es-PY');
}
