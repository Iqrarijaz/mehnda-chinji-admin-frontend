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
  color = "primary",
  buttonVariant = "flat",
  buttonClass = "capitalize",
}) {
  return (
    <Popover placement={placement} color={color}>
      <PopoverTrigger>
        <Button
          color={color}
          variant={buttonVariant}
          className={`${buttonClass} focus:outline-none `}
        >
          {triggerContent}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="!p-0">{popoverContent}</PopoverContent>
    </Popover>
  );
}
