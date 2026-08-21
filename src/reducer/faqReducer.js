import { FAQ } from "../config/constants";

const faqReducer=(state,action)=>{
    switch(action.type){
        case FAQ.ALL://모든 게시글 목록 요청  
            console.log('========리듀서======')  
            console.log(action.faqs)         
            return {...state,faqs:action.faqs};
        case FAQ.WRITE://게시글 등록 요청
            //등록 후 1페이지로 
            return {...state,current:1,total:action.total+1};
        case FAQ.DELETE://게시글 삭제 요청
            return {...state,total:action.total-1};
        case FAQ.CURRENT://현재 페이지 변경
            return {...state,current:action.current}
        case FAQ.TOTAL:
            return {...state,total:action.total}
        default:
            throw new Error(`존재하지 않는 액션 요청:${action.type}`);
    }
};
export default faqReducer;