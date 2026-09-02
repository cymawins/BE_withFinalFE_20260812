import { Outlet, Link } from "react-router-dom";
import { SubPageLayout } from "@/components/layout/SubPageLayout";
import InquiryProvider from "@/provider/InquiryProvider";

export default function Inquiry() {
  return (
    <SubPageLayout hideBackground>
      <InquiryProvider>
        <section className="neo-page-hero">
          <p className="neo-eyebrow dark">HELP</p>

          {/* board.css에 정의된 레이아웃 사용 */}
          <div className="board-hero-row">
            <h1>
              1:1<span>문의</span>
            </h1>

            <Link to="/inquiry/form" className="neo-btn neo-btn-primary">
              문의하기
            </Link>
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