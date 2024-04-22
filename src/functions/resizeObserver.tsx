import { useRef, useState, useEffect } from "react";

interface Size {
    parentWidth: number;
    parentHeight: number;
}

export default function useResizeObserver(ref: React.RefObject<Element>): Size {
    const [size, setSize] = useState<Size>({ parentWidth: 0, parentHeight: 0 });

    useEffect(() => {
        const observeTarget = ref.current;
        if (!observeTarget) return;

        const resizeObserver = new ResizeObserver((entries) => {
        entries.forEach(entry => {
            setSize({
            parentWidth: entry.contentRect.width,
            parentHeight: entry.contentRect.height
            });
        });
        });

        resizeObserver.observe(observeTarget);

        return () => {
        resizeObserver.unobserve(observeTarget);
        };
    }, [ref]);

    return size;
}