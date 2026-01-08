import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useMemo } from "react";
export interface ActionItem<T> {
  title: string;
  icon?: React.ReactNode;
  variant?: "default" | "destructive";
  onPress: (item: T) => void;
}

export default function ActionsCell<T>({
  item,
  actions,
  t,
}: {
  item: T;
  actions: ActionItem<T>[];
  t: (key: string) => string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>{t("actions.label")}</DropdownMenuLabel>
        {actions.map((res) => {
          return (
            <DropdownMenuItem
              key={res.title}
              variant={res.variant}
              onSelect={(e) => {
                e.preventDefault();
                res.onPress(item);
              }}
            >
              {res.title}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
