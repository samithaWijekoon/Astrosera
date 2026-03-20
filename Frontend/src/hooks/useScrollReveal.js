import { useEffect, useRef } from 'react';

/**
 * useScrollReveal
 * Attaches an IntersectionObserver to the returned ref.
 * When the element enters the viewport, it gets the class `is-visible`
 * (which you define in your CSS to trigger the reveal animation).
 *
 * @param {Object} options - IntersectionObserver options
 */
const useScrollReveal = (options = {}) => {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add('is-visible');
                    observer.unobserve(el); // only animate once
                }
            },
            {
                threshold: 0.12,
                ...options,
            }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return ref;
};

export default useScrollReveal;
