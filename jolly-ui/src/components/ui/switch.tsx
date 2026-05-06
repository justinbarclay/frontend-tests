import { Switch as AriaSwitch, composeRenderProps } from "react-aria-components";
import type { SwitchProps as AriaSwitchProps } from "react-aria-components";

import { cn } from "@/lib/utils";

const Switch = ({ className, children, ...props }: AriaSwitchProps) => (
  <AriaSwitch
    className={composeRenderProps(className, (className) =>
      cn(
        "group inline-flex items-center gap-2 text-sm font-medium leading-none transition-colors",
        /* Disabled */
        "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-70",
        className,
      ),
    )}
    {...props}
  >
    {composeRenderProps(children, (children) => (
      <>
        <div className="h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-input transition-colors group-data-[selected]:bg-primary group-data-[focus-visible]:outline-none group-data-[focus-visible]:ring-2 group-data-[focus-visible]:ring-ring group-data-[focus-visible]:ring-offset-2 group-data-[focus-visible]:ring-offset-background">
          <div className="pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform group-data-[selected]:translate-x-4" />
        </div>
        {children}
      </>
    ))}
  </AriaSwitch>
);

export { Switch };
