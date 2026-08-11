-- =====================================================================
-- FARMSCARE(키:우다) DATABASE SCHEMA v6
-- MySQL 8.0.16+
-- v5(uploads/db-schema-v5.sql) 기반, 병합된 전체 화면
-- (랜딩/로그인·회원가입/보다/묻다/잇다/나누다/내 정보/계정 설정/관리자)에 맞춰
-- 아래 항목을 추가함. v5의 테이블은 전량 그대로 유지되므로 이 파일은 v5 뒤에 이어서 실행.
--
-- [v6 변경사항]
-- 1) User — 계정 설정 화면(공개 범위 토글, 계정 삭제) 반영
--    profile_public / growth_public / location_shared,
--    is_suspended / suspended_at (관리자 "일시정지"),
--    is_withdrawn / withdrawn_at / withdrawal_reason (탈퇴 관리)
-- 2) DirectMessage — 관리자 "메시지 삭제" 탭의 부분/완전 삭제 상태 반영
--    deleted_by_sender / deleted_by_receiver / deletion_requested_at
-- 3) Admin, AdminActivityLog 신설 — 관리자 대시보드(로그인, 활동 로그) 반영
-- =====================================================================

-- --------------------------------------------------------------------
-- 1) User 확장
-- --------------------------------------------------------------------
ALTER TABLE User
  ADD COLUMN profile_public   BOOLEAN NOT NULL DEFAULT TRUE  AFTER longitude,
  ADD COLUMN growth_public    BOOLEAN NOT NULL DEFAULT TRUE  AFTER profile_public,
  ADD COLUMN location_shared  BOOLEAN NOT NULL DEFAULT TRUE  AFTER growth_public,
  ADD COLUMN is_suspended     BOOLEAN NOT NULL DEFAULT FALSE AFTER location_shared,
  ADD COLUMN suspended_at     DATETIME NULL                  AFTER is_suspended,
  ADD COLUMN is_withdrawn     BOOLEAN NOT NULL DEFAULT FALSE AFTER suspended_at,
  ADD COLUMN withdrawn_at     DATETIME NULL                  AFTER is_withdrawn,
  ADD COLUMN withdrawal_reason VARCHAR(200) NULL             AFTER withdrawn_at;

CREATE INDEX idx_user_withdrawn ON User(is_withdrawn, withdrawn_at DESC);
CREATE INDEX idx_user_suspended ON User(is_suspended);

-- --------------------------------------------------------------------
-- 2) DirectMessage 확장 — 관리자 메시지 삭제 탭
--    완전삭제 = deleted_by_sender AND deleted_by_receiver
--    부분삭제 = 둘 중 하나만 TRUE
-- --------------------------------------------------------------------
ALTER TABLE DirectMessage
  ADD COLUMN deleted_by_sender     BOOLEAN NOT NULL DEFAULT FALSE AFTER is_read,
  ADD COLUMN deleted_by_receiver   BOOLEAN NOT NULL DEFAULT FALSE AFTER deleted_by_sender,
  ADD COLUMN deletion_requested_at DATETIME NULL                  AFTER deleted_by_receiver;

CREATE INDEX idx_dm_deletion ON DirectMessage(deleted_by_sender, deleted_by_receiver, deletion_requested_at DESC);

-- --------------------------------------------------------------------
-- 3) Admin — 관리자 계정
-- --------------------------------------------------------------------
CREATE TABLE Admin (
    admin_id      BIGINT AUTO_INCREMENT PRIMARY KEY,
    email         VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name          VARCHAR(50) NOT NULL,
    created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------------------
-- 4) AdminActivityLog — 관리자 대시보드 "로그" 탭
-- --------------------------------------------------------------------
CREATE TABLE AdminActivityLog (
    log_id      BIGINT AUTO_INCREMENT PRIMARY KEY,
    admin_id    BIGINT NOT NULL,
    action      VARCHAR(100) NOT NULL, -- 예: "사용자 일시정지", "메시지 삭제 처리", "탈퇴 사용자 복구"
    target_type VARCHAR(30) NOT NULL,  -- 예: 'USER', 'DIRECT_MESSAGE'
    target_id   BIGINT NOT NULL,
    is_success  BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_adminlog_admin
	FOREIGN KEY (admin_id) REFERENCES Admin(admin_id) ON DELETE CASCADE,

    CONSTRAINT chk_adminlog_target_type
	CHECK (target_type IN ('USER', 'DIRECT_MESSAGE'))
);

CREATE INDEX idx_adminlog_admin_created ON AdminActivityLog(admin_id, created_at DESC);
CREATE INDEX idx_adminlog_target ON AdminActivityLog(target_type, target_id);

-- =====================================================================
-- 화면 ↔ 테이블 매핑 (v6 전체)
-- =====================================================================
-- 랜딩(index.html)         : 콘텐츠 전용, DB 미사용
-- 로그인/회원가입           : User (email, password_hash, name)
-- 보다(dashboard)          : UserPlant, CareSchedule, AIOutput, WeatherInfo, LocalRiskAlert
-- 묻다(ask)                : AIQueryLog, RetrievalContext
-- 잇다(connect)            : Follow, HelpPost, DirectMessage, Event, User(region/location)
-- 나누다(share)            : GrowthStory, PlantPhoto, CommunityInteraction, BookMark, Tag/StoryTag, DirectMessage
-- 내 정보(profile)         : User, UserPlant, Follow, GrowthStory
-- 계정 설정(settings)      : User(profile_public/growth_public/location_shared/is_withdrawn 등)
-- 관리자(admin)            : Admin, AdminActivityLog, User(is_suspended/is_withdrawn), DirectMessage(deleted_*)
