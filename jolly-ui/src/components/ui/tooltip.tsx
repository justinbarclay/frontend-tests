import { Tooltip as AriaTooltip, composeRenderProps } from "react-aria-components";

import { cn } from "@/lib/utils";

const Tooltip = ({ className, ...props }: React.ComponentProps<typeof AriaTooltip>) => (
  <AriaTooltip
    className={composeRenderProps(className, (className) =>
      cn(
        "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[exiting]:animate-out data-[exiting]:fade-out-0 data-[exiting]:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2",
        className,
      ),
    )}
    {...props}
  />
);

export { Tooltip };
