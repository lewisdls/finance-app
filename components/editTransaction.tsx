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

const EditTransaction = (props: Transaction) => {
  const [amount, setAmount] = useState(props.amount);
  const [type, setType] = useState(props.type);
  const [category, setCategory] = useState(props.category);
  const [merchant, setMerchant] = useState(props.merchant);
  const [date, setDate] = useState(new Date(props.date));
  const [categories, setCategories] = useState<Category[]>([]);
  const [transaction, setTransaction] = useState<Transaction>();

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await axios.get("/api/categories");
        setCategories(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getCategories();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const transaction = {
      amount,
      type,
      category,
      merchant,
      date,
    };

    try {
      if (!amount || !type || !category || !merchant || !date) {
        toast({
          variant: "destructive",
          title: "Missing fields are required",
        });
      } else {
        const res = await axios.put(
          `/api/transactions/${props.id}`,
          transaction
        );
        toast({
          variant: "success",
          title: "Transaction was successfully updated.",
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
      const res = await axios.delete(`/api/transactions/${props.id}`);
      toast({
        variant: "success",
        title: "Transaction was successfully deleted.",
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
        <Select value={type} onValueChange={(e) => setType(e)}>
          <SelectTrigger>
            <SelectValue placeholder="Debit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Debit">Debit</SelectItem>
            <SelectItem value="Credit">Credit</SelectItem>
          </SelectContent>
        </Select>
        <Select value={category} onValueChange={(e) => setCategory(e)}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.name}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Select date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => d && setDate(d)}
            disabled={(d) => d > new Date()}
            initialFocus
          />
        </PopoverContent>
      </Popover>
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

export default EditTransaction;
