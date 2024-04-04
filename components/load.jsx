export default function Load() {
  return (
    <div className="py-2">
      <div className="w-full h-60 bg-gray-200 dark:bg-gray-700 rounded-t-lg animate-pulse"></div>
      <div className="w-full bg-gray-300 dark:bg-gray-800 rounded-b-lg py-4 px-2">
        <div className="animate-pulse w-3/4 h-5 bg-gray-400 dark:bg-gray-600 rounded-md"></div>
        <div className="animate-pulse w-2/4 h-5 bg-gray-400 dark:bg-gray-600 rounded-md my-2"></div>
        <div className="animate-pulse w-full h-5 bg-gray-400 dark:bg-gray-600 rounded-md mb-2"></div>
        <div className="animate-pulse w-full h-5 bg-gray-400 dark:bg-gray-600 rounded-md mb-2"></div>
        <div className="animate-pulse w-full h-5 bg-gray-400 dark:bg-gray-600 rounded-md"></div>
      </div>
    </div>
  );
}
