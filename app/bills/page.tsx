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
import { FaEdit, FaGasPump, FaUser } from "react-icons/fa";
import { SiYoutubemusic } from "react-icons/si";
import { IoBag } from "react-icons/io5";
import {
  MdFastfood,
  MdLocalGroceryStore,
  MdMovie,
  MdSpa,
} from "react-icons/md";
import { RiBillFill } from "react-icons/ri";
import CreateBill from "@/components/createBill";
import EditBill from "@/components/editBill";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";

interface Bill {
  id: string;
  merchant: string;
  amount: number;
  recurrency: string;
  isPaid: boolean;
}

const Bills = () => {
  const [loading, setLoading] = useState(true);
  const [bills, setBills] = useState<Bill[]>([]);
  const [selectedMerchant, setSelectedMerchant] = useState("");

  const filteredBills = bills.filter((b) => {
    const merchantMatch = selectedMerchant
      ? b.merchant.toLowerCase().includes(selectedMerchant.toLowerCase())
      : true;
    return merchantMatch;
  });

  useEffect(() => {
    const getBills = async () => {
      try {
        const res = await axios.get("/api/bills");
        setBills(res.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    getBills();
  }, []);

  return (
    <div className="flex flex-col p-6 w-full gap-8">
      <h1 className="text-4xl font-bold">Bills</h1>
      <div className="bg-white rounded-lg flex flex-col gap-6 p-6 w-full">
        <Dialog>
          <DialogTrigger asChild>
            <button className="self-start font-semibold transition-all bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded-md">
              Add Bill
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader className="mb-4">
              <DialogTitle>Add Bill</DialogTitle>
            </DialogHeader>
            <CreateBill />
          </DialogContent>
        </Dialog>
        <div className="flex w-full gap-4">
          <Input
            type="text"
            placeholder="Search merchants..."
            onChange={(e) => {
              setSelectedMerchant(e.target.value);
            }}
          />
        </div>
        {loading ? (
          "Loading..."
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Merchant</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Recurrency</TableHead>
                <TableHead>Paid?</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBills.length > 0 ? (
                filteredBills.map((b) => (
                  <TableRow key={b.id} className="">
                    <TableCell>{b.merchant}</TableCell>
                    <TableCell className={`font-medium text-md`}>
                      $
                      {b.amount.toString().includes(".")
                        ? b.amount.toLocaleString()
                        : b.amount.toLocaleString() + ".00"}
                    </TableCell>
                    <TableCell>{b.recurrency}</TableCell>
                    <TableCell>
                      <Toggle
                        variant="outline"
                        pressed={b.isPaid}
                        className="font-bold"
                      >
                        {b.isPaid ? "✓" : "-"}
                      </Toggle>
                    </TableCell>
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
                            <DialogTitle>Edit Bill</DialogTitle>
                          </DialogHeader>
                          <EditBill
                            id={b.id}
                            amount={b.amount}
                            merchant={b.merchant}
                            recurrency={b.recurrency}
                            isPaid={b.isPaid}
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
      </div>
    </div>
  );
};

export default Bills;
