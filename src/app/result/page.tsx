"use client";

import { Button } from "@/components/ui/button";
import DebtContext from "@/context/DebtContext";
import { useContext, useEffect, useState } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Result = () => {
  const { push } = useRouter();
  const {
    calculateCurrentTotalDebtValues,
    currentTotal,
    currentMonthlyPayment,
    setDesiredAPR,
    desiredAPR,
    desiredMonths,
    newMonthlyPayment,
    newTotal,
    setDesiredMonths,
  } = useContext(DebtContext);

  const handleAPRChange = ([apr]: number[]) => {
    setDesiredAPR(apr);
  };

  const handleMonthsChange = ([months]: number[]) => {
    setDesiredMonths(months);
  };

  useEffect(() => {
    calculateCurrentTotalDebtValues();
  }, [calculateCurrentTotalDebtValues, desiredAPR, desiredMonths]);

  return (
    <div>
      <Link href="/">
        <Button variant="link">
          <ArrowLeftIcon /> Update Your Current Debts
        </Button>
      </Link>

      <div className="border-2 h-full ">
        <div className=" border-b-2 px-6 py-10">
          <div>
            <p className="uppercase font-semibold">
              {" "}
              Configure your consolidated loan
            </p>
            <p className="text-gray-500">
              Use the sliders below to simulate the new APR and loan terms.
            </p>
          </div>

          <div className="flex items-center w-full mt-10">
            <div className="flex flex-col justify-center mr-10">
              <p className="uppercase text-sm font-semibold text-gray-500">
                {" "}
                Desired APR
              </p>
              <p className="text-cyan-500 font-semibold text-3xl">
                {desiredAPR.toFixed(2)}%
              </p>
            </div>
            <div className="w-72">
              <Slider
                defaultValue={[8]}
                max={36}
                min={4}
                step={1}
                onValueChange={handleAPRChange}
              />
            </div>
          </div>
          <div className="flex items-center w-full mt-10">
            <div className="flex flex-col justify-center mr-10">
              <p className="uppercase text-sm font-semibold text-gray-500">
                {" "}
                Desired loan term
              </p>
              <p className="text-cyan-500 font-semibold text-3xl">
                {desiredMonths} months
              </p>
            </div>
            <div className="w-72">
              <Slider
                defaultValue={[24]}
                max={60}
                min={12}
                step={1}
                onValueChange={handleMonthsChange}
              />
            </div>
          </div>
        </div>
        {/* -------------------------------------- */}
        <div className="flex items-center">
          <div className="border-r-2 w-1/2">
            <div className="flex justify-between px-6 py-2">
              <p>New Total Repayment</p>
              <p className="text-cyan-500 text-lg">${newTotal}</p>
            </div>
            <div className="flex justify-between px-6 py-2">
              <p>Current Total Repayment</p>
              <p className="text-lg">${currentTotal}</p>
            </div>
            <div
              className={`${
                currentTotal - newTotal >= 0 ? "bg-green-50" : "bg-red-50"
              } flex justify-between px-6 py-2`}
            >
              <p>Total Repayment Savings</p>
              <p
                className={`${
                  currentTotal - newTotal >= 0
                    ? "text-green-500"
                    : "text-red-500"
                } font-semibold text-xl`}
              >
                ${(currentTotal - newTotal).toFixed(2)}
              </p>
            </div>
          </div>

          <div className="w-1/2">
            <div className="flex justify-between px-6 py-2">
              <p>New Monthly Payment</p>
              <p className="text-cyan-500 text-lg">${newMonthlyPayment}</p>
            </div>
            <div className="flex justify-between px-6 py-2">
              <p>Current Monthly Payment</p>
              <p className=" text-lg">${currentMonthlyPayment}</p>
            </div>
            <div
              className={`${
                currentMonthlyPayment - newMonthlyPayment >= 0
                  ? "bg-green-50"
                  : "bg-red-50"
              } flex justify-between px-6 py-2`}
            >
              <p>Total Repayment Savings</p>
              <p
                className={`${
                  currentMonthlyPayment - newMonthlyPayment >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }  font-semibold text-xl`}
              >
                ${(currentMonthlyPayment - newMonthlyPayment).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;
