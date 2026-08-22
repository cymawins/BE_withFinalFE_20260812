import { Outlet } from "react-router-dom";
import NoticeProvider from "../../../provider/NoticeProvider";
import { SubPageLayout } from "@/components/layout/SubPageLayout";
import BoardBackButton from "@/components/board/BoardBackButton";

export default function Notices() {
  return (
    <SubPageLayout hideBackground>
      <NoticeProvider>
        <section className="neo-page-hero">
          <div className="board-hero-row">
            <div>
              <h1>
                공지<span>사항</span>
              </h1>
              <p>키우다의 다양한 소식을 확인해보세요.</p>
            </div>
            <BoardBackButton fallback="/" label="뒤로가기" />
          </div>
        </section>
        <section className="neo-content">
          <div className="neo-panel board-panel">
            <Outlet />
          </div>
        </section>
      </NoticeProvider>
    </SubPageLayout>
  );
}
