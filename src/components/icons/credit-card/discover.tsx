import type { SVGProps } from "react";
import React from "react";
import { cn } from "@/lib/utils";
import { images, useCardBrand } from "react-card-brand";

export default function Discover(props: SVGProps<SVGSVGElement>) {
  const { getSvgProps } = useCardBrand();
  return (
    <svg
      {...getSvgProps({ type: "discover", images })}
      className={cn(props.className)}
    ></svg>
  );
}
