import axios from "axios";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import { AUTH_KEY, URL } from "../../../config/constants";

export default function UpdateForm(){

    const navigate=useNavigate();
    const username = sessionStorage.getItem(AUTH_KEY.USERNAME);

    if (username !== 'admin') {
        alert('관리자만 글을 수정할 수 있습니다.');
        navigate('/notices');
        return null;
    }

    // 키(아이디)만 URL파라미터(useParams()훅 사용)로 받아서 키로 백엔드 서버에
    // GET요청해서 해당 글을 받아와도 된다
    // 예:GET /bbs/:id
   
    //아래는 Navigate함수의 state속성으로 게시글 하나를 전달 받아서 사용
    const {state} =useLocation() as { state: any };
    //<<입력 폼에서는 확인 버튼 클릭시 유효성 검사>>
	//<<수정 폼에서는 입력 시마다 체크해서 "실시간" 유효성 검사>>
    const [inputs,setInputs] = useState({title:state?.title ?? '',content:state?.content ?? ''})
    const {title,content}=inputs;

    //<<실시간 유효성 메시지 출력을 위한 SPAN요소 제어용>>
    const spanTitle = useRef<HTMLSpanElement>(null);
    const spanContent=useRef<HTMLSpanElement>(null);
    //<<수정 버튼 활성화/비활성화 제어용>>
    const editButton = useRef<HTMLButtonElement>(null);

    //<<입력 요소의 체인지 이벤트 처리>>
    const handleInputs=(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>{
        //console.log('%O',e.target);
        const {name,value}=e.target;
        //실시간 유효성 메시지 출력
        if(name.toUpperCase()==='TITLE'){//제목 입력시
            if(value.trim().length===0){
                if (spanTitle.current) spanTitle.current.textContent='제목을 입력하세요...';
                if (editButton.current) editButton.current.disabled=true;
            }
            else{
                if (spanTitle.current) spanTitle.current.textContent='';
                if (editButton.current) editButton.current.disabled=false;
            }
        }
        else{//내용 입력시
            if(value.trim().length===0){
                if (spanContent.current) spanContent.current.textContent='내용을 입력하세요...';
                if (editButton.current) editButton.current.disabled=true;
            }
            else{
                if (spanContent.current) spanContent.current.textContent='';
                 if (editButton.current) editButton.current.disabled=false;
            }
        }
        //입력값(제목 혹은 내용) 세터로 변경
        setInputs(prev=>({...prev,[name]:value}))

    };

    //<<수정 이벤트 처리>>
    //  -백엔드 서버로 수정 요청
    const handleUpdate=(e: FormEvent)=>{
        e.preventDefault();
        //  -수정 후 상세보기로 이동
		//※ JSON-SERVER는 수정시 반드시 모든 필드를 전달하자
        axios
            .put(`${URL.NOTICE}/${state.id}`,{...state,title,content})
            .then(res=>navigate(`/notices/${state.id}`,{state:{...state,title,content}}));

    };
    return <>
        <form>
            <div className="mb-3 mt-3">
                <label htmlFor="title" className="form-label">제목</label>
                {/*
                    ※JSX에서는 value 속성에 값을 설정하면 읽기전용이 된다
                    >>>해결책
                        - 입력값을 State로 관리해야 한다
                        - onChange이벤트에서 입력값의 변화를 세터로 변경해야 한다
                
                */}
                <input  type="text" className="form-control" id="title" placeholder="제목을 입력하세요" name="title" value={title} onChange={handleInputs}/>
                {/* 제목 유효성 체크 메시지 표시용 SPAN컴포넌트*/}
                <span ref={spanTitle} style={{ color: '#FF0000' }}></span>
            </div>
            <div className="mb-3">
                <label htmlFor="content" className="form-label">내용</label>
                {/* ※JSX에서는 textarea의 컨텐츠를 value속성으로 설정 */}
                <textarea  className="form-control" rows={5} id="content" name="content" placeholder="내용을 입력하세요" value={content} onChange={handleInputs}></textarea>
                {/* 내용 유효성 체크 메시지 표시용 SPAN컴포넌트*/}
                <span ref={spanContent} style={{ color: '#FF0000' }}></span>
            </div>
            <button ref={editButton} type="submit" className="btn btn-primary" onClick={handleUpdate} >수정</button>
        </form>
    </>
}
