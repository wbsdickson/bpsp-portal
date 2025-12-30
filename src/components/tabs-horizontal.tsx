import { useCallback, useEffect, useRef, useState } from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

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
  const scrollTabs = useCallback((direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth / 2;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  }, []);

  const checkForScrollIndicators = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      setShowLeftScroll(container.scrollLeft > 20);
      setShowRightScroll(
        container.scrollWidth > container.clientWidth &&
          container.scrollLeft < container.scrollWidth - container.clientWidth,
      );
    }
  }, []);

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
          <div className="absolute bottom-0 left-0 top-0 w-12"></div>
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
          <div className="absolute bottom-0 right-0 top-0 w-12"></div>
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
        className="w-full overflow-x-auto py-2"
        onScroll={checkForScrollIndicators}
      >
        <TabsList className="inline-flex whitespace-nowrap">
          {tabItems.map((item, index) => (
            <span
              key={item.key}
              className={cn(
                "relative min-w-4 items-center overflow-hidden",
                item.key === "table" && "flex-none",
                index > 0 && "border-l",
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
                  item.closable && "pr-[40px]",
                  activeKey === item.key && "data-[state=active]:text-primary",
                )}
              >
                {item.label}
              </TabsTrigger>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "p[2px] absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2 transform rounded hover:bg-gray-200",
                  !item.closable && "hidden",
                )}
                onClick={() => {
                  remove(item.key);
                }}
              >
                <X className="h-full w-full" />
              </Button>
            </span>
          ))}
        </TabsList>
      </div>
    </div>
  );
};

export default TabsHorizontal;
