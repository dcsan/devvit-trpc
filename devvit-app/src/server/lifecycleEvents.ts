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

lifecycleRouter.post('/internal/menu/hello-menu', async (_req, res) => {
  console.log('hello-menu action clicked!');
  res.json({
    showToast: 'Hello menu!',
  });
});

lifecycleRouter.post('/internal/menu/admin-menu', async (_req, res) => {
  try {
    console.log('admin-menu');

    // Show form with server-fetched data
    res.json({
      showForm: {
        name: 'adminForm',
        form: {
          fields: [
            {
              type: 'string',
              name: 'action',
              label: 'Action',
            },
          ],
        },
        data: { action: 'adminAction' },
      },
    });
  } catch (error) {
    res.json({
      showToast: 'Processing failed. Please try again.',
    });
  }
});

lifecycleRouter.post('/internal/form/admin-form', async (req, res) => {
  try {
    console.log('admin-form');

    const { action } = req.body;
    console.log('action', action);

    res.json({
      showToast: `Form action: ${action}`,
    });
  } catch (error) {
    res.json({
      showToast: 'Processing failed. Please try again.',
    });
  }
});
