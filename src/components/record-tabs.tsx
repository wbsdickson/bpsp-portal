"use client";

import * as React from "react";

import { motion } from "framer-motion";

import TabsHorizontal from "@/components/tabs-horizontal";
import { Tabs } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export type RecordTab<T> = {
  label: string;
  key: string;
  closable: boolean;
  type?: string;
  data?: T;
};

export type RecordTabsHelpers<T> = {
  tabItems: RecordTab<T>[];
  activeKey: string;
  addTab: (tab: RecordTab<T>) => void;
  openTab: (key: string) => void;
  removeTab: (key: string) => void;
};

export default function RecordTabs<T>({
  initialTabs,
  defaultActiveKey,
  renderTab,
  className,
  panelClassName,
  renderRight,
}: {
  initialTabs: RecordTab<T>[];
  defaultActiveKey: string;
  renderTab: (tab: RecordTab<T>, helpers: RecordTabsHelpers<T>) => React.ReactNode;
  renderRight?: () => React.ReactNode;
  className?: string;
  panelClassName?: string;
}) {
  const [tabItems, setTabItems] = React.useState<RecordTab<T>[]>(initialTabs);
  const [activeKey, setActiveKey] = React.useState(defaultActiveKey);

  const openTab = React.useCallback((key: string) => {
    setActiveKey(key);
  }, []);

  const addTab = React.useCallback((tab: RecordTab<T>) => {
    setTabItems((prev) => {
      if (prev.some((t) => t.key === tab.key)) return prev;
      return [...prev, tab];
    });
    setActiveKey(tab.key);
  }, []);

  const removeTab = React.useCallback(
    (targetKey: string) => {
      let newActiveKey = activeKey;
      let lastIndex = -1;

      tabItems.forEach((item, i) => {
        if (item.key === targetKey) {
          lastIndex = i - 1;
        }
      });

      const newPanes = tabItems.filter((item) => item.key !== targetKey);

      if (newPanes.length && newActiveKey === targetKey) {
        if (lastIndex >= 0) {
          newActiveKey = newPanes[lastIndex].key;
        } else {
          newActiveKey = newPanes[0].key;
        }
      }

      setTabItems(newPanes);
      setActiveKey(newActiveKey);
    },
    [activeKey, tabItems],
  );

  const helpers = React.useMemo<RecordTabsHelpers<T>>(
    () => ({
      tabItems,
      activeKey,
      addTab,
      openTab,
      removeTab,
    }),
    [activeKey, addTab, openTab, removeTab, tabItems],
  );

  return (
    <Tabs
      className={cn("w-full", className)}
      value={activeKey}
      defaultValue={defaultActiveKey}
      onValueChange={openTab}
    >
      <div className="flex justify-between">
        <TabsHorizontal
          tabItems={tabItems}
          remove={removeTab}
          activeKey={activeKey}
        />
        {renderRight && renderRight()}
      </div>

      {tabItems.map((item) => (
        <motion.div
          key={item.key}
          initial={{ opacity: 0 }}
          animate={{ opacity: activeKey === item.key ? 1 : 0 }}
          exit={{ opacity: 0 }}
          className={cn(
            activeKey !== item.key && "hidden",
            "rounded-md bg-white",
            panelClassName,
          )}
        >
          {renderTab(item, helpers)}
        </motion.div>
      ))}
    </Tabs>
  );
}
