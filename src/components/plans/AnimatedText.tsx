import React from 'react';

const AnimatedText = ({ text }) => {
  return (
    <div className="relative text-center">
      <h2 className="text-2xl font-semibold mb-4 text-[#03abff] relative overflow-hidden">
        <span
          className="relative z-0"
          style={{
            background: 'linear-gradient(to right, #03abff, #03abff)',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
        >
          {text}
        </span>
        <span
          className="absolute inset-0 bg-gradient-to-r from-white to-white w-full h-full animate-slash animation-delay"
          style={{
            maskImage: 'linear-gradient(65deg, rgba(0,0,0,0) 80%, rgba(0,0,0,1) 100%, rgba(0,0,0,0) 0%)',
            WebkitMaskImage:
              'linear-gradient(65deg, rgba(0,0,0,0) 80%, rgba(0,0,0,1) 100%, rgba(0,0,0,1) 0%)',
          }}
        ></span>
      </h2>
    </div>
  );
};

export default AnimatedText;
