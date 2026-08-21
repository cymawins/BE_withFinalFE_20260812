import { Outlet } from "react-router-dom";
import FaqProvider from "../../../provider/FaqProvider";
import { SubPageLayout } from "@/components/layout/SubPageLayout";
import BoardBackButton from "@/components/board/BoardBackButton";

export default function Faq() {
  return (
    <SubPageLayout hideBackground>
      <FaqProvider>
        <section className="neo-page-hero">
          <div className="board-hero-row">
            <div>
              <h1>
                자주 묻는 <span>질문</span>
              </h1>
              <p>궁금한 내용을 빠르게 찾아보세요.</p>
            </div>
            <BoardBackButton fallback="/" label="뒤로가기" />
          </div>
        </section>
        <section className="neo-content">
          <div className="neo-panel board-panel">
            <Outlet />
          </div>
        </section>
      </FaqProvider>
    </SubPageLayout>
  );
}
