import { AlertCircle } from "lucide-react";

interface Props {
  message?: string;
  subMessage: string;
}

export default function NoListingsAvailable({
  message = "No listings available at this time",
  subMessage,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-100 rounded-lg shadow-md">
      <AlertCircle className="w-16 h-16 text-yellow-500 mb-4" />
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{message}</h2>
      <p className="text-gray-600 text-center">{subMessage}</p>
      {/* <button
        className="mt-6 px-4 py-2 bg-black text-white rounded"
        onClick={() => window.location.reload()}
      >
        Refresh Page
      </button> */}
    </div>
  );
}
