-- =====================================================================
-- 키:우다(KIUDA) DATABASE SCHEMA v7 (confirmed) v2
-- MySQL 8.0.16+
--
-- 이 파일은 db/kiuda_db_schema_v7_confirmed_20260811.sql(v6, User/DirectMessage에
-- ALTER만 적용하는 "델타" 스크립트)의 후속이 아니라, 2026-08-12 기준으로 실제
-- 구현·검증까지 끝난 React SPA(Vite+TS+Tailwind, kiuda-platform/) 10개 화면의
-- 데이터 요구사항을 처음부터 다시 반영한 "완전한(standalone) 전체 스키마"이다.
-- 즉 이 파일 하나만 새 데이터베이스에 그대로 실행하면 전체 스키마가 만들어진다.
--
-- 대상 화면 (kiuda-platform/src/App.tsx 라우트 기준, 총 10개):
--   / (랜딩) · /login · /signup · /dashboard(보다) · /ask(묻다) ·
--   /connect(잇다) · /share(나누다) · /profile · /settings/account · /admin
--
-- [v6 대비 확인/변경 사항]
--   - v6는 User/DirectMessage에 대한 ALTER + Admin/AdminActivityLog 2개
--     CREATE TABLE만 담은 델타였고, 그 전제였던 v5 기반 테이블
--     (User, UserPlant, CareSchedule, AIOutput, WeatherInfo, LocalRiskAlert,
--      AIQueryLog, RetrievalContext, Follow, HelpPost, Event, GrowthStory,
--      PlantPhoto, CommunityInteraction, BookMark, Tag/StoryTag, DirectMessage)
--     의 실제 CREATE TABLE 정의는 이 세션에 존재하지 않았다.
--   - 이번 버전은 그 전체 테이블을 실제 구현된 프론트엔드 목업 데이터
--     (src/data/*.ts) 및 화면 로직(각 페이지 컴포넌트)에 맞춰 처음부터 다시
--     정의했다. v6에서 확정된 항목(User 공개범위/탈퇴/정지 플래그,
--     DirectMessage 삭제 플래그, Admin, AdminActivityLog)은 그대로 유지했다.
--   - User.login_type 컬럼 신규 추가 — 로그인 화면의 Apple/Google 소셜 로그인
--     버튼(현재는 UI만 존재)에 대응할 수 있도록 자리를 마련해 두었다.
--   - CommunityInteraction(범용 상호작용 테이블)이라는 이름 대신, 실제 화면에서
--     명확히 구분되는 3가지 상호작용 — 좋아요(StoryLike), 댓글(StoryComment),
--     북마크(BookMark) — 를 각각 별도 테이블로 confirm했다. (settings-account.dc.html
--     계정 삭제 안내문의 "좋아요, 댓글, 북마크" 문구와 1:1 대응)
--   - PlantPhoto는 화면상 GrowthStory 1건당 사진 1장만 쓰이는 것으로 확인되어
--     별도 테이블 대신 GrowthStory.photo_url 컬럼으로 단순화했다. (다중 사진이
--     필요해지면 이후 버전에서 별도 테이블로 분리 가능)
--   - RetrievalContext(AI 답변 근거/출처) 테이블명은 AIDiagnosisStep으로
--     confirm — 실제 화면(ask.dc.html)에서 AI 응답은 "근거 문헌 인용"이 아니라
--     진단명 + 확신도 + 사유 + 단계별 케어 방법(steps 배열) 구조이기 때문.
--
-- 명명 규칙: 테이블명 PascalCase 단수형, 컬럼명 snake_case (v6과 동일 컨벤션)
-- ENUM 성격의 값은 v6(AdminActivityLog.target_type)과 동일하게
-- VARCHAR + CHECK 제약으로 표현한다 (네이티브 ENUM 대신 — 값 추가 시 스키마
-- 변경 영향 범위를 CHECK 제약 수정으로 한정하기 위함).
-- =====================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- =====================================================================
-- 1) User — 계정 (로그인/회원가입, 계정 설정, 관리자 사용자 관리 공통)
-- =====================================================================
CREATE TABLE User (
    user_id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    email              VARCHAR(100) NOT NULL UNIQUE,
    password_hash      VARCHAR(255) NOT NULL,
    name               VARCHAR(50)  NOT NULL,

    -- 로그인 화면 소셜 로그인 버튼(Apple/Google) 대응. 이메일 가입이 기본값.
    login_type         VARCHAR(10) NOT NULL DEFAULT 'EMAIL',

    -- 회원가입 2단계(지역 선택) / 계정 설정 "기본 정보" 화면
    -- province/district는 data/regions.ts의 시/도-시/군/구 셀렉트 값과 1:1 매칭
    province           VARCHAR(30) NULL,
    district           VARCHAR(30) NULL,
    latitude           DECIMAL(10,7) NULL,   -- 잇다(connect) "현재 위치 · GPS 기반" 지도용
    longitude          DECIMAL(10,7) NULL,

    -- 계정 설정 화면 "프라이버시" 토글 3종
    profile_public     BOOLEAN NOT NULL DEFAULT TRUE,
    growth_public      BOOLEAN NOT NULL DEFAULT TRUE,
    location_shared    BOOLEAN NOT NULL DEFAULT TRUE,

    -- 회원가입 3단계(약관 동의)
    marketing_agreed   BOOLEAN NOT NULL DEFAULT FALSE,
    terms_agreed_at    DATETIME NOT NULL,

    -- 관리자 "사용자 관리" 탭 — 일시정지
    is_suspended       BOOLEAN NOT NULL DEFAULT FALSE,
    suspended_at       DATETIME NULL,

    -- 계정 설정 "계정 삭제" / 관리자 "탈퇴 관리" 탭 (소프트 삭제 — 물리 삭제 아님)
    is_withdrawn       BOOLEAN NOT NULL DEFAULT FALSE,
    withdrawn_at       DATETIME NULL,
    withdrawal_reason  VARCHAR(200) NULL,

    created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_user_login_type CHECK (login_type IN ('EMAIL', 'APPLE', 'GOOGLE'))
);

CREATE INDEX idx_user_region ON User(province, district);
CREATE INDEX idx_user_withdrawn ON User(is_withdrawn, withdrawn_at DESC);
CREATE INDEX idx_user_suspended ON User(is_suspended);

-- =====================================================================
-- 2) UserPlant — 키움터 (보다/dashboard, 내 정보/profile 공통)
-- =====================================================================
CREATE TABLE UserPlant (
    user_plant_id     BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id           BIGINT NOT NULL,

    species_name      VARCHAR(50) NOT NULL,   -- 예: 방울토마토
    nickname          VARCHAR(50) NOT NULL,   -- 예: 우리집 방울이
    status            VARCHAR(10) NOT NULL DEFAULT 'GROWING',
    environment       VARCHAR(10) NOT NULL,

    -- 카드에 표기되는 지역 텍스트. User.province/district와 별개로 키움이 단위로
    -- 다른 위치(예: 주말농장)를 가질 수 있어 개별 컬럼으로 둔다.
    planted_location  VARCHAR(50) NOT NULL,
    planted_at        DATE NOT NULL,
    last_watered_at   DATETIME NULL,
    image_url         VARCHAR(255) NULL,

    created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_userplant_user FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    CONSTRAINT chk_userplant_status CHECK (status IN ('GROWING', 'HARVESTED', 'DEAD', 'ARCHIVED')),
    CONSTRAINT chk_userplant_environment CHECK (environment IN ('INDOOR', 'OUTDOOR'))
);

CREATE INDEX idx_userplant_user_status ON UserPlant(user_id, status);

-- =====================================================================
-- 3) CareChecklistItem — 보다 화면 "오늘의 체크리스트" (2/4 진행률)
-- =====================================================================
CREATE TABLE CareChecklistItem (
    checklist_item_id  BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id            BIGINT NOT NULL,
    user_plant_id      BIGINT NULL,   -- 특정 키움이 지정 항목이면 연결, 일반 항목(예: 잡초 제거)이면 NULL
    label              VARCHAR(100) NOT NULL,
    is_done            BOOLEAN NOT NULL DEFAULT FALSE,
    checklist_date     DATE NOT NULL,   -- 일 단위로 리셋되는 체크리스트
    created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_checklist_user FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_checklist_userplant FOREIGN KEY (user_plant_id) REFERENCES UserPlant(user_plant_id) ON DELETE CASCADE
);

CREATE INDEX idx_checklist_user_date ON CareChecklistItem(user_id, checklist_date);

-- =====================================================================
-- 4) WeatherSnapshot — 보다 화면 "오늘의 날씨" 카드 (외부 API 캐시 성격)
-- =====================================================================
CREATE TABLE WeatherSnapshot (
    weather_id        BIGINT AUTO_INCREMENT PRIMARY KEY,
    region            VARCHAR(50) NOT NULL,
    temperature_c     DECIMAL(4,1) NOT NULL,
    condition_label   VARCHAR(20) NOT NULL,   -- 예: 맑음
    humidity_percent  TINYINT UNSIGNED NOT NULL,
    summary_message   VARCHAR(100) NULL,     -- 예: 물주기 좋은 날
    recorded_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_weather_region_recorded ON WeatherSnapshot(region, recorded_at DESC);

-- =====================================================================
-- 5) PestRiskAlert — 보다 화면 "병해충 주의보" 카드
-- =====================================================================
CREATE TABLE PestRiskAlert (
    alert_id    BIGINT AUTO_INCREMENT PRIMARY KEY,
    region      VARCHAR(50) NOT NULL,
    pest_name   VARCHAR(50) NOT NULL,   -- 예: 진딧물
    risk_level  VARCHAR(10) NOT NULL,
    message     VARCHAR(200) NOT NULL,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_pestalert_risk_level CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH'))
);

CREATE INDEX idx_pestalert_region_created ON PestRiskAlert(region, created_at DESC);

-- =====================================================================
-- 6) AIQueryLog — 묻다 화면 채팅 질문 로그
-- =====================================================================
CREATE TABLE AIQueryLog (
    query_id       BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id        BIGINT NOT NULL,
    question_text  VARCHAR(500) NOT NULL,
    image_url      VARCHAR(255) NULL,   -- 사진 첨부 (첨부 제거 버튼 UI 존재)
    created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_aiquery_user FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

CREATE INDEX idx_aiquery_user_created ON AIQueryLog(user_id, created_at DESC);

-- =====================================================================
-- 7) SymptomTag / AIQuerySymptomTag — 묻다 화면 "자주 묻는 증상" 칩 (다대다)
-- =====================================================================
CREATE TABLE SymptomTag (
    symptom_tag_id  BIGINT AUTO_INCREMENT PRIMARY KEY,
    icon            VARCHAR(10) NOT NULL,   -- 예: 🍃
    label           VARCHAR(30) NOT NULL UNIQUE   -- 예: 잎이 노래져요
);

CREATE TABLE AIQuerySymptomTag (
    query_id        BIGINT NOT NULL,
    symptom_tag_id  BIGINT NOT NULL,
    PRIMARY KEY (query_id, symptom_tag_id),

    CONSTRAINT fk_aiquerytag_query FOREIGN KEY (query_id) REFERENCES AIQueryLog(query_id) ON DELETE CASCADE,
    CONSTRAINT fk_aiquerytag_tag FOREIGN KEY (symptom_tag_id) REFERENCES SymptomTag(symptom_tag_id) ON DELETE CASCADE
);

-- =====================================================================
-- 8) AIDiagnosisResult / AIDiagnosisStep — 묻다 화면 AI 진단 응답
--    (질문 하나에 확신도 순으로 여러 후보 진단이 나올 수 있음 — rank_order)
-- =====================================================================
CREATE TABLE AIDiagnosisResult (
    diagnosis_id        BIGINT AUTO_INCREMENT PRIMARY KEY,
    query_id            BIGINT NOT NULL,
    name                VARCHAR(100) NOT NULL,   -- 예: 진딧물로 인한 초기 스트레스
    confidence_percent  TINYINT UNSIGNED NOT NULL,   -- 예: 82
    reason              TEXT NOT NULL,
    rank_order          TINYINT UNSIGNED NOT NULL DEFAULT 1,
    created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_diagnosis_query FOREIGN KEY (query_id) REFERENCES AIQueryLog(query_id) ON DELETE CASCADE
);

CREATE INDEX idx_diagnosis_query_rank ON AIDiagnosisResult(query_id, rank_order);

CREATE TABLE AIDiagnosisStep (
    step_id       BIGINT AUTO_INCREMENT PRIMARY KEY,
    diagnosis_id  BIGINT NOT NULL,
    step_order    TINYINT UNSIGNED NOT NULL,
    content       VARCHAR(200) NOT NULL,

    CONSTRAINT fk_diagnosisstep_diagnosis FOREIGN KEY (diagnosis_id) REFERENCES AIDiagnosisResult(diagnosis_id) ON DELETE CASCADE
);

CREATE INDEX idx_diagnosisstep_diagnosis_order ON AIDiagnosisStep(diagnosis_id, step_order);

-- =====================================================================
-- 9) Follow — 잇다/나누다/내 정보 공통 팔로우 관계
-- =====================================================================
CREATE TABLE Follow (
    follow_id     BIGINT AUTO_INCREMENT PRIMARY KEY,
    follower_id   BIGINT NOT NULL,   -- 팔로우를 "하는" 사람
    following_id  BIGINT NOT NULL,   -- 팔로우"당하는" 사람
    created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_follow_follower FOREIGN KEY (follower_id) REFERENCES User(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_follow_following FOREIGN KEY (following_id) REFERENCES User(user_id) ON DELETE CASCADE,
    CONSTRAINT uq_follow UNIQUE (follower_id, following_id),
    CONSTRAINT chk_follow_not_self CHECK (follower_id <> following_id)
);

CREATE INDEX idx_follow_following ON Follow(following_id);

-- =====================================================================
-- 10) HelpPost — 잇다 화면 "품앗이" 나눔/요청 게시글
-- =====================================================================
CREATE TABLE HelpPost (
    help_post_id  BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id       BIGINT NOT NULL,
    type          VARCHAR(10) NOT NULL,   -- OFFER(나눔) / REQUEST(요청)
    status        VARCHAR(10) NOT NULL DEFAULT 'OPEN',
    title         VARCHAR(100) NOT NULL,
    content       VARCHAR(500) NOT NULL,
    created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_helppost_user FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    CONSTRAINT chk_helppost_type CHECK (type IN ('OFFER', 'REQUEST')),
    CONSTRAINT chk_helppost_status CHECK (status IN ('OPEN', 'COMPLETED', 'CANCELLED'))
);

CREATE INDEX idx_helppost_status_created ON HelpPost(status, created_at DESC);
CREATE INDEX idx_helppost_user ON HelpPost(user_id);

-- =====================================================================
-- 11) Event — 잇다 화면 "지역 행사 일정"
-- =====================================================================
CREATE TABLE Event (
    event_id     BIGINT AUTO_INCREMENT PRIMARY KEY,
    title        VARCHAR(100) NOT NULL,
    location     VARCHAR(100) NOT NULL,
    region       VARCHAR(50) NOT NULL,
    event_date   DATE NOT NULL,
    event_time   VARCHAR(20) NOT NULL,   -- 원본 표기 그대로("오전 10시") 자유 텍스트로 저장
    category     VARCHAR(20) NOT NULL,   -- 나눔장터/강좌/체험
    description  VARCHAR(300) NULL,
    source_url   VARCHAR(255) NULL,
    created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_event_region_date ON Event(region, event_date);

-- =====================================================================
-- 12) GrowthStory — 나누다 화면 피드 글 (잇다 "가까운 이웃" 미리보기도 동일 소스)
-- =====================================================================
CREATE TABLE GrowthStory (
    story_id       BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id        BIGINT NOT NULL,
    user_plant_id  BIGINT NULL,
    photo_url      VARCHAR(255) NULL,
    content        VARCHAR(1000) NOT NULL,
    visibility     VARCHAR(10) NOT NULL DEFAULT 'FOLLOWERS',
    created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_story_user FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_story_userplant FOREIGN KEY (user_plant_id) REFERENCES UserPlant(user_plant_id) ON DELETE SET NULL,
    CONSTRAINT chk_story_visibility CHECK (visibility IN ('PRIVATE', 'FOLLOWERS', 'PUBLIC'))
);

-- 피드/캘린더 조회 패턴 대응: 사용자별 최신순, 공개범위별 최신순,
-- 특정 날짜 클릭 시 그 날 작성 글 조회(DATE(created_at))
CREATE INDEX idx_story_user_created ON GrowthStory(user_id, created_at DESC);
CREATE INDEX idx_story_visibility_created ON GrowthStory(visibility, created_at DESC);

-- =====================================================================
-- 13) Tag / StoryTag — 나누다 화면 글 태그 (예: #상추 #새싹일지) — 다대다
-- =====================================================================
CREATE TABLE Tag (
    tag_id  BIGINT AUTO_INCREMENT PRIMARY KEY,
    name    VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE StoryTag (
    story_id  BIGINT NOT NULL,
    tag_id    BIGINT NOT NULL,
    PRIMARY KEY (story_id, tag_id),

    CONSTRAINT fk_storytag_story FOREIGN KEY (story_id) REFERENCES GrowthStory(story_id) ON DELETE CASCADE,
    CONSTRAINT fk_storytag_tag FOREIGN KEY (tag_id) REFERENCES Tag(tag_id) ON DELETE CASCADE
);

-- =====================================================================
-- 14) StoryComment — 나누다 화면 댓글
-- =====================================================================
CREATE TABLE StoryComment (
    comment_id  BIGINT AUTO_INCREMENT PRIMARY KEY,
    story_id    BIGINT NOT NULL,
    user_id     BIGINT NOT NULL,
    content     VARCHAR(300) NOT NULL,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_comment_story FOREIGN KEY (story_id) REFERENCES GrowthStory(story_id) ON DELETE CASCADE,
    CONSTRAINT fk_comment_user FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

CREATE INDEX idx_comment_story_created ON StoryComment(story_id, created_at);

-- =====================================================================
-- 15) StoryLike — 나누다 화면 좋아요 토글
-- =====================================================================
CREATE TABLE StoryLike (
    story_id    BIGINT NOT NULL,
    user_id     BIGINT NOT NULL,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (story_id, user_id),

    CONSTRAINT fk_storylike_story FOREIGN KEY (story_id) REFERENCES GrowthStory(story_id) ON DELETE CASCADE,
    CONSTRAINT fk_storylike_user FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

-- =====================================================================
-- 16) BookMark — 나누다 화면 북마크 탭
-- =====================================================================
CREATE TABLE BookMark (
    bookmark_id  BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id      BIGINT NOT NULL,
    story_id     BIGINT NOT NULL,
    created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_bookmark_user FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_bookmark_story FOREIGN KEY (story_id) REFERENCES GrowthStory(story_id) ON DELETE CASCADE,
    CONSTRAINT uq_bookmark UNIQUE (user_id, story_id)
);

-- =====================================================================
-- 17) DirectMessage — 잇다/나누다 공용 1:1 메시지
--     완전삭제 = deleted_by_sender AND deleted_by_receiver
--     부분삭제 = 둘 중 하나만 TRUE  (관리자 "메시지 삭제" 탭 판정 기준, v6과 동일)
-- =====================================================================
CREATE TABLE DirectMessage (
    message_id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    sender_id              BIGINT NOT NULL,
    receiver_id            BIGINT NOT NULL,
    content                VARCHAR(1000) NOT NULL,
    is_read                BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_by_sender      BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_by_receiver    BOOLEAN NOT NULL DEFAULT FALSE,
    deletion_requested_at  DATETIME NULL,
    created_at             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- 대화 상대는 소프트 탈퇴(is_withdrawn) 상태여도 메시지 기록 자체는
    -- 남아야 하므로(관리자 "메시지 삭제" 탭 대상), 물리적 User 삭제가 발생하지
    -- 않는 것을 전제로 RESTRICT로 둔다.
    CONSTRAINT fk_dm_sender FOREIGN KEY (sender_id) REFERENCES User(user_id) ON DELETE RESTRICT,
    CONSTRAINT fk_dm_receiver FOREIGN KEY (receiver_id) REFERENCES User(user_id) ON DELETE RESTRICT,
    CONSTRAINT chk_dm_not_self CHECK (sender_id <> receiver_id)
);

-- 두 사용자 간 대화 스레드 조회(양방향) + 관리자 삭제 이력 조회
CREATE INDEX idx_dm_thread ON DirectMessage(sender_id, receiver_id, created_at);
CREATE INDEX idx_dm_thread_rev ON DirectMessage(receiver_id, sender_id, created_at);
CREATE INDEX idx_dm_deletion ON DirectMessage(deleted_by_sender, deleted_by_receiver, deletion_requested_at DESC);

-- =====================================================================
-- 18) Admin — 관리자 계정
-- =====================================================================
CREATE TABLE Admin (
    admin_id       BIGINT AUTO_INCREMENT PRIMARY KEY,
    email          VARCHAR(100) NOT NULL UNIQUE,
    password_hash  VARCHAR(255) NOT NULL,
    name           VARCHAR(50) NOT NULL,
    created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================================
-- 19) AdminActivityLog — 관리자 대시보드 "로그" 탭
-- =====================================================================
CREATE TABLE AdminActivityLog (
    log_id       BIGINT AUTO_INCREMENT PRIMARY KEY,
    admin_id     BIGINT NOT NULL,
    action       VARCHAR(100) NOT NULL,   -- 예: "사용자 일시정지", "메시지 삭제 처리", "탈퇴 사용자 복구"
    target_type  VARCHAR(30) NOT NULL,   -- 예: 'USER', 'DIRECT_MESSAGE'
    target_id    BIGINT NOT NULL,
    is_success   BOOLEAN NOT NULL DEFAULT TRUE,
    created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_adminlog_admin FOREIGN KEY (admin_id) REFERENCES Admin(admin_id) ON DELETE CASCADE,
    CONSTRAINT chk_adminlog_target_type CHECK (target_type IN ('USER', 'DIRECT_MESSAGE'))
);

CREATE INDEX idx_adminlog_admin_created ON AdminActivityLog(admin_id, created_at DESC);
CREATE INDEX idx_adminlog_target ON AdminActivityLog(target_type, target_id);

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================================
-- 화면 ↔ 테이블 매핑 (v7 confirmed v2, 전체 10개 라우트 기준)
-- =====================================================================
-- 랜딩(/)              : 콘텐츠 전용, DB 미사용
-- 로그인(/login)        : User
-- 회원가입(/signup)     : User (province/district/marketing_agreed/terms_agreed_at)
-- 보다(/dashboard)      : UserPlant, CareChecklistItem, WeatherSnapshot, PestRiskAlert
-- 묻다(/ask)            : AIQueryLog, SymptomTag, AIQuerySymptomTag,
--                         AIDiagnosisResult, AIDiagnosisStep
-- 잇다(/connect)        : User(province/district/latitude/longitude), Follow,
--                         HelpPost, Event, GrowthStory(이웃 스토리 미리보기),
--                         DirectMessage
-- 나누다(/share)        : GrowthStory, Tag, StoryTag, StoryComment, StoryLike,
--                         BookMark, Follow, DirectMessage
-- 내 정보(/profile)     : User, UserPlant, Follow
-- 계정 설정(/settings/account) : User(profile_public/growth_public/location_shared/
--                         is_withdrawn/withdrawal_reason 등)
-- 관리자(/admin)        : Admin, AdminActivityLog, User(is_suspended/is_withdrawn),
--                         DirectMessage(deleted_by_sender/deleted_by_receiver),
--                         UserPlant(탈퇴 사용자 "기록된 키움이" 집계)
-- =====================================================================
