import React, { useEffect } from 'react';

const NavigationDebug: React.FC = () => {
  useEffect(() => {
    // Check for global event listeners that might be preventing clicks
    const checkEventListeners = () => {
      console.log('=== Navigation Debug Report ===');
      
      // Check for pointer-events: none on parent elements
      const navigation = document.querySelector('.navigation');
      if (navigation) {
        let element = navigation as HTMLElement;
        const problemElements: HTMLElement[] = [];
        
        while (element && element !== document.body) {
          const style = window.getComputedStyle(element);
          if (style.pointerEvents === 'none') {
            problemElements.push(element);
          }
          element = element.parentElement!;
        }
        
        if (problemElements.length > 0) {
          console.error('Found elements with pointer-events: none:', problemElements);
        }
      }
      
      // Check for overlapping elements
      const navButtons = document.querySelectorAll('.nav-item');
      navButtons.forEach((button, index) => {
        const rect = button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Temporarily hide the button to check what's behind it
        const originalVisibility = (button as HTMLElement).style.visibility;
        (button as HTMLElement).style.visibility = 'hidden';
        const elementBehind = document.elementFromPoint(centerX, centerY);
        (button as HTMLElement).style.visibility = originalVisibility;
        
        if (elementBehind && !elementBehind.classList.contains('navigation')) {
          console.warn(`Nav button ${index} might be blocked by:`, elementBehind);
        }
      });
      
      // Test click simulation
      const testButton = document.querySelector('.nav-item');
      if (testButton) {
        console.log('Attempting to simulate click on first nav button...');
        const clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        });
        
        const preventedDefault = !testButton.dispatchEvent(clickEvent);
        if (preventedDefault) {
          console.error('Click event was prevented!');
        }
        
        // Check for event listeners
        const listeners = (window as any).getEventListeners?.(testButton);
        if (listeners) {
          console.log('Event listeners on nav button:', listeners);
        }
        
        // Check parent listeners
        let parent = testButton.parentElement;
        while (parent) {
          const parentListeners = (window as any).getEventListeners?.(parent);
          if (parentListeners?.click || parentListeners?.pointerdown || parentListeners?.touchstart) {
            console.log('Parent element has listeners:', parent, parentListeners);
          }
          parent = parent.parentElement;
        }
      }
      
      console.log('=== End Debug Report ===');
    };
    
    // Run debug check after a short delay to ensure DOM is ready
    setTimeout(checkEventListeners, 1000);
    
    // Also run on click anywhere to help debug
    const debugClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('.navigation')) {
        console.log('Click detected on navigation area:', e.target);
        checkEventListeners();
      }
    };
    
    document.addEventListener('click', debugClick);
    
    return () => {
      document.removeEventListener('click', debugClick);
    };
  }, []);
  
  return null;
};

export default NavigationDebug;