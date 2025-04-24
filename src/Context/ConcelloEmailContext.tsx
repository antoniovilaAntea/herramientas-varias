import React, { createContext, useContext, useState, useEffect } from "react";
import emails from "../Data/emailData";

interface ConcelloEmail {
  concello: string;
  email: string;
  email2?: string;
  extra?: string;
}

interface ConcelloEmailContextType {
  concellosEmails: ConcelloEmail[];
  setConcellosEmails: (emails: ConcelloEmail[]) => void;
}

const ConcelloEmailContext = createContext<
  ConcelloEmailContextType | undefined
>(undefined);

export const ConcelloEmailProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [concellosEmails, setConcellosEmails] = useState<ConcelloEmail[]>(
    () => {
      const saved = localStorage.getItem("concellosEmails");
      return saved ? JSON.parse(saved) : emails;
    }
  );

  useEffect(() => {
    localStorage.setItem("concellosEmails", JSON.stringify(concellosEmails));
  }, [concellosEmails]);

  return (
    <ConcelloEmailContext.Provider
      value={{ concellosEmails, setConcellosEmails }}
    >
      {children}
    </ConcelloEmailContext.Provider>
  );
};

export const useConcelloEmails = () => {
  const context = useContext(ConcelloEmailContext);
  if (context === undefined) {
    throw new Error(
      "useConcelloEmails must be used within a ConcelloEmailProvider"
    );
  }
  return context;
};
