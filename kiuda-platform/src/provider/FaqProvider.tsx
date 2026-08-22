import React, { useReducer, type ReactNode } from "react";
import faqReducer from "../reducer/faqReducer";

interface FaqState {
  faqs: any[];
  total: number;
  current: number;
}

interface FaqContextValue extends FaqState {
  dispatch: React.Dispatch<any>;
}

export const FaqContext = React.createContext<FaqContextValue | null>(null);

//2. 리듀서를 사용해 관리할 초기 State 정의
const initialState: FaqState = {
  faqs: [], //게시글 목록용
  total: 0,
  current: 1,
};
//3.Provider 컴포넌트 정의
export default function FaqProvider({ children }: { children: ReactNode }) {
  //<<게시글 목록 / 총 게시글 수 / 현재 페이지 번호 State로 관리하기 위한 리듀서 객체 생성>>>
  const [stateOfFaq, dispatch] = useReducer(faqReducer as any, initialState);

  const { faqs, total, current } = stateOfFaq;
  return (
    <>
      <FaqContext.Provider value={{ faqs, total, current, dispatch }}>
        {children}
      </FaqContext.Provider>
    </>
  );
}
