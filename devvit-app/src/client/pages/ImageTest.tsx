import { darkSplash } from '../../shared/config/appIcon';

interface ImageTestProps {
  onBack: () => void;
}

export const ImageTest = ({ onBack }: ImageTestProps) => {
  return (
    <div className="flex relative flex-col justify-center min-h-screen gap-6 p-6">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        ← Back to Home
      </button>

      <h2>inline v1</h2>
      <img src={`data:image/png;base64,${darkSplash}`} alt="App Icon" />

      <h2>inline v2</h2>

      <div className="w-full max-w-md">{/* Content goes here */}</div>
    </div>
  );
};
