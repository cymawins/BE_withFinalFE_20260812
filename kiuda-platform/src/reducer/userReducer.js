//<<< 현재 STATE를 변경->새로운 STATE를 반환하는 함수:리듀서>>>
//  - 리듀서 함수 현재 STATE와 ACTION이 인자로 전달된다
//  - ACTION은 {} 객체다
//  - dispatch(action)호출시 자동 호출되는 함수이다

import { USER } from "../config/constants";

const userReducer=(state,action)=>{

    switch(action.type){
        case USER.ALL://모든 사용자 목록 요청
            return {...state,users:action.users,isAuth:action.isAuth};
        case USER.LOGIN://로그인 처리 요청
            return {...state,isAuth:action.isAuth};
        case USER.LOGOUT://로그아웃 처리 요청
            return {...state,isAuth:null};
        case USER.LIKES:
            return {...state,users:action.users.map(user=>user.username===action.username?{...user,likes:user.likes+1}: user)}
        default:
            throw new Error(`존재하지 않는 액션 요청:${action.type}`);
    }
};
export default userReducer;