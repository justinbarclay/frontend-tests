import { Toolbar as AriaToolbar } from "react-aria-components";
import type { ToolbarProps } from "react-aria-components";

import { cn } from "@/lib/utils";

const Toolbar = ({ className, ...props }: ToolbarProps) => (
  <AriaToolbar className={cn("flex items-center gap-2", className)} {...props} />
);

export { Toolbar };
