"use client";

import { IoMdArrowDropright } from "react-icons/io";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { getIconByCategory, getColorByCategory } from "./utils/categories";
import Chart from "@/components/pieChart";
import AnimatedNumbers from "react-animated-numbers";

interface Transaction {
  id: string;
  amount: number;
  category: string;
  merchant: string;
  type: string;
  date: string;
}

interface Bill {
  id: string;
  merchant: string;
  amount: number;
  recurrency: string;
  isPaid: boolean;
}

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);

  useEffect(() => {
    const getTransactions = async () => {
      try {
        const res = await axios.get("/api/transactions");
        setTransactions(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    const getBills = async () => {
      try {
        const res = await axios.get("/api/bills");
        setBills(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getTransactions();
    getBills();
  }, []);

  const totalDebits = transactions
    .filter((t) => t.type === "Debit")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalCredits = transactions
    .filter((t) => t.type === "Credit")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance =
    transactions
      .filter((t) => t.type === "Credit")
      .reduce((sum, t) => sum + t.amount, 0) -
    transactions
      .filter((t) => t.type === "Debit")
      .reduce((sum, t) => sum + t.amount, 0) +
    10000;

  const totalBills = bills.reduce((sum, b) => sum + b.amount, 0);

  const totalPaidBills = bills
    .filter((b) => b.isPaid)
    .reduce((sum, b) => sum + b.amount, 0);

  const totalUpcoming = bills
    .filter((b) => !b.isPaid)
    .reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="flex flex-col gap-8 p-8 w-full">
      <h1 className="text-4xl font-bold">Overview</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col md:flex-row gap-6 w-full lg:col-span-2">
          <div className="flex flex-col gap-3 p-4 bg-[#18171b] text-white rounded-lg w-full">
            <span className="text-xs">Current Balance</span>
            <div className="flex items-center gap-1">
              <span className="text-3xl font-semibold">$</span>
              <AnimatedNumbers
              className="font-semibold"
              includeComma
              transitions={(index) => ({
                type: "spring",
                duration: index + 0.3,
              })}
              animateToNumber={balance}
              fontStyle={{
                fontSize: 30,
              }}
            />
            </div>
          </div>
          <div className="flex flex-col gap-3 p-4 bg-white rounded-lg w-full">
            <span className="text-xs">Income</span>
            <div className="flex items-center gap-1">
              <span className="text-3xl font-semibold">$</span>
              <AnimatedNumbers
              className="font-semibold"
              includeComma
              transitions={(index) => ({
                type: "spring",
                duration: index + 0.3,
              })}
              animateToNumber={totalCredits}
              fontStyle={{
                fontSize: 30,
              }}
            />
            </div>
          </div>
          <div className="flex flex-col gap-3 p-4 bg-white rounded-lg w-full">
            <span className="text-xs">Expenses</span>{" "}
            <div className="flex items-center gap-1">
              <span className="text-3xl font-semibold">$</span>
              <AnimatedNumbers
              className="font-semibold"
              includeComma
              transitions={(index) => ({
                type: "spring",
                duration: index + 0.3,
              })}
              animateToNumber={totalDebits}
              fontStyle={{
                fontSize: 30,
              }}
            />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-8 p-6 bg-white rounded-lg">
          <p className="text-xl font-semibold">Expenses Chart</p>
          <div>
            <Chart />
          </div>
        </div>
        <div className="flex flex-col gap-8 p-6 bg-white rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-xl font-semibold">Recurring Bills</p>
            <Link
              href="/bills"
              className="text-sm text-gray-500 font-medium hover:underline cursor-pointer flex items-center gap-2"
            >
              See Details <IoMdArrowDropright className="text-xl" />
            </Link>
          </div>
          <div className="flex flex-col gap-4 h-fit">
            <div className="flex justify-between bg-[#F9F5F1] p-4 rounded-lg border-l-4 border-green-700">
              <p className="text-gray-500 font-medium">Paid Bills</p>
              <span className="font-bold">
                $
                {totalPaidBills.toString().includes(".")
                  ? totalPaidBills.toLocaleString()
                  : totalPaidBills.toLocaleString() + ".00"}
              </span>
            </div>
            <div className="flex justify-between bg-[#F9F5F1] p-4 rounded-lg border-l-4 border-yellow-700">
              <p className="text-gray-500 font-medium">Total Upcoming</p>
              <span className="font-bold">
                $
                {totalUpcoming.toString().includes(".")
                  ? totalUpcoming.toLocaleString()
                  : totalUpcoming.toLocaleString() + ".00"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:col-span-2 gap-2 p-6 bg-white rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-xl font-semibold">Recent Transactions</p>
            <Link
              href="/transactions"
              className="text-sm text-gray-500 font-medium hover:underline flex items-center gap-2"
            >
              View All <IoMdArrowDropright className="text-xl" />
            </Link>
          </div>
          <div>
            {transactions.slice(0, 4).map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between border-b-2 border-gray-100 last:border-0 py-4 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-full text-white"
                    style={{ backgroundColor: getColorByCategory(t.category) }}
                  >
                    {getIconByCategory(t.category)}
                  </div>
                  <p className="font-medium text-md">{t.merchant}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p
                    className={`font-bold text-md ${
                      t.type === "Debit" ? "text-red-800" : "text-green-800"
                    }`}
                  >
                    {t.type === "Debit" ? "-" : "+"}$
                    {t.amount.toString().includes(".")
                      ? t.amount.toLocaleString()
                      : t.amount.toLocaleString() + ".00"}
                  </p>
                  <p className="text-sm text-gray-400 font-medium">
                    {new Date(
                      new Date(t.date).getTime() +
                        new Date().getTimezoneOffset() * 60000
                    ).toDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
