import { useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom"
import { AUTH_KEY, INQUIRY, URL } from "../../../config/constants";
import axios from "axios";
import { useInquiryContext } from "../../../hooks/useInquiryContext";

export default function IInputForm() {
    //<<<페이지 전환 훅>>>
    const navigate = useNavigate();
    //<<<폼 요소 제어용 Ref 객체>>>
    const titleRef = useRef<HTMLInputElement>(null);
    const contentRef = useRef<HTMLTextAreaElement>(null);
    //<<<유효성 체크 메시지 출력을 위한 State>>>
    const [titleMsg, setTitleMsg] = useState('');
    const [contentMsg, setContentMsg] = useState('');

    //<<<총 게시글 수 변경을 위한 세터 가져오기:페이징 적용시>>>
    const { total, dispatch } = useInquiryContext();
    
     //<<<게시글 등록 버튼 이벤트 처리용>>>
    const handleCreate = (e: FormEvent) => {
        e.preventDefault();//제출 기능 막기
        const titleNode = titleRef.current;
        const contentNode = contentRef.current;
        if (!titleNode || !contentNode) return;
        if (titleNode.value.trim() === '') {
            //유효성 메시지로 State 설정
            setTitleMsg('제목을 입력하세요');
            titleNode.focus();
            return;
        }
        else setTitleMsg('');
        if (contentNode.value.trim() === '') {
            //유효성 메시지로 State 설정
            setContentMsg('내용을 입력하세요');
            contentNode.focus();
            return;
        }
        else setContentMsg('');
        //<데이타 등록 하기>      
        //※JSON-SERVER는 id를 if missing, 자동으로 랜덤하게 생성해 준다.
        //단,문자열이라 정렬시 문제가 된다(문자열을 순차적으로 비교한다) 

        //세션 스토리지에 저장된 로그인한 사용자의 아이디 얻기
        const username = sessionStorage.getItem(AUTH_KEY.USERNAME);
        const postDate = new Date().toLocaleString();//오늘 날짜
        //사용자 입력값
        const title = titleNode.value.trim();
        const content = contentNode.value.trim();
        //백엔드 서버로 등록 처리 요청
       
        axios
            .post(URL.INQUIRY, { title, content, username, postDate, views: 0 })
            .then(res => {
                console.log('글 등록시 서버에서 받은 데이타:', res.data);
                //페이징 적용시: 총 게시글 수 변경
                dispatch({ type: INQUIRY.WRITE, total });
                //등록 후 목록으로 이동
                navigate('/inquiry');
            })
            .catch(e => console.log('글 등록 실패:', e));
    };


    return <>
        <form>
            <div className="mb-3 mt-3">
                <label htmlFor="title" className="form-label">제목</label>
                <input ref={titleRef} type="text" className="form-control" id="title" placeholder="제목을 입력하세요" name="title" />
                {/* 제목 유효성 체크 메시지 표시용 SPAN컴포넌트*/}
                <span style={{ color: '#FF0000' }}>{titleMsg}</span>
            </div>
            <div className="mb-3">
                <label htmlFor="content" className="form-label">내용</label>
                {/* ※JSX에서는 textarea의 컨텐츠를 value속성으로 설정 */}
                <textarea ref={contentRef} className="form-control" rows={5} id="content" name="content" placeholder="내용을 입력하세요"></textarea>
                {/* 내용 유효성 체크 메시지 표시용 SPAN컴포넌트*/}
                <span style={{ color: '#FF0000' }}>{contentMsg}</span>
            </div>
            <button type="submit" className="btn btn-primary" onClick={handleCreate}>등록</button>
        </form>
    </>
}
