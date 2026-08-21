import React, { useEffect, useReducer } from "react";
import userReducer from "../reducer/userReducer";
import axios from "axios";
import { AUTH_KEY, URL, USER } from "../config/constants";

//<<<사용자 관련 데이타 제공 Provider 컴포넌트 정의>>>
// 1.Context객체 생성
// 2.하위 컴포넌트에 제공하는 모든 데이타(State,함수등) 정의
// 3.Provider컴포넌트 정의시 children으로 하위 컴포넌트들을 받는다
//   그리고 1에서 생성한 Context객체의 Provider로 감싼다
//   value속성에 데이타 지정

// 4.커스텀 훅 작성(hooks/useUserContext.js)
// 5.하위 컴포넌트에서는 커스텀 훅 함수를 호출해서 value속성에 지정한 데이타를 가져다 쓴다

// ※children 키워드은 React에서 기본 제공하는 Props다
//   해당 컴포넌트(UserProvider)의 자식 요소를 Props로 전달하는 역할을 한다
//   즉, <UserProvider 컴포넌트>자식 JSX들</UserProvider 컴포넌트>형태로 사용하면 
//   이 자식 JSX들이 {children:자식 JSX들} 으로 전달 된다

//1.Context객체 생성
//  -커스텀 훅(useUserContext.js)에서 import하기위해 export 시킨다
export const UserContext = React.createContext(null);


//2. 리듀서를 사용해 관리할 초기 State 정의
const initialState={
    users:[],//사용자 목록용
    isAuth:null,//로그인한 사용자 아이디 저장용
};
//3.Provider 컴포넌트 정의
export default function UserProvider({children}){
    //<<<사용자 목록 및 인증 여부를 State(users)로 관리하기 위한 리듀서 객체 생성>>>
    const [stateOfUser,dispatch] = useReducer(userReducer,initialState); 
    //<<<원격에서 모든 사용자 조회>>>
    useEffect(()=>{
        axios
            .get(URL.USERS)
            .then(res=>{
                //STATE변경을 위한  DISPATCH 호출
                dispatch({type:USER.ALL,users:res.data,isAuth:sessionStorage.getItem(AUTH_KEY.USERNAME)});

            });

    },[]);

    return <>
        {/* Context영역에 사용자 및 인증 관련 State및 dispatch 저장 */}
        {/* stateOfUser 는 {users:[{},{},...],isAuth:'KIM'} 형태 */}
        <UserContext.Provider value={{users:stateOfUser.users,isAuth:stateOfUser.isAuth,dispatch}}>
            {children}
        </UserContext.Provider>
    </>
}
