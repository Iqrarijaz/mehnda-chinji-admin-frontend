import React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from "@nextui-org/react";

export function CustomPopover({
  triggerContent,
  popoverContent,
  placement = "bottom",
  color = "secondary",
  buttonVariant = "flat",
  buttonClass = "capitalize",
}) {
  return (
    <Popover placement={placement} color={color}>
      <PopoverTrigger>
        <Button color={color} variant={buttonVariant} className={buttonClass}>
          {triggerContent}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="px-1 py-2">{popoverContent}</div>
      </PopoverContent>
    </Popover>
  );
}
