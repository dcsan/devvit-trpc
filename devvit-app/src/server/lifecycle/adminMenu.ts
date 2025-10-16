import { context, redis } from '@devvit/web/server';
import express from 'express';

export const adminMenuRouter: express.Router = express.Router();
adminMenuRouter.post('/internal/menu/admin-menu', async (_req, res) => {
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
              name: 'status', // this gets passed to the form handler
              label: 'Status',
            },
          ],
        },
        data: { status: 'idle' },
      },
    });
  } catch (error) {
    res.json({
      showToast: 'Processing failed. Please try again.',
    });
  }
});

adminMenuRouter.post('/internal/form/admin-form', async (req, res) => {
  try {
    console.log('admin-form');

    const { status } = req.body; // from event above
    // we also have access to the context
    console.log('admin-form', {
      status,
      userId: context.userId,
      subredditName: context.subredditName,
      postId: context.postId,
      appVersion: context.appVersion,
      hasRedis: !!redis,
    });

    // we can store into redis which the app can then read from
    await redis.hSet('data:queue', { status, timestamp: Date.now().toString() });

    res.json({
      showToast: `set status to: ${status}`,
    });
  } catch (error) {
    res.json({
      showToast: 'Processing failed. Please try again.',
    });
  }
});
