import { Popover as AriaPopover, composeRenderProps } from "react-aria-components";
import type {
  DialogProps as AriaDialogProps,
  PopoverProps as AriaPopoverProps,
} from "react-aria-components";

import { cn } from "@/lib/utils";

import { Dialog } from "./dialog";

const Popover = ({ className, ...props }: AriaPopoverProps) => (
  <AriaPopover
    className={composeRenderProps(className, (className) =>
      cn(
        "z-50 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[entering]:animate-in data-[exiting]:animate-out data-[entering]:fade-in-0 data-[exiting]:fade-out-0 data-[entering]:zoom-in-95 data-[exiting]:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2",
        className,
      ),
    )}
    {...props}
  />
);

const PopoverTrigger = ({ children, ...props }: AriaDialogProps) => (
  <Popover {...(props as any)}>
    <Dialog className="outline-none">{children}</Dialog>
  </Popover>
);

export { Popover, PopoverTrigger };
