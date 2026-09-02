import { useReducer, ReactNode } from "react";
import { InquiryContext } from "../context/InquiryContext";

// reducer가 아직 없다면 이 파일 안에 간단히 넣어도 됨
const initialState = {
  inquiries: [] as any[],
  total: 0,
  current: 1,
};

function inquiryReducer(state: typeof initialState, action: any) {
  switch (action.type) {
    case "all":
      return { ...state, inquiries: action.inquiries };
    case "write":
      return { ...state, current: 1, total: action.total + 1 };
    case "delete":
      return { ...state, total: action.total - 1 };
    case "current":
      return { ...state, current: action.current };
    case "total":
      return { ...state, total: action.total };
    default:
      return state;
  }
}

interface Props {
  children: ReactNode;
}

export default function InquiryProvider({ children }: Props) {
  const [state, dispatch] = useReducer(inquiryReducer, initialState);

  return (
    <InquiryContext.Provider value={{ ...state, dispatch }}>
      {children}
    </InquiryContext.Provider>
  );
}