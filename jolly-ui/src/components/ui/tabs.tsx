import {
  Tab as AriaTab,
  TabList as AriaTabList,
  TabPanel as AriaTabPanel,
  Tabs as AriaTabs,
  composeRenderProps,
} from "react-aria-components";
import type {
  TabListProps as AriaTabListProps,
  TabPanelProps as AriaTabPanelProps,
  TabProps as AriaTabProps,
} from "react-aria-components";

import { cn } from "@/lib/utils";

const Tabs = AriaTabs;

const TabList = <T extends object>({ className, ...props }: AriaTabListProps<T>) => (
  <AriaTabList
    className={composeRenderProps(className, (className) =>
      cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
        className,
      ),
    )}
    {...props}
  />
);

const Tab = ({ className, ...props }: AriaTabProps) => (
  <AriaTab
    className={composeRenderProps(className, (className) =>
      cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[selected]:bg-background data-[selected]:text-foreground data-[selected]:shadow-sm",
        className,
      ),
    )}
    {...props}
  />
);

const TabPanel = ({ className, ...props }: AriaTabPanelProps) => (
  <AriaTabPanel
    className={composeRenderProps(className, (className) =>
      cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      ),
    )}
    {...props}
  />
);

export { Tabs, TabList, Tab, TabPanel };
