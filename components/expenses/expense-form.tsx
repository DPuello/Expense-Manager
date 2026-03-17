"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { z } from "zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Expense } from "@/lib/domain/entities/expense";
import { EXPENSE_CATEGORIES } from "@/lib/domain/constants/expense-categories";
import { useExpenseStore } from "@/store/useExpenseStore";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Card,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const expenseSchema = z.object({
    id: z.string().optional(),
    amount: z.number().min(0.01, "Amount must be greater than 0"),
    category: z.string().min(1, "Category is required"),
    date: z.date().refine((date) => !isNaN(date.getTime()), "Invalid date"),
    description: z.string().max(240, "Description is too long").optional(),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;

export default function ExpenseForm({ editing }: { editing?: Expense | null }) {
    const createExpense = useExpenseStore((state) => state.createExpense);
    const updateExpense = useExpenseStore((state) => state.updateExpense);
    const closeModal = useExpenseStore((state) => state.closeModal);

    const form = useForm<ExpenseFormValues>({
        resolver: zodResolver(expenseSchema),
        defaultValues: {
            id: undefined,
            amount: 0,
            category: "",
            date: new Date(),
            description: "",
        },
    });

    useEffect(() => {
        if (editing) {
            form.reset({
                id: editing.id,
                amount: editing.amount,
                category: editing.category,
                date: editing.date,
                description: editing.description ?? "",
            });
            return;
        }

        form.reset({
            id: undefined,
            amount: 0,
            category: "",
            date: new Date(),
            description: "",
        });
    }, [editing, form]);

    async function onSubmit(values: ExpenseFormValues) {
        const payload: Expense = {
            id: values.id ?? crypto.randomUUID(),
            amount: Number(values.amount),
            category: values.category,
            date: values.date,
            description: values.description ?? "",
        };

        if (values.id) {
            await updateExpense(payload);
            toast.success("Expense updated");
            return;
        }

        await createExpense(payload);
        toast.success("Expense created");
    }

    return (
        <Card className="border border-border/70 bg-card/90">
            <CardContent>
                <form id="expense-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FieldGroup>
                        <Controller
                            name="description"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="expense-description">Description</FieldLabel>
                                    <Textarea
                                        {...field}
                                        id="expense-description"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Optional note"
                                        autoComplete="off"
                                        rows={3}
                                        className="resize-none max-h-24"
                                    />
                                    {fieldState.error ? <FieldError errors={[fieldState.error]} /> : null}
                                </Field>
                            )}
                        />

                        <Controller
                            name="amount"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="expense-amount">Amount</FieldLabel>
                                    <Input
                                        {...field}
                                        id="expense-amount"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="0.00"
                                        type="number"
                                        step="1"
                                        min={0}
                                        autoComplete="off"
                                        onChange={(event) => {
                                            const value = event.target.value;
                                            field.onChange(value === "" ? 0 : Number(value));
                                        }}
                                    />
                                    {fieldState.error ? <FieldError errors={[fieldState.error]} /> : null}
                                </Field>
                            )}
                        />

                        <FieldSeparator />

                        <Controller
                            name="category"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="expense-category">Category</FieldLabel>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger id="expense-category" aria-invalid={fieldState.invalid}>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {EXPENSE_CATEGORIES.map((category) => (
                                                <SelectItem key={category} value={category}>
                                                    {category}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FieldDescription>Classify this expense to improve reporting.</FieldDescription>
                                    {fieldState.error ? <FieldError errors={[fieldState.error]} /> : null}
                                </Field>
                            )}
                        />

                        <Controller
                            name="date"
                            control={form.control}
                            render={({ field }) => (
                                <Field className="mx-auto ">
                                    <FieldLabel htmlFor="expense-date">Date</FieldLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" id="expense-date" className="justify-start font-normal">
                                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={(selectedDate) =>
                                                    field.onChange(selectedDate ?? field.value)
                                                }
                                                defaultMonth={field.value}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </Field>
                            )}
                        />
                    </FieldGroup>
                </form>
            </CardContent>
            <CardFooter>
                <Field orientation="horizontal">
                    <Button type="button" variant="outline" onClick={closeModal}>
                        Cancel
                    </Button>
                    <Button type="submit" form="expense-form">
                        {editing ? "Save Changes" : "Create Expense"}
                    </Button>
                </Field>
            </CardFooter>
        </Card>
    );
}
