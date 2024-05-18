import React, { useState, useEffect } from 'react';
import './popup.css';

export const Popup = ({ message, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 2000);

    return () => clearTimeout(timeout);
  }, [onClose]);

  return (
    <div className={`popup ${isVisible ? 'visible' : 'popup-exit'}`}>
      <div className="popup-content">{message}</div>
    </div>
  );
};
