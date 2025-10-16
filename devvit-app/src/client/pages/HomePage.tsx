import { Footer } from '../components/Footer';
import { useCounterTRPC } from '../hooks/useCounterTRPC';
import { useVersionInfo } from '../hooks/useVersionInfo';

type HomePageProps = {
  onNavigateToAdmin: () => void;
};

export const HomePage = ({ onNavigateToAdmin }: HomePageProps) => {
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

      <img className="object-contain w-1/2 max-w-[250px] mx-auto" src="/snoo.png" alt="Snoo" />
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-2xl font-bold text-center text-gray-900 ">
          {username ? `Hey ${username} 👋` : ''}
        </h1>
        <p className="text-base text-center text-gray-600 ">
          Edit <span className="bg-[#e5ebee]  px-1 py-0.5 rounded">src/client/App.tsx</span>
          to get started.
        </p>
      </div>
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
      <Footer versionState={versionState} onRetry={retry} />
    </div>
  );
};
