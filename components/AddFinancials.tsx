"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddForm from "@/components/AddForm";
import { Location } from "@/db/schema";

const items = [
  { label: "Thornlie", value: "Thornlie" },
  { label: "Victoria Park", value: "Victoria Park" },
  { label: "Morley", value: "Morley" },
  { label: "Myaree", value: "Myaree" },
];

const AddFinancials = () => {
  const [selectedLocation, setSelectedLocation] = useState<Location>("Thornlie");
  const [selectedButton, setSelectButton] = useState("Add Revenue")
  
  const handleToggle = () => {
    setSelectButton(prev => prev === "Add Revenue" ? "Add Cost" : "Add Revenue")
  }
  
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button>
            <Plus className="size-4" />
            Add Financials
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[1000px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>Add Financials</DialogHeader>
        <ButtonGroup className="">
          <Button className={`flex w-[50%] text-[13px] ${selectedButton === "Add Revenue" ? "bg-blue-300 hover:bg-blue-300" : ""}`} 
          variant="outline" 
          name="revenue"
          onClick={() => setSelectButton("Add Revenue")}
            >
            <Plus />
            Add Revenue
          </Button>
          <Button className={`flex w-[50%] text-[13px] ${selectedButton === "Add Cost" ? "bg-blue-300 hover:bg-blue-300" : ""}`} 
          variant="outline" 
          onClick={() => setSelectButton("Add Cost")}
          >
            <Plus />
            Add Cost
          </Button>
        </ButtonGroup>
        <Select
          value={selectedLocation}
          onValueChange={(value) => setSelectedLocation(value as Location)}
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
        <AddForm location={selectedLocation} formType={selectedButton}/>
      </DialogContent>
    </Dialog>
  );
};

export default AddFinancials;