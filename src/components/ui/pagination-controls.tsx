import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (items: number) => void;
}

export function PaginationControls({
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    onPageChange,
    onItemsPerPageChange,
}: PaginationControlsProps) {
    const t = useTranslations("CommonComponent.Pagination");

    return (
        <div className="flex items-center justify-between py-4">
            <div className="text-sm text-muted-foreground">
                {t("showing", {
                    from: totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1,
                    to: Math.min(currentPage * itemsPerPage, totalItems),
                    total: totalItems
                })}
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">{t("rowsPerPage")}</p>
                    <Select
                        value={`${itemsPerPage}`}
                        onValueChange={(value) => onItemsPerPageChange(Number(value))}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={itemsPerPage} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[10, 20, 30, 40, 50, 100].map((pageSize) => (
                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                    {t("page", { current: currentPage, total: totalPages })}
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                    >
                        <span className="sr-only">{t("previousPage")}</span>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                    >
                        <span className="sr-only">{t("nextPage")}</span>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
