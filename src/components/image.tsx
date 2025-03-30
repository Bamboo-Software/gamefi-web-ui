import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from "@/components/ui/skeleton";

interface ImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  animationVariant?: 'fade' | 'zoom' | 'slide' | 'bounce' | 'elastic' | 'none';
  onClick?: () => void;
  loading?: 'eager' | 'lazy';
  fallbackSrc?: string;
  style?: React.CSSProperties;
}

const Image = ({
  src,
  alt,
  className = '',
  width,
  height,
  objectFit = 'cover',
  animationVariant = 'bounce',
  onClick,
  loading = 'eager',
  fallbackSrc = '/placeholder.png',
  style
}: ImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Animation variants
  const variants = {
    fade: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
    zoom: { hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } },
    slide: { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } },
    bounce: {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', stiffness: 300, damping: 10, mass: 0.8 },
      },
    },
    elastic: {
      hidden: { opacity: 0, scale: 0.5 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: { type: 'spring', stiffness: 400, damping: 8, mass: 1 },
      },
    },
    none: { hidden: { opacity: 1 }, visible: { opacity: 1 } },
  };

  useEffect(() => {
    const img = new window.Image();
    img.src = src;
    if (img.complete) {
      setIsLoaded(true);
    } else {
      img.onload = () => setIsLoaded(true);
      img.onerror = () => setHasError(true);
    }
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  // Hover animation
  // const hoverAnimation = {
  //   scale: 1.05,
  //   rotate: 2,
  //   transition: { duration: 0.2 },
  // };

  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      style={{ width, height, position: 'relative', ...style }}
      initial="hidden"
      animate={isLoaded ? 'visible' : 'hidden'}
      variants={variants[animationVariant]}>
      {!isLoaded && (
        <Skeleton
          className="absolute inset-0 w-full h-full animate-pulse bg-gradient-to-r from-gray-200 to-gray-300"
        />
      )}
      <img
        src={hasError ? fallbackSrc : src}
        alt={alt}
        className={`w-full h-full transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ objectFit }}
        loading={loading}
        onClick={onClick}
      />
    </motion.div>
  );
};

export default Image;