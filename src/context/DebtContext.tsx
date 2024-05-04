"use client";
import { calculateTotalInterest } from "@/lib/utils";
import React, { createContext, useCallback, useState } from "react";

export type DebtType = {
  id: number;
  name: string;
  debtAmount: number;
  debtAPR: number;
  monthlyPayment: number;
};

export type DebtContextType = {
  debts: DebtType[];
  setDebts: React.Dispatch<React.SetStateAction<DebtType[]>>;
  currentTotal: number;
  currentMonthlyPayment: number;
  newTotal: number;
  desiredAPR: number;
  desiredMonths: number;
  newMonthlyPayment: number;
  handleDebtAdd: () => void;
  handleDebtDelete: (id: number) => void;
  calculateCurrentTotalDebtValues: () => void;
  setDesiredAPR: React.Dispatch<React.SetStateAction<number>>;
  setDesiredMonths: React.Dispatch<React.SetStateAction<number>>;
};

const DebtContext = createContext<DebtContextType>(null!);

export const DebtContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [debts, setDebts] = useState<DebtType[]>([
    {
      id: 1,
      name: "",
      debtAmount: 0,
      debtAPR: 0,
      monthlyPayment: 0,
    },
  ]);

  const [currentTotal, setCurrentTotal] = useState(0);
  const [currentMonthlyPayment, setCurrentMonthlyPayment] = useState(0);

  const [desiredAPR, setDesiredAPR] = useState(8);

  const [newTotal, setNewTotal] = useState(0);

  const [newMonthlyPayment, setNewMonthlyPayment] = useState(0);

  const [desiredMonths, setDesiredMonths] = useState(24);

  const handleDebtAdd = () => {
    const id = debts[debts.length - 1].id + 1;

    setDebts(
      [
        ...debts,
        {
          id,
          name: "",
          debtAmount: 0,
          debtAPR: 0,
          monthlyPayment: 0,
        },
      ].sort((a, b) => a.id - b.id)
    );
  };

  const handleDebtDelete = (id: number) => {
    setDebts(
      debts.filter((debt) => debt.id !== id).sort((a, b) => a.id - b.id)
    );
  };

  const calculateCurrentTotalDebtValues = useCallback(() => {
    const totalWithoutInterest = debts.reduce((prev, current) => {
      return prev + Number(current.debtAmount);
    }, 0);

    const totalMonthlyPayment = debts.reduce((prev, current) => {
      return prev + Number(current.monthlyPayment);
    }, 0);

    const totalInterest = debts.reduce((prev, current) => {
      return prev + calculateTotalInterest(current);
    }, 0);

    setCurrentMonthlyPayment(Number(totalMonthlyPayment.toFixed(2)));

    setCurrentTotal(Number((totalWithoutInterest + totalInterest).toFixed(2)));

    // new payments

    const rate = desiredAPR / 1200;

    const monthlyPayment =
      (totalWithoutInterest * rate * Math.pow(1 + rate, desiredMonths)) /
      (Math.pow(1 + rate, desiredMonths) - 1);

    const totalInterestPaid =
      monthlyPayment * desiredMonths - totalWithoutInterest;

    setNewTotal(Number((totalWithoutInterest + totalInterestPaid).toFixed(2)));

    setNewMonthlyPayment(Number(monthlyPayment.toFixed(2)));
  }, [debts, desiredAPR, desiredMonths]);

  return (
    <DebtContext.Provider
      value={{
        debts,
        setDebts,
        handleDebtAdd,
        handleDebtDelete,
        calculateCurrentTotalDebtValues,
        currentTotal,
        currentMonthlyPayment,

        newTotal,
        newMonthlyPayment,
        desiredAPR,
        desiredMonths,
        setDesiredAPR,
        setDesiredMonths,
      }}
    >
      {children}
    </DebtContext.Provider>
  );
};

export default DebtContext;
