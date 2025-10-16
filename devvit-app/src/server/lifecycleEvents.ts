/**
 * these are general lifecycle events that are triggered by Devvit
 * we keep these as a plain REST APIs
 */

import { context } from '@devvit/web/server';
import express from 'express';
import { createPost } from './core/post';

export const lifecycleRouter: express.Router = express.Router();

lifecycleRouter.post('/internal/on-app-install', async (_req, res): Promise<void> => {
  console.log('🚀 App installed! Creating initial post...');
  console.log(`Subreddit: ${context.subredditName}`);
  try {
    const post = await createPost();

    console.log(`✅ Installation complete! Post created with id: ${post.id}`);
    res.json({
      status: 'success',
      message: `Post created in subreddit ${context.subredditName} with id ${post.id}`,
    });
  } catch (error) {
    console.error(`❌ Error creating post during installation: ${error}`);
    res.status(400).json({
      status: 'error',
      message: 'Failed to create post',
    });
  }
});

lifecycleRouter.post('/internal/menu/post-create', async (_req, res): Promise<void> => {
  try {
    const post = await createPost();

    res.json({
      navigateTo: `https://reddit.com/r/${context.subredditName}/comments/${post.id}`,
    });
  } catch (error) {
    console.error(`Error creating post: ${error}`);
    res.status(400).json({
      status: 'error',
      message: 'Failed to create post',
    });
  }
});
