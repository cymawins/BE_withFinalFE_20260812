import loading from '../../assets/css/Loading.module.css'
///<<< 로딩 화면 >>>
//  - 라우터에 의해 라우팅되는 컴포넌트가 아니다(페이지용 컴포넌트가 아님)
export default function Loading(){

    return <>
        <div className='d-flex justify-content-center my-5'>
            <div className={loading.spinner}></div>
        </div>
    </>
}
