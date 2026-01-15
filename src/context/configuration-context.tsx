"use client";

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type ConfigProfileKey =
  | "logo"
  | "title"
  | "formType"
  | "homePageLink"
  | "documents"
  | "companyName"
  | "register"
  | "supportEmail";

interface configurationContextType {
  configProfile: Record<ConfigProfileKey, any>;
  setTitle: (title: string) => void;
}

const ConfigurationContext = createContext<configurationContextType>({
  configProfile: {
    logo: "",
    title: "",
    companyName: "",
    formType: "",
    homePageLink: "/",
    documents: {
      termsOfService: "/",
      privacyStatement: "/",
      submitTnc: [],
    },
    register: {
      accountCreation: "",
      title: "",
    },
    supportEmail: "",
  },
  setTitle: (title: string) => {},
});

export const ConfigurationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  // const myConfigurationQuery: any = useQuery({
  //   queryKey: ["my-configuration"],
  //   queryFn: async () => {
  //     return (
  //       await SystemConfigurationService.getSystemConfiguration(
  //         "main-page-config",
  //       )
  //     ).data;
  //   },
  //   staleTime: 0, // 5 minutes
  // });
  const myConfiguration = {
    config: {
      logo: "",
      title: "",
      companyName: "",
      formType: "",
      homePageLink: "/",
      documents: {
        termsOfService: "/",
        privacyStatement: "/",
        submitTnc: [],
      },
      register: {
        accountCreation: "",
        title: "",
      },
      supportEmail: "",
    },
  };

  const [configProfile, setConfigProfile] = useState(myConfiguration?.config);

  useEffect(() => {
    if (!myConfiguration) return;
    setConfigProfile(myConfiguration?.config);
    document.title = "Onboarding " + myConfiguration?.config?.companyName;
  }, [myConfiguration]);

  const setTitle = (title: string) => {
    document.title = title.replace(/{{name}}/g, configProfile?.companyName);
  };

  return (
    <ConfigurationContext.Provider
      value={{
        configProfile,
        setTitle,
      }}
    >
      {children}
    </ConfigurationContext.Provider>
  );
};
export const useConfigurationContext = (): configurationContextType => {
  const context = useContext(ConfigurationContext);
  if (context === undefined) {
    throw new Error(
      "useConfigurationContext must be used within a ConfigurationContext",
    );
  }
  return context;
};
