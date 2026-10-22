export function normalizeCPF(cpf: string): string {
  return cpf.replace(/\D/g, "").slice(0, 11);
}

export function formatCPF(cpf: string): string {
  const digits = normalizeCPF(cpf);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function validateCPF(cpf: string): boolean {
  const digits = normalizeCPF(cpf);

  if (!/^\d{11}$/.test(digits)) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;

  const calculateDigit = (length: number): number => {
    let sum = 0;
    for (let index = 0; index < length; index += 1) {
      sum += Number(digits[index]) * (length + 1 - index);
    }
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const firstDigit = calculateDigit(9);
  if (firstDigit !== Number(digits[9])) return false;

  const secondDigit = calculateDigit(10);
  return secondDigit === Number(digits[10]);
}
