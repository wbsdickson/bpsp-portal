import { useEffect, useRef, useState } from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export type RecordTab = {
  label: string;
  component?: React.ReactNode;
  key: string;
  closable: boolean;
};

const TabsHorizontal = ({
  tabItems,
  remove,
  activeKey,
}: {
  tabItems: RecordTab[];
  remove: (targetKey: string) => void;
  activeKey: string;
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(false);
  const scrollTabs = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth / 2;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const checkForScrollIndicators = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setShowLeftScroll(container.scrollLeft > 20);
      setShowRightScroll(
        container.scrollWidth > container.clientWidth &&
          container.scrollLeft < container.scrollWidth - container.clientWidth,
      );
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      checkForScrollIndicators();
      container.addEventListener("scroll", checkForScrollIndicators);
      window.addEventListener("resize", checkForScrollIndicators);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", checkForScrollIndicators);
        window.removeEventListener("resize", checkForScrollIndicators);
      }
    };
  }, [checkForScrollIndicators, tabItems]);

  return (
    <div className="relative w-full">
      {showLeftScroll && (
        <div className="absolute bottom-0 left-0 top-1/2 z-10 flex -translate-y-1/2 items-center">
          <div className="from-background bg-linear-to-r absolute bottom-0 left-0 top-0 w-12 to-transparent"></div>
          <Button
            className="bg-background/80 hover:bg-background z-20 flex items-center justify-center rounded-sm p-1 shadow-sm"
            variant="outline"
            size="icon"
            onClick={() => {
              scrollTabs("left");
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      )}

      {showRightScroll && (
        <div className="absolute right-0 top-1/2 z-10 flex -translate-y-1/2 items-center">
          <div className="from-background bg-linear-to-r absolute bottom-0 right-0 top-0 w-12 to-transparent"></div>
          <Button
            className="bg-background/80 hover:bg-background z-20 flex items-center justify-center rounded-sm p-1 shadow-sm"
            variant="outline"
            size="icon"
            onClick={() => {
              scrollTabs("right");
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div
        ref={scrollContainerRef}
        className="w-full overflow-x-auto"
        onScroll={checkForScrollIndicators}
      >
        <TabsList className="inline-flex w-fit items-end justify-start rounded-none rounded-t-md p-0">
          {tabItems.map((item, index) => {
            const isActive = activeKey === item.key;
            const prevIsActive = tabItems[index - 1]?.key === activeKey;
            return (
              <span
                key={item.key}
                className={cn(
                  "relative flex min-w-4 items-center overflow-hidden",
                  item.key === "table" && "flex-none",
                )}
              >
                <TabsTrigger
                  value={item.key}
                  onMouseDown={(e) => {
                    if (e.button === 1 && item.closable) {
                      e.preventDefault();
                      remove(item.key);
                    }
                  }}
                  className={cn(
                    "inline-flex items-center whitespace-nowrap rounded-none rounded-t-md border-0 px-4 py-2 text-center text-sm transition-all",
                    item.closable && "pr-[40px]",
                    isActive
                      ? "dark:bg-card! text-card-foreground bg-white!"
                      : "cursor-base text-muted-foreground light:bg-gray-200",
                  )}
                >
                  {item.label}
                </TabsTrigger>
                {item.closable && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "hover:bg-muted absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2 transform rounded p-[2px]",
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(item.key);
                    }}
                  >
                    <X className="h-full w-full" />
                  </Button>
                )}
                <Separator orientation="vertical" />
              </span>
            );
          })}
        </TabsList>
      </div>
    </div>
  );
};

export default TabsHorizontal;
