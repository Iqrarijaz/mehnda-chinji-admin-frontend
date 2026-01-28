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
    <Popover placement={placement}>
      <PopoverTrigger>
        <div className="focus:outline-none">
          {triggerContent}
        </div>
      </PopoverTrigger>
      <PopoverContent className="!p-0 border border-gray-100 shadow-xl overflow-hidden rounded-xl">
        {popoverContent}
      </PopoverContent>
    </Popover>
  );
}


