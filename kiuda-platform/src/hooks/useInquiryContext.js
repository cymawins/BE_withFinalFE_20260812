
import { useContext } from "react";
import { InquiryContext } from "../provider/InquiryProvider";

export const useInquiryContext=()=>{
    //<<< 리액트 훅 함수 호출 >>>
    const context = useContext(InquiryContext);
    //※BbsProvider의 자식이 아닌 컴포넌트에서 호출시  context는 null
    if(!context)
        throw new Error('InquiryProvider자식 컴포넌트에서만 호출 할 수 있어요');
    return context;
}; 