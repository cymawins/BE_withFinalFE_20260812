import {
  createInquiry,
  findInquiriesByUserId,
  countInquiriesByUserId,
  findInquiryById,
  updateInquiryReply,
} from '../models/inquiryModel.js';

// 문의 등록
export const create = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.userId;

    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({ message: '제목과 내용을 입력해주세요.' });
    }

    const result = await createInquiry({
      userId,
      title: title.trim(),
      content: content.trim(),
    });

    return res.status(201).json({
      inquiryId: result.insertId,
      message: '문의가 등록되었습니다.',
    });
  } catch (err) {
    next(err);
  }
};

// 내 문의 목록
export const getMyList = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const data = await findInquiriesByUserId(userId, { page, limit });
    const total = await countInquiriesByUserId(userId);

    return res.status(200).json({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 0,
      },
    });
  } catch (err) {
    next(err);
  }
};

// 문의 상세
export const getOne = async (req, res, next) => {
  try {
    const inquiry = await findInquiryById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({ message: '문의가 존재하지 않습니다.' });
    }

    const isOwner = inquiry.user_id === req.user.userId;
    const isAdmin = !!req.user.adminId;

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: '권한이 없습니다.' });
    }

    return res.status(200).json(inquiry);
  } catch (err) {
    next(err);
  }
};

// 관리자 답변 등록
export const reply = async (req, res, next) => {
  try {
    const { admin_reply } = req.body;

    if (!admin_reply?.trim()) {
      return res.status(400).json({ message: '답변 내용을 입력해주세요.' });
    }

    const inquiry = await findInquiryById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: '문의가 존재하지 않습니다.' });
    }

    await updateInquiryReply(req.params.id, {
      adminReply: admin_reply.trim(),
    });

    const updated = await findInquiryById(req.params.id);
    return res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};