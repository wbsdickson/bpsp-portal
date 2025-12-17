import numeral from "numeral";

export type Currency = {
  label: string;
  value: string;
  ccyIcon?: string;
  countryFlag?: string;
  decorationColor?: string;
  country: string;
};

export const getCurrencySymbol = (currencyCode: string | undefined) => {
  if (!currencyCode) {
    return "";
  }
  const formatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const formatted = formatter.format(0);

  return formatted.replace(/[0-9\s]+/g, "");
};

export const Currencies: Array<Currency> = [
  {
    label: "All",
    value: "ALL",
    country: "all",
  },
  {
    label: "Euro (EUR)",
    value: "EUR",
    ccyIcon: "/flags/eur-96.png",
    decorationColor: "#000000",
    country: "germany",
    countryFlag: "/flags/ger-100.png",
  },
  {
    label: "Euro (EUR)",
    value: "EUR",
    ccyIcon: "/flags/eur-96.png",
    decorationColor: "#0055A4",
    country: "france",
    countryFlag: "/flags/fra-100.png",
  },
  {
    label: "Euro (EUR)",
    value: "EUR",
    ccyIcon: "/flags/eur-96.png",
    decorationColor: "#0055A4",
    country: "italy",
    countryFlag: "/flags/italy-96.png",
  },
  {
    label: "Euro (EUR)",
    value: "EUR",
    ccyIcon: "/flags/eur-96.png",
    decorationColor: "#AA151B",
    country: "spain",
    countryFlag: "/flags/spain-96.png",
  },
  {
    label: "Euro (EUR)",
    value: "EUR",
    ccyIcon: "/flags/eur-96.png",
    decorationColor: "#21468B",
    country: "netherlands",
    countryFlag: "/flags/netherlands-96.png",
  },
  {
    label: "Euro (EUR)",
    value: "EUR",
    ccyIcon: "/flags/eur-96.png",
    decorationColor: "#D72323",
    country: "portugal",
    countryFlag: "/flags/portugal-96.png",
  },
  {
    label: "Euro (EUR)",
    value: "EUR",
    ccyIcon: "/flags/eur-96.png",
    decorationColor: "#000000",
    country: "belgium",
    countryFlag: "/flags/belgium-96.png",
  },
  {
    label: "Euro (EUR)",
    value: "EUR",
    ccyIcon: "/flags/eur-96.png",
    decorationColor: "#ED2939",
    country: "austria",
    countryFlag: "/flags/austria-96.png",
  },
  {
    label: "Thai Baht (THB)",
    value: "THB",
    ccyIcon: "/flags/thb-96.png",
    decorationColor: "#00247D",
    country: "thailand",
    countryFlag: "/flags/thb-96.png",
  },
  {
    label: "South Korean Won (KRW)",
    value: "KRW",
    ccyIcon: "/flags/krw-96.png",
    decorationColor: "#CD2E3A",
    country: "south-korea",
    countryFlag: "/flags/krw-96.png",
  },
  {
    label: "New Zealand Dollar (NZD)",
    value: "NZD",
    ccyIcon: "/flags/nzd-96.png",
    decorationColor: "#00247D",
    country: "new-zealand",
    countryFlag: "/flags/nzd-96.png",
  },
  {
    label: "Euro (EUR)",
    value: "EUR",
    ccyIcon: "/flags/eur-96.png",
    decorationColor: "#169B62",
    country: "ireland",
    countryFlag: "/flags/ireland-96.png",
  },
  {
    label: "Japanese Yen (JPY)",
    value: "JPY",
    ccyIcon: "/flags/jpy-96.png",
    decorationColor: "#dc0004",
    country: "japan",
    countryFlag: "/flags/jpy-96.png",
  },
  {
    label: "United States Dollar (USD)",
    value: "USD",
    ccyIcon: "/flags/usa-96.png",
    decorationColor: "#4250bb",
    country: "united-states",
    countryFlag: "/flags/usa-96.png",
  },
  {
    label: "Euro (EUR)",
    value: "EUR",
    ccyIcon: "/flags/eur-96.png",
    country: "eurozone",
    countryFlag: "/flags/eur-96.png",
  },
  {
    label: "Sterling (GBP)",
    value: "GBP",
    ccyIcon: "/flags/gbp-96.png",
    country: "united-kingdom",
    countryFlag: "/flags/gbp-96.png",
  },
  {
    label: "Renminbi (CNY)",
    value: "CNY",
    ccyIcon: "/flags/cny-96.png",
    country: "china",
    countryFlag: "/flags/cny-96.png",
  },
  {
    label: "Australian Dollar (AUD)",
    value: "AUD",
    ccyIcon: "/flags/aus-96.png",
    country: "australia",
    countryFlag: "/flags/aus-96.png",
  },
  {
    label: "Canadian Dollar (CAD)",
    value: "CAD",
    ccyIcon: "/flags/cad-96.png",
    country: "canada",
    countryFlag: "/flags/cad-96.png",
  },
  {
    label: "Swiss Franc (CHF)",
    value: "CHF",
    ccyIcon: "/flags/chf-96.png",
    country: "switzerland",
    countryFlag: "/flags/chf-96.png",
  },
  {
    label: "Hong Kong Dollar (HKD)",
    value: "HKD",
    ccyIcon: "/flags/hkd-96.png",
    country: "hong-kong",
    countryFlag: "/flags/hkd-96.png",
  },
  {
    label: "Singapore Dollar (SGD)",
    value: "SGD",
    ccyIcon: "/flags/sgd-96.png",
    country: "singapore",
    countryFlag: "/flags/sgd-96.png",
  },
  {
    label: "Swedish Krona (SEK)",
    value: "SEK",
    ccyIcon: "/flags/sek-96.png",
    country: "sweden",
    countryFlag: "/flags/sek-96.png",
  },
  {
    label: "South Korean Won (KRW)",
    value: "KRW",
    ccyIcon: "/flags/krw-96.png",
    country: "south-korea",
    countryFlag: "/flags/krw-96.png",
  },
  {
    label: "Norwegian Krone (NOK)",
    value: "NOK",
    ccyIcon: "/flags/nok-96.png",
    country: "norway",
    countryFlag: "/flags/nok-96.png",
  },
  {
    label: "New Zealand Dollar (NZD)",
    value: "NZD",
    ccyIcon: "/flags/nzd-96.png",
    country: "new-zealand",
    countryFlag: "/flags/nzd-96.png",
  },
  {
    label: "Indian Rupee (INR)",
    value: "INR",
    ccyIcon: "/flags/inr-96.png",
    country: "india",
    countryFlag: "/flags/inr-96.png",
  },
  {
    label: "Mexican Peso (MXN)",
    value: "MXN",
    ccyIcon: "/flags/nzd-96.png",
    country: "mexico",
    countryFlag: "/flags/nzd-96.png",
  },
  {
    label: "New Taiwan Dollar (TWD)",
    value: "TWD",
    ccyIcon: "/flags/twd-64.png",
    country: "taiwan",
    countryFlag: "/flags/twd-64.png",
  },
  {
    label: "South African Rand (ZAR)",
    value: "ZAR",
    ccyIcon: "/flags/zar-96.png",
    country: "south-africa",
    countryFlag: "/flags/zar-96.png",
  },
  {
    label: "Brazilian Real (BRL)",
    value: "BRL",
    ccyIcon: "/flags/brl-96.png",
    country: "brazil",
    countryFlag: "/flags/brl-96.png",
  },
  {
    label: "Danish Krone (DKK)",
    value: "DKK",
    ccyIcon: "/flags/dkk-96.png",
    country: "denmark",
    countryFlag: "/flags/dkk-96.png",
  },
  {
    label: "Polish Złoty (PLN)",
    value: "PLN",
    ccyIcon: "/flags/pln-96.png",
    country: "poland",
    countryFlag: "/flags/pln-96.png",
  },
  {
    label: "Thai Baht (THB)",
    value: "THB",
    ccyIcon: "/flags/thb-96.png",
    country: "thailand",
    countryFlag: "/flags/thb-96.png",
  },
  {
    label: "Israeli New Shekel (ILS)",
    value: "ILS",
    ccyIcon: "/flags/ils-96.png",
    country: "israel",
    countryFlag: "/flags/ils-96.png",
  },
  {
    label: "Indonesian Rupiah (IDR)",
    value: "IDR",
    ccyIcon: "/flags/idr-96.png",
    country: "indonesia",
    countryFlag: "/flags/idr-96.png",
  },
  {
    label: "Czech Koruna (CZK)",
    value: "CZK",
    ccyIcon: "/flags/czk-96.png",
    country: "czech-republic",
    countryFlag: "/flags/czk-96.png",
  },
  {
    label: "UAE Dirham (AED)",
    value: "AED",
    ccyIcon: "/flags/aed-96.png",
    country: "united-arab-emirates",
    countryFlag: "/flags/aed-96.png",
  },
  {
    label: "Turkish Lira (TRY)",
    value: "TRY",
    ccyIcon: "/flags/try-96.png",
    country: "turkey",
    countryFlag: "/flags/try-96.png",
  },
  {
    label: "Hungarian Forint (HUF)",
    value: "HUF",
    ccyIcon: "/flags/huf-96.png",
    country: "hungary",
    countryFlag: "/flags/huf-96.png",
  },
  {
    label: "Chilean Peso (CLP)",
    value: "CLP",
    ccyIcon: "/flags/clp-96.png",
    country: "chile",
    countryFlag: "/flags/clp-96.png",
  },
  {
    label: "Saudi Riyal (SAR)",
    value: "SAR",
    ccyIcon: "/flags/sar-96.png",
    country: "saudi-arabia",
    countryFlag: "/flags/sar-96.png",
  },
  {
    label: "Philippine Peso (PHP)",
    value: "PHP",
    ccyIcon: "/flags/php-96.png",
    country: "philippines",
    countryFlag: "/flags/php-96.png",
  },
  {
    label: "Malaysian Ringgit (MYR)",
    value: "MYR",
    ccyIcon: "/flags/myr-96.png",
    country: "malaysia",
    countryFlag: "/flags/myr-96.png",
  },
  {
    label: "Colombian Peso (COP)",
    value: "COP",
    ccyIcon: "/flags/cop-96.png",
    country: "colombia",
    countryFlag: "/flags/cop-96.png",
  },
  {
    label: "Russian Ruble (RUB)",
    value: "RUB",
    ccyIcon: "/flags/rub-96.png",
    country: "russia",
    countryFlag: "/flags/rub-96.png",
  },
  {
    label: "Romanian Leu (RON)",
    value: "RON",
    ccyIcon: "/flags/ron-96.png",
    country: "romania",
    countryFlag: "/flags/ron-96.png",
  },
  {
    label: "Peruvian Sol (PEN)",
    value: "PEN",
    ccyIcon: "/flags/pen-96.png",
    country: "peru",
    countryFlag: "/flags/pen-96.png",
  },
  {
    label: "Bahraini Dinar (BHD)",
    value: "BHD",
    ccyIcon: "/flags/bhd-96.png",
    country: "bahrain",
    countryFlag: "/flags/bhd-96.png",
  },
  {
    label: "Bulgarian Lev (BGN)",
    value: "BGN",
    ccyIcon: "/flags/bgn-96.png",
    country: "bulgaria",
    countryFlag: "/flags/bgn-96.png",
  },
  {
    label: "Argentine Peso (ARS)",
    value: "ARS",
    ccyIcon: "/flags/ars-96.png",
    country: "argentina",
    countryFlag: "/flags/ars-96.png",
  },
  {
    label: "Vietnam Dong (VND)",
    value: "VND",
    ccyIcon: "/flags/vietnam-96.png",
    country: "vietnam",
    countryFlag: "/flags/vietnam-96.png",
  },
];

