import { CommentSubmissionOptions, T1, T3 } from '@devvit/web/server';

// CommentSubmissionOptions is a union of two types
export type CommentOptions =
  | CommentSubmissionOptions
  | {
      id: T1 | T3;
      text?: string;
      runAs?: 'USER' | 'APP';
    };
