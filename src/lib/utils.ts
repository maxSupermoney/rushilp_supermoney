import { DebtType } from "@/context/DebtContext";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const calculateTotalInterest = (debt: DebtType): number => {
  const { debtAmount, debtAPR, monthlyPayment } = debt;

  let totalAmount = Number(debtAmount);

  let totalInterest = 0;

  while (totalAmount > 0) {
    const calculatedMonthlyInterest =
      (totalAmount * (Number(debtAPR) / 100)) / 12;

    totalAmount =
      totalAmount + calculatedMonthlyInterest - Number(monthlyPayment);

    totalInterest += calculatedMonthlyInterest;
  }

  return totalInterest;
};
