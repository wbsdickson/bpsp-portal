"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type LocaleTabsProps = {
  value: "en" | "ja";
  onValueChange: (value: "en" | "ja") => void;
};

const LocaleTabs = ({ value, onValueChange }: LocaleTabsProps) => {
  return (
    <Tabs
      value={value}
      onValueChange={(val) => onValueChange(val as "en" | "ja")}
    >
      <TabsList variant="outline" className="w-fit">
        <TabsTrigger variant="outline" value="en">
          English
        </TabsTrigger>
        <TabsTrigger variant="outline" value="ja">
          日本語
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default LocaleTabs;
