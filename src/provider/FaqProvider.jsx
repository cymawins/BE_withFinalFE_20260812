import React, { useEffect, useReducer } from "react";
import axios from "axios";
import { AUTH_KEY, URL, FAQ } from "../config/constants";
import faqReducer from "../reducer/faqReducer";

export const FaqContext = React.createContext(null);


//2. 리듀서를 사용해 관리할 초기 State 정의
const initialState={
    faqs:[],//게시글 목록용
    total:0,
    current:1,
};
//3.Provider 컴포넌트 정의
export default function FaqProvider({children}){
    //<<게시글 목록 / 총 게시글 수 / 현재 페이지 번호 State로 관리하기 위한 리듀서 객체 생성>>>
    const [stateOfFaq,dispatch] = useReducer(faqReducer,initialState);

    const {faqs,total,current} = stateOfFaq;
    return <>
        <FaqContext.Provider value={{faqs,total,current,dispatch}}>
            {children}
        </FaqContext.Provider>
    
    </>

}
