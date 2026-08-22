
import { useContext } from "react";
import { FaqContext } from "../provider/FaqProvider";

export const useFaqContext=()=>{
    //<<< 리액트 훅 함수 호출 >>>
    const context = useContext(FaqContext);
    //※FaqProvider의 자식이 아닌 컴포넌트에서 호출시  context는 null
    if(!context)
        throw new Error('FaqProvider자식 컴포넌트에서만 호출 할 수 있어요');
    return context;
};