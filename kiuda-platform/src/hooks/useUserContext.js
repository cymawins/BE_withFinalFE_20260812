//  ※UserProvider컴포넌트의 자식에서는 useContext(UserContext객체) 대신
//    아래 커스텀 훅 함수를 호출 한다.

import { useContext } from "react";
import { UserContext } from "../provider/UserProvider";

//    즉,useUserContext() 호출해서 데이타를 가져다 쓴다
export const useUserContext=()=>{
    //<<< 리액트 훅 함수 호출 >>>
    const context = useContext(UserContext);
    //※UserProvider의 자식이 아닌 컴포넌트에서 호출시  context는 null
    if(!context)
        throw new Error('UserProvider자식 컴포넌트에서만 호출 할 수 있어요');
    return context;
};