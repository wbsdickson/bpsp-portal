"use client";

import * as React from "react";
interface TitleFieldProps {
  label: string;
  value: React.ReactNode;
}

export const TitleField = ({ label, value }: TitleFieldProps) => {
  return (
    <div className="space-y-1">
      <div className="text-muted-foreground text-sm font-medium">{label}</div>
      <div className="flex h-8 items-center text-sm font-medium">{value}</div>
    </div>
  );
};
