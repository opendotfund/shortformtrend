
import React from 'react';

interface ErrorDisplayProps {
  message: string;
  title?: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, title = "An Error Occurred" }) => {
  return (
    <div className="bg-red-900 border-l-4 border-red-500 text-red-100 p-6 rounded-md shadow-lg" role="alert">
      <h4 className="font-bold text-lg mb-2">{title}</h4>
      <p>{message}</p>
    </div>
  );
};

export default ErrorDisplay;
