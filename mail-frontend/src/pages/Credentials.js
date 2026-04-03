import React from "react";
import { useState, useEffect } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";


const Form = ({ isSignInPage = false }) => {
  const [formData, setFormData] = useState({
    ...(!isSignInPage && {
      name: "",
    }),
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [mounted, setMounted] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!isSignInPage && (!formData.name || formData.name.trim() === "")) {
      newErrors.name = "Name is required";
    }

    if (!formData.email || formData.email.trim() === "") {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password || formData.password.trim() === "") {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const res = await fetch(`http://localhost:8000/api/${isSignInPage ? 'login' : 'register'}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        const resData = await res.json();
        
        if (!res.ok) {
          setErrors({ form: resData.message || 'Something went wrong' });
          return;
        }

        if (isSignInPage) {
          // Login success - store token and user data, then navigate
          if (resData.token && resData.user) {
            localStorage.setItem('token', resData.token);
            localStorage.setItem('user', JSON.stringify(resData.user));
            navigate('/inbox');
          } else {
            setErrors({ form: 'Login failed. Please try again.' });
          }
        } else {
          // Register success - save user to localStorage and navigate to sign in page
          const newUserData = { name: formData.name, email: formData.email };
          const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
          // Add user if not already exists
          if (!existingUsers.find(u => u.email === formData.email)) {
            existingUsers.push(newUserData);
            localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
          }
          alert(resData.message || 'Registration successful! Please sign in.');
          navigate('/login');
        }
      } catch (err) {
        setErrors({ form: 'Network error. Please try again.' });
        console.error('Error:', err);
      }
    } else {
      console.log("Form has validation errors");
    }
  };

  // Floating bubbles animation data
  const bubbles = [
    { size: 'w-16 h-16', delay: '0s', duration: '8s', left: '10%', opacity: '0.3' },
    { size: 'w-24 h-24', delay: '1s', duration: '10s', left: '20%', opacity: '0.2' },
    { size: 'w-12 h-12', delay: '2s', duration: '7s', left: '70%', opacity: '0.25' },
    { size: 'w-20 h-20', delay: '3s', duration: '9s', left: '80%', opacity: '0.15' },
    { size: 'w-14 h-14', delay: '4s', duration: '11s', left: '90%', opacity: '0.2' },
    { size: 'w-10 h-10', delay: '5s', duration: '8s', left: '5%', opacity: '0.3' },
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated background bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {bubbles.map((bubble, index) => (
          <div
            key={index}
            className={`absolute rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 ${bubble.size}`}
            style={{
              left: bubble.left,
              bottom: '-100px',
              opacity: bubble.opacity,
              animation: `floatUp ${bubble.duration} ease-in-out ${bubble.delay} infinite`,
            }}
          />
        ))}
      </div>

      {/* Main card container with animation */}
      <div 
        className={`
          bg-white/80 backdrop-blur-xl 
          w-[500px] min-h-[550px] 
          shadow-2xl rounded-3xl 
          flex flex-col items-center justify-center gap-6 
          p-10 relative
          transition-all duration-700 ease-out
          ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
          border border-white/50
        `}
      >
        {/* Decorative top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-t-3xl" />

        {/* Icon/Logo */}
        <div className={`
          w-16 h-16 rounded-2xl 
          bg-gradient-to-br from-blue-500 to-purple-600 
          flex items-center justify-center 
          shadow-lg shadow-blue-500/30
          mb-2
          transition-all duration-700 delay-200
          ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}
        `}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        </div>

        {/* Title */}
        <div className={`
          text-3xl font-extrabold text-black text-center
          transition-all duration-700 delay-300
          ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}
        `}>
          Welcome {isSignInPage ? "Back" : "to MailSystem"}
        </div>

        {/* Subtitle */}
        <div className={`
          text-lg font-medium text-gray-600 text-center
          transition-all duration-700 delay-400
          ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}
        `}>
          {isSignInPage
            ? "Sign in to continue to your inbox"
            : "Create an account to get started"}
        </div>

        {/* Form */}
        <form
          className="w-full flex flex-col items-center gap-5 px-4"
          onSubmit={handleSubmit}
        >
          {/* Form-level error banner */}
          {errors.form && (
            <div className={`
              w-full p-3 rounded-xl 
              bg-red-50 border border-red-200 
              text-red-600 text-sm text-center
              animate-shake
            `}>
              {errors.form}
            </div>
          )}

          {/* Name field (register only) */}
          {!isSignInPage && (
            <div className="w-full transition-all duration-500 delay-500">
              <Input
                label="Full Name"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                hasError={!!errors.name}
                errorMessage={errors.name}
              />
            </div>
          )}

          {/* Email field */}
          <div className={`
            w-full transition-all duration-500 
            ${!isSignInPage ? 'delay-600' : 'delay-500'}
          `}>
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              hasError={!!errors.email}
              errorMessage={errors.email}
            />
          </div>

          {/* Password field */}
          <div className={`
            w-full transition-all duration-500 
            ${!isSignInPage ? 'delay-700' : 'delay-600'}
          `}>
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              hasError={!!errors.password}
              errorMessage={errors.password}
            />
          </div>

          {/* Submit Button */}
          <div className={`
            w-full mt-2
            transition-all duration-500
            ${!isSignInPage ? 'delay-800' : 'delay-700'}
          `}>
            <Button
              className="w-full"
              size="large"
              disabled={Object.keys(errors).some(key => key !== 'form' && errors[key])}
              label={isSignInPage ? "Sign In" : "Create Account"}
              type="submit"
              onClick={handleSubmit}
            />
          </div>
        </form>

        {/* Toggle between sign in/sign up */}
        <div className={`
          text-gray-600 text-center mt-2
          transition-all duration-500
          ${!isSignInPage ? 'delay-900' : 'delay-800'}
        `}>
          {isSignInPage ? "Don't have an account?" : "Already have an account?"}{" "}
          <span 
            className="text-blue-600 font-bold cursor-pointer hover:text-blue-700 transition-colors duration-200 hover:underline"
            onClick={() => navigate(isSignInPage ? "/signup" : "/login")}
          >
            {isSignInPage ? "Sign Up" : "Sign In"}
          </span>
        </div>
      </div>

      {/* CSS for floating animation */}
      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.3;
          }
          90% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(-120vh) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Form;