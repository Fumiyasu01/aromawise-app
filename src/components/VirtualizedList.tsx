import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useVirtualList, useThrottle } from '../utils/performanceOptimizer';
import './VirtualizedList.css';

interface VirtualizedListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  overscan?: number; // 画面外にレンダリングする追加アイテム数
  onScroll?: (scrollTop: number) => void;
}

function VirtualizedList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  className = '',
  overscan = 3,
  onScroll
}: VirtualizedListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // スクロールイベントのスロットル化
  const throttledScrollHandler = useThrottle(
    useCallback((event: React.UIEvent<HTMLDivElement>) => {
      const newScrollTop = event.currentTarget.scrollTop;
      setScrollTop(newScrollTop);
      onScroll?.(newScrollTop);
    }, [onScroll]),
    16 // 60fps
  );

  // 仮想化計算
  const {
    visibleItems,
    startIndex,
    endIndex,
    offsetY,
    totalHeight
  } = useVirtualList(items, containerHeight, itemHeight, scrollTop);

  // オーバースキャンを適用
  const overscanStart = Math.max(0, startIndex - overscan);
  const overscanEnd = Math.min(items.length, endIndex + overscan);
  const overscanItems = items.slice(overscanStart, overscanEnd);
  const overscanOffsetY = overscanStart * itemHeight;

  return (
    <div
      ref={containerRef}
      className={`virtualized-list ${className}`}
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={throttledScrollHandler}
    >
      <div
        className="virtualized-list-content"
        style={{ height: totalHeight, position: 'relative' }}
      >
        <div
          className="virtualized-list-items"
          style={{
            transform: `translateY(${overscanOffsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0
          }}
        >
          {overscanItems.map((item, index) => (
            <div
              key={overscanStart + index}
              className="virtualized-list-item"
              style={{
                height: itemHeight,
                overflow: 'hidden'
              }}
            >
              {renderItem(item, overscanStart + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VirtualizedList;