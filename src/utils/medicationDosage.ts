/** Preserve the decimal value when converting the form text to the JSON number. */
export function parseMedicationDosage(value: string): number {
  const match = /^(\d*)(?:\.(\d*))?$/.exec(value.trim());
  if (!match || (!match[1] && !match[2])) {
    throw new Error('Informe uma dosagem decimal válida (ex.: 0.25).');
  }

  const integer = (match[1] || '0').replace(/^0+(?=\d)/, '');
  const fraction = (match[2] || '').replace(/0+$/, '');
  if (integer.length > 12 || fraction.length > 6) {
    throw new Error('A dosagem aceita até 12 dígitos inteiros e 6 decimais.');
  }

  const decimal = fraction ? `${integer}.${fraction}` : integer;
  const dosage = Number(decimal);
  if (!Number.isFinite(dosage) || dosage <= 0) {
    throw new Error('A dosagem deve ser maior que zero.');
  }
  // In this range (0.000001 to 999999999999.999999), Number.toString uses
  // ordinary decimal notation, so a different string means a changed value.
  if (String(dosage) !== decimal) {
    throw new Error(
      'Esta dosagem perderia precisão ao ser enviada. Informe um valor com menos dígitos.',
    );
  }
  return dosage;
}
