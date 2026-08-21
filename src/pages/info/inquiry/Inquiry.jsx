import { Outlet } from "react-router-dom";
import InquiryProvider from "../../../provider/InquiryProvider";
import { SubPageLayout } from "@/components/layout/SubPageLayout";
import BoardBackButton from "@/components/board/BoardBackButton";

export default function Inquiry() {
  return (
    <SubPageLayout hideBackground>
      <InquiryProvider>
        <section className="neo-page-hero">
          <div className="board-hero-row">
            <div>
              <h1>
                1:1 <span>문의</span>
              </h1>
              <p>건의사항 / 개인 질문</p>
            </div>
            <BoardBackButton fallback="/" label="뒤로가기" />
          </div>
        </section>
        <section className="neo-content">
          <div className="neo-panel board-panel">
            <Outlet />
          </div>
        </section>
      </InquiryProvider>
    </SubPageLayout>
  );
}
