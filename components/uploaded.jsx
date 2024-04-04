export default function Uploaded() {
  return (
    <>
      <div className="flex min-h-screen px-4">
        <div className="m-auto text-center">
          <div className="flex my-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-20 h-20 text-green-600 mx-auto"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12"
              />
            </svg>
          </div>
          <h1 className="font-extrabold text-2xl">Your Changes Has Been Uploaded</h1>
          <p className="font-light">
            Wait, we are finishing on the server side. We will redirect you after the server side
            process is complete.
          </p>
        </div>
      </div>
    </>
  );
}
