"use client";

import * as React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Control, FieldValues, Path } from "react-hook-form";

interface InlineEditFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  isEditing: boolean;
  value: React.ReactNode;
  renderInput: (field: any) => React.ReactNode;
}

export const InlineEditField = <T extends FieldValues>({
  control,
  name,
  label,
  isEditing,
  value,
  renderInput,
}: InlineEditFieldProps<T>) => {
  return (
    <div className="space-y-1">
      <div className="text-muted-foreground text-sm font-medium">{label}</div>
      {isEditing ? (
        <FormField
          control={control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <FormControl>{renderInput(field)}</FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ) : (
        <div className="flex items-center text-sm font-medium">{value}</div>
      )}
    </div>
  );
};
