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
  merchant: string;
  amount: number;
  recurrency: string;
  isPaid: boolean;
}

const CreateBill = () => {
  const [amount, setAmount] = useState(0);
  const [merchant, setMerchant] = useState("");
  const [recurrency, setRecurrency] = useState("Monthly");
  const [isPaid, setIsPaid] = useState(false);
  const [bills, setBills] = useState<Bill[]>([]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const bill = {
      merchant,
      amount,
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
        const res = await axios.post("/api/bills", bill);
        toast({
          variant: "success",
          title: "Bill was successfully created.",
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Input
        type="text"
        placeholder="Enter merchant's name"
        onChange={(e) => setMerchant(e.target.value)}
      />
      <Input
        type="number"
        step=".01"
        placeholder="Enter amount"
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <div className="flex gap-2">
        <Select
          defaultValue={recurrency}
          onValueChange={(e) => setRecurrency(e)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Monthly" />
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
      <button className="bg-blue-700 text-white lg:self-start py-2 px-4 rounded-md">
        Submit
      </button>
    </form>
  );
};

export default CreateBill;
