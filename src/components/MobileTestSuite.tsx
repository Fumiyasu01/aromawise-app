import React, { useState, useEffect } from 'react';
import './MobileTestSuite.css';

interface DeviceInfo {
  userAgent: string;
  screenWidth: number;
  screenHeight: number;
  devicePixelRatio: number;
  orientation: string;
  touchSupport: boolean;
  platform: string;
  isMobile: boolean;
  isTablet: boolean;
  isIOS: boolean;
  isAndroid: boolean;
}

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  scrollPerformance: number;
  touchLatency: number;
}

const MobileTestSuite: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [testResults, setTestResults] = useState<{ [key: string]: boolean }>({});
  const [isRunningTests, setIsRunningTests] = useState(false);

  useEffect(() => {
    collectDeviceInfo();
    measurePerformance();
  }, []);

  const collectDeviceInfo = () => {
    const info: DeviceInfo = {
      userAgent: navigator.userAgent,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      devicePixelRatio: window.devicePixelRatio || 1,
      orientation: window.screen.orientation?.type || 'unknown',
      touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      platform: navigator.platform,
      isMobile: /Mobi|Android/i.test(navigator.userAgent),
      isTablet: /Tablet|iPad/i.test(navigator.userAgent),
      isIOS: /iPhone|iPad|iPod/i.test(navigator.userAgent),
      isAndroid: /Android/i.test(navigator.userAgent)
    };
    setDeviceInfo(info);
  };

  const measurePerformance = () => {
    const loadTime = performance.now();
    
    // Render time measurement
    const renderStart = performance.now();
    requestAnimationFrame(() => {
      const renderTime = performance.now() - renderStart;
      
      // Touch latency test
      let touchLatency = 0;
      if ('ontouchstart' in window) {
        const touchStart = performance.now();
        const testElement = document.createElement('div');
        testElement.style.cssText = 'position: fixed; top: -100px; width: 1px; height: 1px;';
        document.body.appendChild(testElement);
        
        testElement.addEventListener('touchstart', () => {
          touchLatency = performance.now() - touchStart;
        });
        
        // Simulate touch
        const touchEvent = new TouchEvent('touchstart', {
          bubbles: true,
          cancelable: true,
          touches: [{
            identifier: 0,
            target: testElement,
            clientX: 0,
            clientY: 0,
            pageX: 0,
            pageY: 0,
            screenX: 0,
            screenY: 0,
            radiusX: 0,
            radiusY: 0,
            rotationAngle: 0,
            force: 1
          } as any]
        });
        
        testElement.dispatchEvent(touchEvent);
        document.body.removeChild(testElement);
      }

      setPerformanceMetrics({
        loadTime,
        renderTime,
        scrollPerformance: measureScrollPerformance(),
        touchLatency
      });
    });
  };

  const measureScrollPerformance = (): number => {
    const scrollContainer = document.querySelector('.main-content');
    if (!scrollContainer) return 0;

    const startTime = performance.now();
    const startScrollTop = scrollContainer.scrollTop;
    
    scrollContainer.scrollBy(0, 100);
    
    const endTime = performance.now();
    const endScrollTop = scrollContainer.scrollTop;
    
    // Reset scroll position
    scrollContainer.scrollTop = startScrollTop;
    
    return endTime - startTime;
  };

  const runResponsivenessTests = async () => {
    setIsRunningTests(true);
    const results: { [key: string]: boolean } = {};

    // Test 1: Touch target size
    results.touchTargetSize = await testTouchTargetSizes();
    
    // Test 2: Navigation accessibility
    results.navigationAccessibility = testNavigationAccessibility();
    
    // Test 3: Content overflow
    results.contentOverflow = testContentOverflow();
    
    // Test 4: Form usability
    results.formUsability = testFormUsability();
    
    // Test 5: Modal responsiveness
    results.modalResponsiveness = testModalResponsiveness();
    
    // Test 6: Text readability
    results.textReadability = testTextReadability();
    
    // Test 7: Image optimization
    results.imageOptimization = testImageOptimization();
    
    // Test 8: Safe area support
    results.safeAreaSupport = testSafeAreaSupport();

    setTestResults(results);
    setIsRunningTests(false);
  };

  const testTouchTargetSizes = async (): Promise<boolean> => {
    const interactiveElements = document.querySelectorAll(
      'button, .nav-item, .oil-item, .blend-card, input[type="checkbox"], input[type="radio"]'
    );
    
    let passed = true;
    
    interactiveElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const minSize = 44; // Apple HIG minimum
      
      if (rect.width < minSize || rect.height < minSize) {
        console.warn(`Touch target too small: ${element.className}`, rect);
        passed = false;
      }
    });
    
    return passed;
  };

  const testNavigationAccessibility = (): boolean => {
    const navigation = document.querySelector('.navigation');
    if (!navigation) return false;

    const navItems = navigation.querySelectorAll('.nav-item');
    const hasProperSpacing = navItems.length <= 5; // Maximum recommended nav items
    
    const hasActiveStates = Array.from(navItems).some(item => 
      item.classList.contains('active')
    );

    return hasProperSpacing && hasActiveStates;
  };

  const testContentOverflow = (): boolean => {
    const containers = document.querySelectorAll('.main-content, .modal, .filter-panel');
    let passed = true;

    containers.forEach(container => {
      if (container.scrollWidth > container.clientWidth + 10) { // 10px tolerance
        console.warn('Horizontal overflow detected:', container);
        passed = false;
      }
    });

    return passed;
  };

  const testFormUsability = (): boolean => {
    const inputs = document.querySelectorAll('input, textarea, select');
    let passed = true;

    inputs.forEach(input => {
      const computedStyle = window.getComputedStyle(input);
      const fontSize = parseInt(computedStyle.fontSize);
      
      // iOS requires 16px font size to prevent zoom
      if (fontSize < 16) {
        console.warn('Input font size too small (may cause zoom on iOS):', input);
        passed = false;
      }
    });

    return passed;
  };

  const testModalResponsiveness = (): boolean => {
    const modals = document.querySelectorAll('.modal, .error-content');
    let passed = true;

    modals.forEach(modal => {
      const rect = modal.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      if (rect.width > viewportWidth || rect.height > viewportHeight) {
        console.warn('Modal too large for viewport:', modal);
        passed = false;
      }
    });

    return passed;
  };

  const testTextReadability = (): boolean => {
    const textElements = document.querySelectorAll('h1, h2, h3, p, span');
    let passed = true;

    textElements.forEach(element => {
      const computedStyle = window.getComputedStyle(element);
      const fontSize = parseInt(computedStyle.fontSize);
      const lineHeight = parseFloat(computedStyle.lineHeight) / fontSize;

      // Check minimum font size and line height
      if (fontSize < 14) {
        console.warn('Text too small:', element);
        passed = false;
      }

      if (lineHeight < 1.2) {
        console.warn('Line height too small:', element);
        passed = false;
      }
    });

    return passed;
  };

  const testImageOptimization = (): boolean => {
    const images = document.querySelectorAll('img');
    let passed = true;

    images.forEach(img => {
      if (!img.complete) return; // Skip unloaded images

      const naturalWidth = img.naturalWidth;
      const displayWidth = img.getBoundingClientRect().width;

      // Check if image is significantly larger than display size
      if (naturalWidth > displayWidth * 2) {
        console.warn('Image not optimized for display size:', img);
        passed = false;
      }
    });

    return passed;
  };

  const testSafeAreaSupport = (): boolean => {
    const hasEnvSupport = CSS.supports('padding-top: env(safe-area-inset-top)');
    const navigation = document.querySelector('.navigation');
    const appHeader = document.querySelector('.app-header');

    const navHasSafeArea = navigation ? (
      window.getComputedStyle(navigation).paddingBottom.includes('env') ||
      window.getComputedStyle(navigation).paddingBottom !== '8px'
    ) : false;

    const headerHasSafeArea = appHeader ? (
      window.getComputedStyle(appHeader).paddingTop.includes('env') ||
      window.getComputedStyle(appHeader).paddingTop !== '12px'
    ) : false;

    return hasEnvSupport && (navHasSafeArea || headerHasSafeArea);
  };

  const getTestResultColor = (result: boolean) => {
    return result ? '#22c55e' : '#ef4444';
  };

  const getOverallScore = () => {
    const testCount = Object.keys(testResults).length;
    if (testCount === 0) return 0;
    
    const passedCount = Object.values(testResults).filter(Boolean).length;
    return Math.round((passedCount / testCount) * 100);
  };

  if (process.env.NODE_ENV !== 'development') {
    return null; // Only show in development
  }

  return (
    <div className="mobile-test-suite-overlay">
      <div className="mobile-test-suite">
        <div className="test-header">
          <h2>📱 Mobile Responsiveness Test Suite</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="test-content">
          {/* Device Information */}
          <div className="test-section">
            <h3>🔍 Device Information</h3>
            {deviceInfo && (
              <div className="device-grid">
                <div className="device-item">
                  <strong>Screen:</strong> {deviceInfo.screenWidth}×{deviceInfo.screenHeight}
                </div>
                <div className="device-item">
                  <strong>DPR:</strong> {deviceInfo.devicePixelRatio}
                </div>
                <div className="device-item">
                  <strong>Orientation:</strong> {deviceInfo.orientation}
                </div>
                <div className="device-item">
                  <strong>Touch:</strong> {deviceInfo.touchSupport ? '✅' : '❌'}
                </div>
                <div className="device-item">
                  <strong>Platform:</strong> {deviceInfo.platform}
                </div>
                <div className="device-item">
                  <strong>Mobile:</strong> {deviceInfo.isMobile ? '✅' : '❌'}
                </div>
                <div className="device-item">
                  <strong>iOS:</strong> {deviceInfo.isIOS ? '✅' : '❌'}
                </div>
                <div className="device-item">
                  <strong>Android:</strong> {deviceInfo.isAndroid ? '✅' : '❌'}
                </div>
              </div>
            )}
          </div>

          {/* Performance Metrics */}
          <div className="test-section">
            <h3>⚡ Performance Metrics</h3>
            {performanceMetrics && (
              <div className="metrics-grid">
                <div className="metric-item">
                  <strong>Load Time:</strong> {performanceMetrics.loadTime.toFixed(2)}ms
                </div>
                <div className="metric-item">
                  <strong>Render Time:</strong> {performanceMetrics.renderTime.toFixed(2)}ms
                </div>
                <div className="metric-item">
                  <strong>Scroll Performance:</strong> {performanceMetrics.scrollPerformance.toFixed(2)}ms
                </div>
                <div className="metric-item">
                  <strong>Touch Latency:</strong> {performanceMetrics.touchLatency.toFixed(2)}ms
                </div>
              </div>
            )}
          </div>

          {/* Responsiveness Tests */}
          <div className="test-section">
            <h3>🧪 Responsiveness Tests</h3>
            <div className="test-controls">
              <button 
                className="run-tests-btn"
                onClick={runResponsivenessTests}
                disabled={isRunningTests}
              >
                {isRunningTests ? '🔄 Running Tests...' : '▶️ Run Tests'}
              </button>
              {Object.keys(testResults).length > 0 && (
                <div className="overall-score">
                  Overall Score: <strong style={{ color: getOverallScore() > 80 ? '#22c55e' : getOverallScore() > 60 ? '#ea580c' : '#ef4444' }}>
                    {getOverallScore()}%
                  </strong>
                </div>
              )}
            </div>

            {Object.keys(testResults).length > 0 && (
              <div className="test-results">
                {Object.entries(testResults).map(([test, result]) => (
                  <div key={test} className="test-result">
                    <span 
                      className="test-indicator"
                      style={{ color: getTestResultColor(result) }}
                    >
                      {result ? '✅' : '❌'}
                    </span>
                    <span className="test-name">
                      {test.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="test-section">
            <h3>🛠️ Quick Actions</h3>
            <div className="quick-actions">
              <button onClick={() => window.location.reload()}>
                🔄 Reload App
              </button>
              <button onClick={() => console.clear()}>
                🧹 Clear Console
              </button>
              <button onClick={() => {
                const dataUrl = `data:text/json;charset=utf-8,${encodeURIComponent(
                  JSON.stringify({ deviceInfo, performanceMetrics, testResults }, null, 2)
                )}`;
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = 'mobile-test-results.json';
                link.click();
              }}>
                💾 Export Results
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileTestSuite;