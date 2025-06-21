import React, { useEffect, useState } from "react";

interface ScrollUpProps {
  threshold?: number; // Pixels scrolled down before the button appears
  className?: string; // Additional classes for styling
  style?: React.CSSProperties; // Inline styles
  targetRef?: React.MutableRefObject<HTMLDivElement | null>;
  onVisible?: (isVisible: boolean) => void;
}

const ScrollUp: React.FC<ScrollUpProps> = ({
  threshold = 100,
  className = "",
  style = {},
  targetRef=null,
  onVisible = (isVisible: boolean) => { }
}) => {
  const [visible, setVisible] = useState(false);
  const [isAppearingTime, setIsAppearingTime] = useState(false);

  useEffect(() =>{

    let timeHandling;

    function handleTime(){
      timeHandling = setTimeout(() => {
        setIsAppearingTime(visible);
      }, 
      200);
    }

    handleTime();

    return () => clearTimeout(timeHandling);

  }, [visible]);

  useEffect(() => {
    const handleScroll = () => {

      if(targetRef && targetRef.current){
        const scrollTop = targetRef.current.scrollTop;
        setVisible(scrollTop > threshold);
        onVisible(scrollTop > threshold);
        return;
      }

      setVisible(window.scrollY > threshold);
      onVisible(window.scrollY > threshold);
    };

    if(targetRef && targetRef.current) 
    {
      targetRef.current.addEventListener("scroll", handleScroll);
    }
    else
    {
      window.addEventListener("scroll", handleScroll);
    }

    return () => {

      if(targetRef && targetRef.current) {
        targetRef.current.removeEventListener("scroll", handleScroll);
      }
      else
      {
        window.removeEventListener("scroll", handleScroll);
      }
    };
  }, [threshold]);

  const scrollToTop = () => {

    if (targetRef && targetRef.current) {
      targetRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    visible && (
      <button
        onClick={scrollToTop}
        className={`fixed bottom-0 left-0 right-0 border-t rounded-none px-10 pb-2 md:text-center bg-blue-400 text-white shadow-lg hover:bg-blue-100 transition-transform duration-250 ease-in-out ${isAppearingTime ? 'translate-y-0' : 'translate-y-full'}  ${className}`}
        style={{
          width: '100%', // Button width
          height: '50px', // Button height
          display: 'flex', // Flexbox for centering
          justifyContent: 'center', // Horizontally center content
          alignItems: 'center', // Vertically center content
          fontSize: '50px', // Adjust font size
          ...style
          }}
      >
        ↑
      </button>
    )
  );
};

export default ScrollUp;
