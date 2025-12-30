import { useLocale } from "next-intl";
import {
  DateRangePicker as BaseDateRangePicker,
  type DateRangePickerProps,
} from "./ui/date-range-picker";
import { ja, enUS } from "date-fns/locale";

export const DateRangePicker = (props: DateRangePickerProps) => {
  const locale = useLocale();
  const calendarLocale = locale === "ja" ? ja : locale === "en" ? enUS : enUS;
  return (
    <BaseDateRangePicker
      locale={locale}
      calendarLocale={calendarLocale}
      {...props}
    />
  );
};

export default DateRangePicker;
