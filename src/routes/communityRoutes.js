import { Router } from 'express';
import { communityService } from '../services/communityService.js';
import { requireFields } from '../middleware/validate.js';

const router = Router();

// GET all community discussions
router.get('/', async (req, res, next) => {
  try {
    const { category } = req.query;
    const posts = await communityService.getPosts(category);
    res.json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (err) {
    next(err);
  }
});

// POST new farmer question/discussion
router.post('/', requireFields(['title', 'content']), async (req, res, next) => {
  try {
    const post = await communityService.createPost(req.body);
    res.status(201).json({
      success: true,
      message: 'Community post created',
      data: post
    });
  } catch (err) {
    next(err);
  }
});

// POST upvote a post
router.post('/:id/like', async (req, res, next) => {
  try {
    const result = await communityService.upvotePost(req.params.id);
    res.json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
});

// POST verified agronomist reply
router.post('/:id/reply', requireFields(['replyText']), async (req, res, next) => {
  try {
    const result = await communityService.addAgronomistReply(req.params.id, req.body.replyText);
    res.json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
});

export default router;

