import React, { useEffect, useReducer, type ReactNode } from "react";
import userReducer from "../reducer/userReducer";
import axios from "axios";
import { AUTH_KEY, URL, USER } from "../config/constants";

//1.Context객체 생성
//  -커스텀 훅(useUserContext.js)에서 import하기위해 export 시킨다
export const UserContext = React.createContext<{
  users: any[];
  isAuth: string | null;
  dispatch: React.Dispatch<any>;
} | null>(null);

//2. 리듀서를 사용해 관리할 초기 State 정의
const initialState = {
  users: [] as any[], //사용자 목록용
  isAuth: null as string | null, //로그인한 사용자 아이디 저장용
};
//3.Provider 컴포넌트 정의
export default function UserProvider({ children }: { children: ReactNode }) {
  //<<<사용자 목록 및 인증 여부를 State(users)로 관리하기 위한 리듀서 객체 생성>>>
  const [stateOfUser, dispatch] = useReducer(userReducer as any, initialState);
  //<<<원격에서 모든 사용자 조회>>>
  useEffect(() => {
    axios.get(URL.USERS).then((res) => {
      //STATE변경을 위한  DISPATCH 호출
      dispatch({
        type: USER.ALL,
        users: res.data,
        isAuth: sessionStorage.getItem(AUTH_KEY.USERNAME),
      });
    });
  }, []);

  return (
    <>
      {/* Context영역에 사용자 및 인증 관련 State및 dispatch 저장 */}
      {/* stateOfUser 는 {users:[{},{},...],isAuth:'KIM'} 형태 */}
      <UserContext.Provider
        value={{
          users: stateOfUser.users,
          isAuth: stateOfUser.isAuth,
          dispatch,
        }}
      >
        {children}
      </UserContext.Provider>
    </>
  );
}