interface CurrencyOptions {
  selectedCurrencies?: Array<string>;
  isSelectAll?: boolean;
  excludedCurrencies?: Array<string>;
}

export function getCurrencyDetails(currencies: Array<string>) {
  const results: Record<string, Currency> = {};

  currencies.forEach((code) => {
    const currencyDetail = Currencies.find(
      (currency) => currency.value.toLowerCase() === code.toLowerCase(),
    );
    if (currencyDetail) {
      results[code.toLowerCase()] = currencyDetail;
    }
  });

  return results;
}

export function getCurrencyOptions(options: CurrencyOptions): Array<Currency> {
  const { selectedCurrencies, isSelectAll, excludedCurrencies } = options;

  const selectedLowerCase = selectedCurrencies?.map((value) =>
    value.toLowerCase(),
  );
  const excludedLowerCase = excludedCurrencies?.map((value) =>
    value.toLowerCase(),
  );
  if (isSelectAll) {
    return Currencies.filter(
      (currency) => !excludedLowerCase?.includes(currency.value.toLowerCase()),
    );
  }
  return Currencies.filter(
    (currency) =>
      selectedLowerCase?.includes(currency.value.toLowerCase()) &&
      !excludedLowerCase?.includes(currency.value.toLowerCase()),
  );
}

export function formatCurrencyWithAbbreviation(
  amount: string,
  currency?: string,
) {
  let format;
  const amountNumber = Number(amount);
  if (amountNumber >= 1e9) {
    // Billion
    format = "0.0a";
  } else if (amountNumber >= 1e6) {
    // Million
    format = "0.0a";
  } else if (amountNumber >= 1e3) {
    // Thousand
    format = "0.0a";
  } else {
    // Default format for smaller numbers
    format = "0,0";
  }

  let formattedAmount = numeral(amountNumber).format(format);

  formattedAmount = formattedAmount
    .replace("m", "M")
    .replace("b", "B")
    .replace("k", "K");

  return currency
    ? `${getCurrencySymbol(currency)} ${formattedAmount}`
    : formattedAmount;
}

export const formattedAmount = (amount: number | string, ccy?: string) => {
  const amountNumber = Number(amount);
  return new Intl.NumberFormat(ccy === "JPY" ? "ja-JP" : "en-US", {
    minimumFractionDigits: ccy === "JPY" ? 0 : 2,
    maximumFractionDigits: ccy === "JPY" ? 0 : 2,
  }).format(amountNumber);
};
