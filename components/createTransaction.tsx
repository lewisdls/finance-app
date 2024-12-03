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

interface Category {
  id: string;
  name: string;
}

const CreateTransaction = () => {
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState("Debit");
  const [category, setCategory] = useState("");
  const [merchant, setMerchant] = useState("");
  const [date, setDate] = useState<Date>();
  const [categories, setCategories] = useState<Category[]>([]);

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
        const res = await axios.post("/api/transactions", transaction);
        toast({
          variant: "success",
          title: "Transaction was successfully created.",
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
        type="number"
        step=".01"
        placeholder="Enter amount"
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <Input
        type="text"
        placeholder="Enter merchant's name"
        onChange={(e) => setMerchant(e.target.value)}
      />
      <div className="flex gap-4">
        <Select defaultValue={type} onValueChange={(e) => setType(e)}>
          <SelectTrigger>
            <SelectValue placeholder="Debit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Debit">Debit</SelectItem>
            <SelectItem value="Credit">Credit</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={(e) => setCategory(e)}>
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
            onSelect={setDate}
            disabled={(d) => d > new Date()}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <button className="bg-blue-700 text-white lg:self-start py-2 px-4 rounded-md">
        Submit
      </button>
    </form>
  );
};

export default CreateTransaction;
