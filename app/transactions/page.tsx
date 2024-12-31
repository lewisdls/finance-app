"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import axios from "axios";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import CreateTransaction from "@/components/createTransaction";
import EditTransaction from "@/components/editTransaction";
import { Button } from "@/components/ui/button";
import { getIconByCategory, getColorByCategory } from "../utils/categories";

interface Transaction {
  id: string;
  amount: number;
  category: string;
  merchant: string;
  type: string;
  date: string;
}

interface Category {
  id: string;
  name: string;
}

const Transactions = () => {
  const [key, setKey] = useState(+new Date());
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );
  const [selectedMerchant, setSelectedMerchant] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const filteredTransactions = transactions.filter((t) => {
    const categoryMatch = selectedCategory
      ? t.category === selectedCategory
      : true;
    const merchantMatch = selectedMerchant
      ? t.merchant.toLowerCase().includes(selectedMerchant.toLowerCase())
      : true;

    return categoryMatch && merchantMatch;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    const getTransactions = async () => {
      try {
        const res = await axios.get("/api/transactions");
        setTransactions(res.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    const getCategories = async () => {
      try {
        const res = await axios.get("/api/categories");
        setCategories(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getTransactions();
    getCategories();
  }, []);

  return (
    <div className="flex flex-col p-6 w-full gap-8 min-h-screen">
      <h1 className="text-4xl font-bold">Transactions</h1>
      <div className="bg-white rounded-lg flex flex-col gap-6 p-6 w-full">
        <Dialog>
          <DialogTrigger asChild>
            <button className="self-start font-semibold transition-all bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded-md">
              Add Transaction
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader className="mb-4">
              <DialogTitle>Add Transaction</DialogTitle>
            </DialogHeader>
            <CreateTransaction />
          </DialogContent>
        </Dialog>
        <div className="flex w-full gap-4">
          <Input
            type="text"
            placeholder="Search merchants..."
            onChange={(e) => {
              setSelectedMerchant(e.target.value);
              setCurrentPage(1);
            }}
          />
          <Select
            key={key}
            value={selectedCategory}
            onValueChange={(e) => {
              setSelectedCategory(e);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger>
              <SelectValue defaultValue="" placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.name}>
                  {c.name}
                </SelectItem>
              ))}
              <SelectSeparator />
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  setSelectedCategory(undefined);
                  setKey(+new Date());
                }}
                className="w-full px-2"
              >
                Clear
              </Button>
            </SelectContent>
          </Select>
        </div>
        {loading ? (
          "Loading..."
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Merchant</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTransactions.length > 0 ? (
                paginatedTransactions.map((t) => (
                  <TableRow key={t.id} className="">
                    <TableCell>{t.date.split("T")[0]}</TableCell>
                    <TableCell>{t.merchant}</TableCell>
                    <TableCell className={`font-medium text-md`}>
                      $
                      {t.amount.toString().includes(".")
                        ? t.amount.toLocaleString()
                        : t.amount.toLocaleString() + ".00"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="p-2 rounded-full text-white"
                          style={{
                            backgroundColor: getColorByCategory(t.category),
                          }}
                        >
                          {getIconByCategory(t.category)}
                        </div>
                        <p className="">{t.category}</p>
                      </div>
                    </TableCell>
                    <TableCell>{t.type}</TableCell>
                    <TableCell>
                      {" "}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex items-center gap-2 p-2 rounded-md"
                          >
                            <p className="hidden md:block">Edit</p>
                            <FaEdit />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader className="mb-4">
                            <DialogTitle>Edit Transaction</DialogTitle>
                          </DialogHeader>
                          <EditTransaction
                            id={t.id}
                            amount={t.amount}
                            merchant={t.merchant}
                            type={t.type}
                            category={t.category}
                            date={t.date}
                          />
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
        {totalPages > 1 && (
          <Pagination className="mt-6 justify-center md:justify-start">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage(
                      currentPage === 1 ? currentPage : currentPage - 1
                    )
                  }
                  href="#"
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1;
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href="#"
                      onClick={() => setCurrentPage(pageNumber)}
                      className={
                        pageNumber === currentPage ? "bg-black text-white" : ""
                      }
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage(
                      currentPage === totalPages ? currentPage : currentPage + 1
                    )
                  }
                  href="#"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
};

export default Transactions;
