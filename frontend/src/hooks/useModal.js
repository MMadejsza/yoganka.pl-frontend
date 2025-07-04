import { useCallback, useEffect, useRef, useState } from 'react';

export function useModal(initialOpen = false) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimeoutRef = useRef(null);

  // delay visibility for animation
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setIsVisible(true), 5);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  // Block scroll
  useEffect(() => {
    if (isVisible) {
      document.body.classList.add('stopScroll');
    } else {
      document.body.classList.remove('stopScroll');
    }
    return () => document.body.classList.remove('stopScroll');
  }, [isVisible]);

  const openModal = useCallback(() => {
    setIsOpen(true);
    setIsClosing(false);
  }, []);

  // Closing function which after timeout will trigger passed onclose function (callback) to remove from dom
  const closeModal = useCallback(callback => {
    setIsClosing(true);
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      if (callback) callback();
    }, 400); // the same as css duration
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  return {
    isOpen,
    isVisible,
    isClosing,
    openModal,
    closeModal,
  };
}
