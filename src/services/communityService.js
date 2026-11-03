/**
 * Krushi Drushti - Krushi Charcha (Farmer Community & Agronomist Forum) Service
 */

import { firebaseService } from './firebaseService.js';

class CommunityService {
  /**
   * Fetch all community discussions
   */
  async getPosts(category = null) {
    const raw = await firebaseService.get('community');
    if (!raw) return [];

    let list = Object.values(raw);
    if (category) {
      list = list.filter((p) => p.category?.toLowerCase() === category.toLowerCase());
    }
    return list.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  /**
   * Create a new farmer discussion post
   */
  async createPost({ authorId, authorName, district, state, category = 'General', title, content }) {
    const id = `post_${Date.now()}`;
    const newPost = {
      id,
      authorId: authorId || 'anonymous_farmer',
      authorName: authorName || 'Kisan Mitra',
      district: district || 'Maharashtra',
      state: state || 'Maharashtra',
      category,
      title,
      content,
      likesCount: 0,
      repliesCount: 0,
      timestamp: new Date().toISOString()
    };

    await firebaseService.set(`community/${id}`, newPost);
    return newPost;
  }

  /**
   * Upvote a community post
   */
  async upvotePost(postId) {
    const post = await firebaseService.get(`community/${postId}`);
    if (!post) {
      throw new Error(`Post ${postId} not found`);
    }

    const newLikes = (post.likesCount || 0) + 1;
    await firebaseService.update(`community/${postId}`, { likesCount: newLikes });
    return { id: postId, likesCount: newLikes };
  }

  /**
   * Add a verified agronomist reply
   */
  async addAgronomistReply(postId, replyText) {
    const post = await firebaseService.get(`community/${postId}`);
    if (!post) {
      throw new Error(`Post ${postId} not found`);
    }

    await firebaseService.update(`community/${postId}`, {
      verifiedAgronomistReply: replyText,
      repliesCount: (post.repliesCount || 0) + 1
    });

    return { id: postId, verifiedAgronomistReply: replyText };
  }
}

export const communityService = new CommunityService();

