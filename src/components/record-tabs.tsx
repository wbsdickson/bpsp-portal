"use client";

import * as React from "react";

import { motion } from "framer-motion";

import TabsHorizontal from "@/components/tabs-horizontal";
import { Tabs } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export type RecordTab = {
  label: string;
  key: string;
  closable: boolean;
};

export type RecordTabsHelpers = {
  tabItems: RecordTab[];
  activeKey: string;
  addTab: (tab: RecordTab) => void;
  openTab: (key: string) => void;
  removeTab: (key: string) => void;
};

export default function RecordTabs({
  initialTabs,
  defaultActiveKey,
  renderTab,
  className,
  panelClassName,
  renderRight,
}: {
  initialTabs: RecordTab[];
  defaultActiveKey: string;
  renderTab: (tab: RecordTab, helpers: RecordTabsHelpers) => React.ReactNode;
  renderRight?: () => React.ReactNode;
  className?: string;
  panelClassName?: string;
}) {
  const [tabItems, setTabItems] = React.useState<RecordTab[]>(initialTabs);
  const [activeKey, setActiveKey] = React.useState(defaultActiveKey);

  const openTab = React.useCallback((key: string) => {
    setActiveKey(key);
  }, []);

  const addTab = React.useCallback((tab: RecordTab) => {
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

  const helpers = React.useMemo<RecordTabsHelpers>(
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
            "rounded-md border bg-white p-4 shadow",
            panelClassName,
          )}
        >
          {renderTab(item, helpers)}
        </motion.div>
      ))}
    </Tabs>
  );
}
