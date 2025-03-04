import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import routes from '@/constants/routes';

const {ROOT} = routes;

const ErrorPage = () => {
  const navigate = useNavigate();
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="text-center space-y-6 p-8">
        <div className="flex justify-center">
          <AlertCircle className="h-24 w-24 text-red-400 animate-pulse" />
        </div>
        
        <h1 className="text-4xl font-bold text-white">Oops!</h1>
        
        <div className="space-y-2">
          <p className="text-xl text-gray-300">Something went wrong</p>
          <p className="text-gray-400">
            We apologize for the inconvenience. Please try again later.
          </p>
        </div>

        <div className="space-x-4">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            Go Back
          </Button>
          
          <Button
            onClick={() => navigate(ROOT)}
            variant="default"
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;