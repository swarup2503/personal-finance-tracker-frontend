import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="text-9xl font-bold text-primary-200">404</div>
      <h1 className="mt-4 text-3xl font-bold text-gray-800">Page Not Found</h1>
      <p className="mt-2 text-gray-600">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="mt-6 btn btn-primary">
        Go to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;