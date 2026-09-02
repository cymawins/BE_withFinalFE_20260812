export const URL = {
    INQUIRY: 'http://localhost:4000/api/inquiries',
};

//<<<페이징 관련 키>>>
// PAGE_SIZE :한 페이지에 보여줄 글 수
// BLOCK_PAGE : 페이징 시 하단에 보여줄 페이지 번호의 수
export const PAGING = {PAGE_SIZE:5,BLOCK_PAGE:2}

//<<< Reducer 사용:action의 type정의 추가 >>>
// 예:
// ALL - 모든 사용자 목록 요청.LOGIN - 로그인 요청
export const USER={ALL:'all',LOGIN:'login',LOGOUT:'logout'};
// TOTAL - 총 게시글수 변경 요청,CURRENT - 현재 페이지 변경 요청
export const NOTICE={ALL:'all',TOTAL:'total',CURRENT:'current'};
// TOTAL - 총 게시글수 변경 요청,CURRENT - 현재 페이지 변경 요청
export const FAQ={ALL:'all',TOTAL:'total',CURRENT:'current'};
// TOTAL - 총 게시글수 변경 요청,CURRENT - 현재 페이지 변경 요청
export const INQUIRY={ALL:'all',WRITE:'write',DELETE:'delete',TOTAL:'total',CURRENT:'current'};
