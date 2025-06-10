import React from 'react';

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg mb-6">Sorry, the page you are looking for does not exist.</p>
      <a href="/" className="text-blue-600 hover:underline">Go back to Home</a>
    </div>
  );
}

export default NotFound;