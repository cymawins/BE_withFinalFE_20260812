import { NOTICE } from "../config/constants";

const noticeReducer=(state,action)=>{
    switch(action.type){
        case NOTICE.ALL://모든 게시글 목록 요청  
            console.log('========리듀서======')  
            console.log(action.notices)         
            return {...state,notices:action.notices};
        case NOTICE.WRITE://게시글 등록 요청
            //등록 후 1페이지로 
            return {...state,current:1,total:action.total+1};
        case NOTICE.DELETE://게시글 삭제 요청
            return {...state,total:action.total-1};
        case NOTICE.CURRENT://현재 페이지 변경
            return {...state,current:action.current}
        case NOTICE.TOTAL:
            return {...state,total:action.total}
        default:
            throw new Error(`존재하지 않는 액션 요청:${action.type}`);
    }
};
export default noticeReducer;