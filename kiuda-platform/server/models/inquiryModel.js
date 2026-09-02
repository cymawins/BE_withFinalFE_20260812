import pool from '../config/db.js';

// 문의 등록
export async function createInquiry({ userId, title, content }) {
  const [result] = await pool.query(
    `INSERT INTO Inquiry (user_id, title, content, status)
     VALUES (?, ?, ?, 'PENDING')`,
    [userId, title, content]
  );
  return result;
}

// 내 문의 목록 조회 (페이지네이션)
export async function findInquiriesByUserId(userId, { page = 1, limit = 5 }) {
  const offset = (page - 1) * limit;

  const [rows] = await pool.query(
    `SELECT 
        inquiry_id, 
        user_id, 
        title, 
        content, 
        status, 
        admin_reply, 
        created_at, 
        answered_at
     FROM Inquiry
     WHERE user_id = ?
     ORDER BY created_at DESC
     LIMIT ? OFFSET ?`,
    [userId, Number(limit), Number(offset)]
  );

  return rows;
}

// 내 문의 총 개수
export async function countInquiriesByUserId(userId) {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS total FROM Inquiry WHERE user_id = ?`,
    [userId]
  );
  return rows[0].total;
}

// 문의 상세 조회
export async function findInquiryById(id) {
  const [rows] = await pool.query(
    `SELECT * FROM Inquiry WHERE inquiry_id = ?`,
    [id]
  );
  return rows[0];
}

// 관리자 답변 등록
export async function updateInquiryReply(id, { adminReply }) {
  const [result] = await pool.query(
    `UPDATE Inquiry
     SET admin_reply = ?, 
         answered_at = NOW(), 
         status = 'ANSWERED'
     WHERE inquiry_id = ?`,
    [adminReply, id]
  );
  return result;
}