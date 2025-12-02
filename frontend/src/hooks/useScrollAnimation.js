import { useEffect, useState, useRef } from 'react';

/**
 * Custom hook for scroll-triggered animations
 * @param {Object} options - Configuration options
 * @param {number} options.threshold - Percentage of element visibility to trigger (0-1)
 * @param {boolean} options.triggerOnce - Whether to trigger animation only once
 * @returns {Object} - { ref, isVisible }
 */
export const useScrollAnimation = (options = {}) => {
    const {
        threshold = 0.1,
        triggerOnce = true,
        rootMargin = '0px'
    } = options;

    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (triggerOnce) {
                        observer.unobserve(element);
                    }
                } else if (!triggerOnce) {
                    setIsVisible(false);
                }
            },
            {
                threshold,
                rootMargin
            }
        );

        observer.observe(element);

        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
    }, [threshold, triggerOnce, rootMargin]);

    return { ref, isVisible };
};

/**
 * Hook to add staggered animation delays to multiple items
 * @param {number} itemCount - Number of items to animate
 * @param {number} baseDelay - Base delay in ms
 * @param {number} staggerDelay - Delay between each item in ms
 */
export const useStaggeredAnimation = (itemCount, baseDelay = 0, staggerDelay = 100) => {
    return Array.from({ length: itemCount }, (_, index) => ({
        animationDelay: `${baseDelay + index * staggerDelay}ms`
    }));
};
