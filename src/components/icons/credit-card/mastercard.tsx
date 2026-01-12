import type { SVGProps } from "react";
import React from "react";
import { cn } from "@/lib/utils";

export default function Mastercard(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-label="Unknown card"
      width="1.5em"
      height="1em"
      viewBox="0 0 24 16"
      type="mastercard"
      className={cn(props.className)}
    >
      <g fill="none" fillRule="evenodd">
        <rect fill="#252525" height="16" rx="2" width="24"></rect>
        <circle cx="9" cy="8" fill="#eb001b" r="5"></circle>
        <circle cx="15" cy="8" fill="#f79e1b" r="5"></circle>
        <path
          d="m12 3.99963381c1.2144467.91220633 2 2.36454836 2 4.00036619s-.7855533 3.0881599-2 4.0003662c-1.2144467-.9122063-2-2.36454837-2-4.0003662s.7855533-3.08815986 2-4.00036619z"
          fill="#ff5f00"
        ></path>
      </g>
    </svg>
  );
}
