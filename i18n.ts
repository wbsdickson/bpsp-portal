import { getRequestConfig, RequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }): Promise<RequestConfig> => {
  // Define an array of message file names (without the extension)
  const messageFiles = [
    "auth",
    "operator",
    "common-component",
    "merchant",
    // "general",
    // "user-management",
    // "rentease",
    // "route-management",
    // "payment-gateway",
  ];

  const messagesArray = await Promise.all(
    messageFiles.map(async (file) => {
      // eslint-disable-next-line @next/next/no-assign-module-variable
      const module = await import(
        `./dictionary/${locale || "ja"}/${file}.json`
      );
      return module.default;
    }),
  );

  const messages = messagesArray.reduce(
    (acc, curr) => ({ ...acc, ...curr }),
    {},
  );

  return {
    locale: locale || "ja",
    messages,
  };
});
