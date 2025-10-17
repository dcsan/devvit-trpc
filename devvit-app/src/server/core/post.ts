import {
  CommonSubmitPostOptions,
  context,
  media,
  Post,
  reddit,
  SubmitCustomPostOptions,
  SubredditOptions,
} from '@devvit/web/server';
import { darkSplash } from '../../shared/config/appIcon';

type PostData = SubredditOptions & CommonSubmitPostOptions & SubmitCustomPostOptions;

export const createPost = async () => {
  const { subredditName } = context;
  if (!subredditName) {
    throw new Error('subredditName is required');
  }

  return await reddit.submitCustomPost({
    runAs: 'USER',
    userGeneratedContent: {
      text: 'Hello World',
      // imageUrls: [
      //   'https://styles.redditmedia.com/t5_5wa5ww/styles/communityIcon_wyopomb2xb0a1.png',
      // 'https://styles.redditmedia.com/t5_49fkib/styles/bannerBackgroundImage_5a4axis7cku61.png',
      // ],
    },

    splash: {
      // Splash Screen Configuration
      appDisplayName: 'symbolsociety',
      backgroundUri: 'default-splash.png',
      buttonLabel: 'Tap to Start',
      description: 'An exciting interactive experience',

      heading: 'Welcome to the Game!',
      appIconUri: 'default-icon.png',
    },
    postData: {
      gameState: 'initial',
      score: 0,
    },
    subredditName: subredditName,
    title: 'symbolsociety',
  });
};

export const appInstallPost = async () => {
  const { subredditName } = context;
  if (!subredditName) {
    throw new Error('subredditName is required');
  }

  // ${body.toString('base64')}
  const mediaType = 'png';
  const contentType = `image/${mediaType}`;
  const dataUrl = `data:${contentType};base64,${darkSplash}`;
  const asset = await media.upload({
    type: 'image',
    url: dataUrl,
  });
  console.log('asset', asset);

  const postData: PostData = {
    title: 'Custom Post v' + context.appVersion,
    postData: {
      version: context.appVersion,
      gameId: '1234567890',
      gameName: 'symbolsociety',
    },
    subredditName,
    textFallback: {
      text: 'This is a Devvit post from version ' + context.appVersion,
    },
    splash: {
      appDisplayName: 'symbolsociety',
      // backgroundUri: 'square-splash.png',
      // backgroundUri: `data:image/png;base64,${darkSplash}`,
      backgroundUri: asset.mediaUrl,
      buttonLabel: 'Start Playing',
      description: 'Custom Post',
      heading: 'Welcome to the Game!',
    },
  };

  const postResult: Post = await reddit.submitCustomPost(postData);

  // const post = {
  //   dir: 'dist/client',
  //   entrypoints: {
  //     default: {
  //       entry: 'splash.html',
  //     },
  //   },
  // };

  // const result = await reddit.submitCustomPost({
  //   postData: postData,
  //   subredditName: subredditName,
  //   title: 'symbolsociety v' + context.appVersion,
  // });

  console.log('appInstallPost', {
    permalink: postResult.permalink,
    id: postResult.id,
    title: postResult.title,

    url: postResult.url,

    score: postResult.score,
    comments: postResult.comments,
  });
  return postResult;
};
