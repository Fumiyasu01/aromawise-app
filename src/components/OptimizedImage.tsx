import React from 'react';
import { useLazyImage } from '../utils/performanceOptimizer';
import './OptimizedImage.css';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  width?: number;
  height?: number;
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  placeholder = '/images/placeholder.png',
  width,
  height,
  onLoad,
  onError
}) => {
  const { imgRef, isLoaded, isInView } = useLazyImage(src, {
    threshold: 0.1,
    rootMargin: '50px'
  });

  const handleLoad = () => {
    onLoad?.();
  };

  const handleError = () => {
    onError?.();
  };

  return (
    <div
      ref={imgRef}
      className={`optimized-image ${className} ${isLoaded ? 'loaded' : 'loading'}`}
      style={{ width, height }}
    >
      {!isInView ? (
        // Intersection Observer によってまだ表示領域に入っていない
        <div className="image-placeholder" style={{ width, height }}>
          <div className="placeholder-content">
            <span className="placeholder-icon">🖼️</span>
          </div>
        </div>
      ) : !isLoaded ? (
        // 表示領域に入ったが、まだ画像の読み込みが完了していない
        <div className="image-loading" style={{ width, height }}>
          <img
            src={placeholder}
            alt={alt}
            className="placeholder-image"
            style={{ width, height }}
          />
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
          </div>
        </div>
      ) : (
        // 画像の読み込みが完了
        <img
          src={src}
          alt={alt}
          className="actual-image"
          style={{ width, height }}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
};

export default OptimizedImage;