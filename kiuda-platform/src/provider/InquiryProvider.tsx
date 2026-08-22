import React, { useReducer, type ReactNode } from "react";
import inquiryReducer from "../reducer/inquiryReducer";

interface InquiryState {
  inquiries: any[];
  total: number;
  current: number;
}

interface InquiryContextValue extends InquiryState {
  dispatch: React.Dispatch<any>;
}

export const InquiryContext = React.createContext<InquiryContextValue | null>(null);

//2. 리듀서를 사용해 관리할 초기 State 정의
const initialState: InquiryState = {
  inquiries: [], //게시글 목록용
  total: 0,
  current: 1,
};
//3.Provider 컴포넌트 정의
export default function InquiryProvider({ children }: { children: ReactNode }) {
  //<<<게시글 목록 / 총 게시글 수/ 현재 페이지 번호 State로 관리하기 위한 리듀서 객체 생성>>>
  const [stateOfInquiry, dispatch] = useReducer(inquiryReducer as any, initialState);

  const { inquiries, total, current } = stateOfInquiry;
  return (
    <>
      {/* Context영역에 모든 게시글 및  dispatch 저장 */}
      <InquiryContext.Provider value={{ inquiries, total, current, dispatch }}>
        {children}
      </InquiryContext.Provider>
    </>
  );
}
