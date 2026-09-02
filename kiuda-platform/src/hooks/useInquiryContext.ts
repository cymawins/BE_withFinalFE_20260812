import { useContext } from "react";
import { InquiryContext } from "../context/InquiryContext";

export function useInquiryContext() {
  const context = useContext(InquiryContext);

  if (!context) {
    throw new Error("useInquiryContext must be used within InquiryProvider");
  }

  return context;
}