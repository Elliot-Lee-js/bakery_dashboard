"use client";

import EditForm from "@/components/EditForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Location } from "@/db/schema"; 

import { Pencil } from "lucide-react";
import { useState } from "react";

const items = [
  { label: "Thornlie", value: "Thornlie" },
  { label: "Victoria Park", value: "Victoria Park" },
  { label: "Morley", value: "Morley" },
  { label: "Myaree", value: "Myaree" },
] as const;

const EditFinancial = () => {
  const [location, setLocation] = useState<Location>("Thornlie");

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button>
            <Pencil className="size-4" />
            Edit Financials
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[1000px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Financials</DialogTitle>
        </DialogHeader>

        <Select
          value={location}
          onValueChange={(value) => setLocation(value as Location)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {items.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <EditForm location={location} />
      </DialogContent>
    </Dialog>
  );
};

export default EditFinancial;