import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { setUser } from "../store/userSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK;
    const apperClient = new ApperClient("YOUR_CANVAS_ID");
    
    ApperUI.setup(apperClient, {
      target: '#authentication',
      clientId: "YOUR_CANVAS_ID",
      hide: [],
      view: 'login',
      onSuccess: function(user, account) {
        // Store user details in Redux
        dispatch(setUser(user));
        
        // Navigate to dashboard after successful authentication
        navigate('/');
      },
      onError: function(error) {
        console.error("Authentication failed:", error);
      }
    });
    
    ApperUI.showLogin("#authentication");
  }, [navigate, dispatch]);

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card p-6"
      >
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold mb-4">
            T
          </div>
          <h1 className="text-2xl font-bold mb-2">Log in to TaskFlow</h1>
          <p className="text-surface-500 dark:text-surface-400">
            Welcome back! Please login to your account.
          </p>
        </div>
        
        <div 
          id="authentication" 
          className="min-h-[400px] flex items-center justify-center" 
        />
        
        <div className="mt-6 text-center">
          <p className="text-surface-500 dark:text-surface-400">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;