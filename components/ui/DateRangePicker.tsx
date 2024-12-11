"use client";

import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DateRangePicker({
  className,
  datePicker,
  setDatePicker,
  text,
  disabled, 
  daysToAdd
}: {
  className?: React.HTMLAttributes<HTMLDivElement>;
  datePicker?: DateRange | undefined;
  setDatePicker?: (date: DateRange | undefined) => void;
  text?: string;
  disabled?: boolean;
  daysToAdd?: number | null;
}) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !datePicker && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {datePicker?.from ? (
              datePicker.to ? (
                <>
                  {format(datePicker.from, "LLL dd, y")} -{" "}
                  {format(datePicker.to, "LLL dd, y")}
                </>
              ) : (
                format(datePicker.from, "LLL dd, y")
              )
            ) : (
              <span>{text ?? "Pick a date"}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={datePicker?.from}
            selected={datePicker}
            onSelect={(range) => {
              range?.from && range.from.setHours(0, 0, 0, 0);
              range?.to && range.to.setHours(23, 59, 59, 999);
              if (setDatePicker) {
                if (daysToAdd && range?.from) {
                  const newToDate = new Date(range.from);
                  newToDate.setDate(newToDate.getDate() + daysToAdd - 1);
                  range.to = newToDate;
              }
                setDatePicker(range);
              }
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

