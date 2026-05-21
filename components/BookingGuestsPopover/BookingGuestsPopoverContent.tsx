"use client";

import * as React from "react";
import { PopoverContent } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { preventPopoverCloseOnSelect } from "./popoverSelectHandlers";

export const BookingGuestsPopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverContent>,
  React.ComponentPropsWithoutRef<typeof PopoverContent>
>(({ className, children, onInteractOutside, ...props }, ref) => (
  <PopoverContent
    ref={ref}
    align="start"
    className={cn("w-auto p-4", className)}
    onInteractOutside={(event) => {
      preventPopoverCloseOnSelect(event);
      onInteractOutside?.(event);
    }}
    {...props}
  >
    {children}
  </PopoverContent>
));
BookingGuestsPopoverContent.displayName = "BookingGuestsPopoverContent";
