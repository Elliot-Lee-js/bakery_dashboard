"use client";

import { createProductData, createCostData, getCostData, getProductData } from "@/actions/form";
import CostTable from "@/components/CostTable";
import { DatePicker } from "@/components/DatePicker";
import TableData from "@/components/TableData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Cost, Location, Product } from "@/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const revenueFormSchema = z.object({
  product: z.string().min(5, "Product must be at least 5 characters.").max(32),
  price: z.string().min(1, "Price is required.").max(9),
  amount: z.string().min(1, "Amount is required.").max(9),
  description: z.string().min(0).max(100),
  date: z.date({ error: "Please select a date." }),
});

const costFormSchema = z.object({
  item: z.string().min(1, "Item is required."),
  category: z.enum(
    ["ingredients", "operations", "staff", "maintenance", "miscellaneous"],
    { error: "Please select a category." },
  ),
  amount: z.string().min(1, "Amount is required.").max(9),
  description: z.string().min(0).max(100),
  date: z.date({ error: "Please select a date." }),
});

interface AddFormProps {
  location: Location;
  formType: string;
}

const categories = [
  { label: "Ingredients", value: "ingredients" },
  { label: "Operations", value: "operations" },
  { label: "Staff", value: "staff" },
  { label: "Maintenance", value: "maintenance" },
  { label: "Miscellaneous", value: "miscellaneous" },
];

const AddForm = ({ location, formType }: AddFormProps) => {
  const [productData, setProductData] = React.useState<Product[]>([]);
  const [costData, setCostData] = React.useState<Cost[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProductData(undefined, undefined, location);
        setProductData(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [location]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCostData(undefined, undefined, undefined, location);
        setCostData(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [location]);

  // Two independent form instances
  const revenueForm = useForm<z.infer<typeof revenueFormSchema>>({
    resolver: zodResolver(revenueFormSchema),
    defaultValues: {
      product: "",
      price: "",
      amount: "",
      description: "",
      date: undefined,
    },
  });

  const costForm = useForm<z.infer<typeof costFormSchema>>({
    resolver: zodResolver(costFormSchema),
    defaultValues: {
      item: "",
      category: undefined,
      amount: "",
      description: "",
      date: undefined,
    },
  });

  const onSubmitRevenue = async (data: z.infer<typeof revenueFormSchema>) => {
    setIsLoading(true);
    try {
      await createProductData({
        name: data.product,
        price: data.price,
        amount: Number(data.amount),
        description: data.description,
        date: data.date,
        location,
      });
  
      toast("Product added successfully", { position: "bottom-right" });

      const updatedData = await getProductData(undefined, undefined, location);
      setProductData(updatedData);
      revenueForm.reset();
      router.refresh();
      
    } catch (error) {
      console.error(error);
      toast("Failed to add product", { position: "bottom-right" });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitCost = async (data: z.infer<typeof costFormSchema>) => {
    setIsLoading(true);
    try {
      await createCostData({
        name: data.item,
        category: data.category,
        amount: data.amount,
        description: data.description,
        date: data.date,
        location,
      });

      toast("Cost added successfully", { position: "bottom-right" });

      const updatedData = await getCostData(undefined, undefined, undefined, location);
      setCostData(updatedData);
      costForm.reset();
      router.refresh();
    } catch (error) {
      console.error(error);
      toast("Failed to add cost", { position: "bottom-right" });
    } finally {
      setIsLoading(false);
    }
  };

  return formType === "Add Revenue" ? (
    <Card>
      <CardHeader>
        <TableData showBorder={false} showApplyFilter={false} productData={productData} />
      </CardHeader>
      <CardContent>
        <form id="revenue-form" onSubmit={revenueForm.handleSubmit(onSubmitRevenue)}>
          <FieldGroup>
            <div className="flex flex-wrap gap-4">
              <div className="w-full">
                <Controller
                  name="product"
                  control={revenueForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="revenue-product">Product:</FieldLabel>
                      <Input {...field} id="revenue-product" aria-invalid={fieldState.invalid} autoComplete="off" />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </div>
              <div className="flex items-center justify-between w-full gap-3">
                <Controller
                  name="price"
                  control={revenueForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="revenue-price">Price:</FieldLabel>
                      <Input {...field} id="revenue-price" aria-invalid={fieldState.invalid} autoComplete="off" />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                <Controller
                  name="amount"
                  control={revenueForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="revenue-amount">Amount Sold:</FieldLabel>
                      <Input {...field} id="revenue-amount" aria-invalid={fieldState.invalid} autoComplete="off" />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                <Controller
                  name="date"
                  control={revenueForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="revenue-date">Date:</FieldLabel>
                      <DatePicker date={field.value} onSelect={field.onChange} />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </div>
            </div>

            <Controller
              name="description"
              control={revenueForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="revenue-description">Description</FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id="revenue-description"
                      placeholder="Ran out of curry puffs within first few hours of business."
                      rows={6}
                      className="min-h-24 resize-none"
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {field.value.length}/100 characters
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldDescription>Include important detail if necessary.</FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Field orientation="horizontal">
              <Button type="button" variant="outline" onClick={() => revenueForm.reset()}>
                Reset
              </Button>
              <Button type="submit" form="revenue-form" disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  ) : (
    <Card>
      <CardHeader>
        <CostTable data={costData} showBorder={false} />
      </CardHeader>
      <CardContent>
        <form id="cost-form" onSubmit={costForm.handleSubmit(onSubmitCost)}>
          <FieldGroup>
            <div className="flex flex-wrap gap-4">
              <div className="w-full">
                <Controller
                  name="item"
                  control={costForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="cost-item">Item:</FieldLabel>
                      <Input {...field} id="cost-item" aria-invalid={fieldState.invalid} autoComplete="off" />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </div>
              <div className="flex w-full gap-3">
                <Controller
                  name="category"
                  control={costForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="cost-category">Category:</FieldLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="cost-category" className="w-full">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {categories.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                <Controller
                  name="amount"
                  control={costForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="cost-amount">Cost Amount:</FieldLabel>
                      <Input {...field} id="cost-amount" aria-invalid={fieldState.invalid} autoComplete="off" />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                <Controller
                  name="date"
                  control={costForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="cost-date">Date:</FieldLabel>
                      <DatePicker date={field.value} onSelect={field.onChange} />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </div>
            </div>
            <Controller
              name="description"
              control={costForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="cost-description">Description</FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id="cost-description"
                      placeholder="Ran out of curry puffs within first few hours of business."
                      rows={6}
                      className="min-h-24 resize-none"
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {field.value.length}/100 characters
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldDescription>Include important detail if necessary.</FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Field orientation="horizontal">
              <Button type="button" variant="outline" onClick={() => costForm.reset()}>
                Reset
              </Button>
              <Button type="submit" form="cost-form" disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddForm;