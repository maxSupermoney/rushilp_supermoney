"use client";

import { useCallback, useContext, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertCircle, PlusIcon, XIcon } from "lucide-react";
import Link from "next/link";
import DebtContext from "@/context/DebtContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

export default function Home() {
  const { push } = useRouter();
  const { debts, setDebts, handleDebtAdd, handleDebtDelete } =
    useContext(DebtContext);

  const [error, setError] = useState<string | null>(null);

  const getError = (type: string, value: number) => {
    let isError = false;
    switch (type) {
      case "debtAmount":
        if (value < 1 || value > 999999) {
          setError("Enter valid debt amount,between 1 to 999999");
          isError = true;
        }
        break;
      case "debtAPR":
        if (value < 1 || value > 100) {
          setError("Enter valid APR,between 1 to 100");
          isError = true;
        }
        break;
      default:
        break;
    }

    return isError;
  };

  const handleValueChange = (
    id: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    e.preventDefault();

    setError(null);

    if (e.target.name === "debtAmount" || e.target.name === "debtAPR") {
      getError(e.target.name, +e.target.value);
    } else if (e.target.name === "name" && !e.target.value) {
      setError("Name Required");
    } else {
      const [debt] = debts.filter((d) => d.id === id);
      const interestOnlyPayments = debt.debtAmount * (debt.debtAPR / 1200);

      if (+e.target.value < interestOnlyPayments) {
        setError(
          "Monthly Payments can't be less than " +
            interestOnlyPayments.toFixed(2)
        );
      }
    }
    setDebts(
      debts.map((debt) =>
        debt.id === id ? { ...debt, [e.target.name]: e.target.value } : debt
      )
    );
  };

  const handleCalculate = () => {
    let isError = false;
    debts.forEach((debt) => {
      Object.keys(debt).map((k) => {
        if (k === "debtAmount" || k === "debtAPR") {
          isError = getError(k, debt[k]);
        } else if (k === "name" && !debt[k]) {
          setError("Name required");
          isError = true;
        } else if (k === "monthlyPayment") {
          const interestOnlyPayments = debt.debtAmount * (debt.debtAPR / 1200);

          if (debt[k] < interestOnlyPayments) {
            setError(
              "Monthly Payments can't be less than " +
                interestOnlyPayments.toFixed(2)
            );
            isError = true;
          }
        }
      });
    });
    if (error || isError) return;
    isError = false;
    push("/result");
  };

  const getDebtTableContent = useCallback(() => {
    return (
      <>
        {debts
          .sort((a, b) => a.id - b.id)
          .map((debt, index) => {
            const { id, name, debtAmount, debtAPR, monthlyPayment } = debt;

            return (
              <TableRow key={id}>
                <TableCell key={`dn-${id}`}>
                  <div className="mt-1 flex shadow-sm">
                    <input
                      type="text"
                      name="name"
                      id={`dn-${id}`}
                      value={name}
                      onChange={(e) => handleValueChange(id, e)}
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none border border-gray-300  focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                      placeholder="e.g. Medical"
                    />
                  </div>
                </TableCell>
                <TableCell key={`da-${id}`}>
                  <div className="mt-1 flex shadow-sm">
                    <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                      $
                    </span>
                    <input
                      type="number"
                      max={999999}
                      min={1}
                      value={debtAmount}
                      onChange={(e) => handleValueChange(id, e)}
                      name="debtAmount"
                      id={`da-${id}`}
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none border border-gray-300  focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                      placeholder="5000"
                    />
                  </div>
                </TableCell>
                <TableCell key={`apr-${id}`}>
                  <div className="mt-1 flex shadow-sm">
                    <input
                      type="number"
                      max={100}
                      min={0}
                      name="debtAPR"
                      onChange={(e) => handleValueChange(id, e)}
                      id={`apr-${id}`}
                      value={debtAPR}
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none border border-gray-300  focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                      placeholder="15.99"
                    />
                    <span className="inline-flex items-center px-3 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                      %
                    </span>
                  </div>
                </TableCell>
                <TableCell key={`mp-${id}`}>
                  <div className="mt-1 flex shadow-sm">
                    <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                      $
                    </span>
                    <input
                      type="number"
                      name="monthlyPayment"
                      onChange={(e) => handleValueChange(id, e)}
                      id={`mp-${id}`}
                      min={1}
                      value={monthlyPayment}
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none border border-gray-300  focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                      placeholder="200"
                    />
                  </div>
                </TableCell>
                {id !== 1 && (
                  <TableCell>
                    <XIcon
                      className="text-gray-400 hover:cursor-pointer"
                      onClick={() => {
                        setError(null);
                        return handleDebtDelete(id);
                      }}
                    />
                  </TableCell>
                )}
              </TableRow>
            );
          })}
      </>
    );
  }, [debts]);

  return (
    <>
      <div>
        <p className="uppercase text-sm font-semibold mt-6 text-gray-700">
          Enter your current debts
        </p>
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Table>
          <TableHeader className="uppercase ">
            <TableRow>
              <TableHead>Debt name</TableHead>
              <TableHead>Remaining debt amount</TableHead>
              <TableHead>Current Apr</TableHead>
              <TableHead>Current monthly payment</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{getDebtTableContent()}</TableBody>
        </Table>
        <div>
          <Button
            variant="link"
            color="cyan"
            onClick={() => {
              setError(null);
              return handleDebtAdd();
            }}
          >
            <PlusIcon className="w-5 h-5" />
            <p className="text-base">Add Another Debt</p>
          </Button>
        </div>
        <div className="w-full">
          <Button
            className="w-full disabled:cursor-not-allowed"
            onClick={handleCalculate}
            disabled={!!error}
          >
            Calculate Savings
          </Button>
        </div>
      </div>
    </>
  );
}
