import { Footer } from '../components/Footer';
import { useCounterTRPC } from '../hooks/useCounterTRPC';
import { useVersionInfo } from '../hooks/useVersionInfo';

type HomePageProps = {
  onNavigateToAdmin: () => void;
  onNavigateToImageTest: () => void;
  onNavigateToPosts: () => void;
};

export const HomePage = ({ onNavigateToAdmin, onNavigateToImageTest, onNavigateToPosts }: HomePageProps) => {
  const { count, username, loading, increment, decrement } = useCounterTRPC();
  const { versionState, retry } = useVersionInfo();

  return (
    <div className="flex relative flex-col justify-center items-center min-h-screen gap-4">
      {/* Admin Button - Top Right */}
      <button
        onClick={onNavigateToAdmin}
        className="absolute top-4 right-4 bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        Admin Panel
      </button>

      <h1 className="text-2xl font-bold text-center text-gray-900 ">
        {username ? `Hey ${username} 👋` : ''}
      </h1>

      <div className="flex items-center justify-center mt-5">
        <button
          className="flex items-center justify-center bg-[#d93900] text-white w-14 h-14 text-[2.5em] rounded-full cursor-pointer font-mono leading-none transition-colors"
          onClick={decrement}
          disabled={loading}
        >
          -
        </button>
        <span className="text-[1.8em] font-medium mx-5 min-w-[50px] text-center leading-none text-gray-900">
          {loading ? '...' : count}
        </span>
        <button
          className="flex items-center justify-center bg-[#d93900] text-white w-14 h-14 text-[2.5em] rounded-full cursor-pointer font-mono leading-none transition-colors"
          onClick={increment}
          disabled={loading}
        >
          +
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={onNavigateToPosts}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors"
        >
          View Comments
        </button>
        <button
          onClick={onNavigateToImageTest}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors"
        >
          Image Test
        </button>
      </div>

      <Footer versionState={versionState} onRetry={retry} />
    </div>
  );
};
