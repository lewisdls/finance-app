import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "./ui/input";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Bill {
  id: string;
  amount: number;
  merchant: string;
  recurrency: string;
  isPaid: boolean;
}

const EditBill = (props: Bill) => {
  const [amount, setAmount] = useState(props.amount);
  const [merchant, setMerchant] = useState(props.merchant);
  const [recurrency, setRecurrency] = useState(props.recurrency);
  const [isPaid, setIsPaid] = useState(props.isPaid);
  const [bill, setBill] = useState<Bill>();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const bill = {
      amount,
      merchant,
      recurrency,
      isPaid,
    };

    try {
      if (!amount || !merchant || !recurrency) {
        toast({
          variant: "destructive",
          title: "Missing fields are required",
        });
      } else {
        const res = await axios.put(`/api/bills/${props.id}`, bill);
        toast({
          variant: "success",
          title: "Bill was successfully updated.",
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (e: any) => {
    e.preventDefault();
    try {
      const res = await axios.delete(`/api/bills/${props.id}`);
      toast({
        variant: "success",
        title: "Bill was successfully deleted.",
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form className="flex flex-col gap-6">
      <Input
        type="number"
        step=".01"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <Input
        type="text"
        placeholder="Enter merchant's name"
        value={merchant}
        onChange={(e) => setMerchant(e.target.value)}
      />
      <div className="flex gap-4">
        <Select
          defaultValue={recurrency}
          onValueChange={(e) => setRecurrency(e)}
        >
          <SelectTrigger>
            <SelectValue placeholder={recurrency} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Monthly">Monthly</SelectItem>
            <SelectItem value="Yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
        <Select
          defaultValue={isPaid ? "Paid" : "Not Paid"}
          onValueChange={(e) => setIsPaid(e === "Paid" ? true : false)}
        >
          <SelectTrigger>
            <SelectValue placeholder={isPaid ? "Paid" : "Not Paid"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Paid">Paid</SelectItem>
            <SelectItem value="Not Paid">Not Paid</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2">
        <button
          className="bg-blue-700 text-white lg:self-start py-2 px-4 rounded-md"
          onClick={handleSubmit}
        >
          Submit
        </button>
        <button
          className="bg-red-700 text-white lg:self-start py-2 px-4 rounded-md"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </form>
  );
};

export default EditBill;
