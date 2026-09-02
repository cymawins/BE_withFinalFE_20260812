import { createContext, Dispatch } from "react";

export interface InquiryState {
  inquiries: any[];
  total: number;
  current: number;
}

export type InquiryAction =
  | { type: string; inquiries: any[] }
  | { type: string; total: number }
  | { type: string; current: number };

export interface InquiryContextValue extends InquiryState {
  dispatch: Dispatch<InquiryAction>;
}

export const InquiryContext = createContext<InquiryContextValue | null>(null);