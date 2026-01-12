import type { SVGProps } from "react";
import React from "react";
import { cn } from "@/lib/utils";
import { images, useCardBrand } from "react-card-brand";

export default function Amex(props: SVGProps<SVGSVGElement>) {
  const { getSvgProps } = useCardBrand();
  return (
    <svg
      {...getSvgProps({ type: "amex", images })}
      className={cn(props.className)}
    ></svg>
  );
}
