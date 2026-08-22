import React, { useReducer, type ReactNode } from "react";
import noticeReducer from "../reducer/noticeReducer";

interface NoticeState {
  notices: any[];
  total: number;
  current: number;
}

interface NoticeContextValue extends NoticeState {
  dispatch: React.Dispatch<any>;
}

export const NoticeContext = React.createContext<NoticeContextValue | null>(null);

//2. 리듀서를 사용해 관리할 초기 State 정의
const initialState: NoticeState = {
  notices: [], //게시글 목록용
  total: 0,
  current: 1,
};
//3.Provider 컴포넌트 정의
export default function NoticeProvider({ children }: { children: ReactNode }) {
  //<<<게시글 목록 / 총 게시글 수/ 현재 페이지 번호 State로 관리하기 위한 리듀서 객체 생성>>>
  const [stateOfNotice, dispatch] = useReducer(noticeReducer as any, initialState);

  const { notices, total, current } = stateOfNotice;
  return (
    <>
      {/* Context영역에 모든 게시글 및  dispatch 저장 */}
      <NoticeContext.Provider value={{ notices, total, current, dispatch }}>
        {children}
      </NoticeContext.Provider>
    </>
  );
}
