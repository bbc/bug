import { forwardRef, useImperativeHandle, useRef } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";

const BugScrollbars = forwardRef(({ children, onScrollFrame, ...props }, ref) => {
    const scrollRef = useRef(null);

    // expose scroll methods to parent
    useImperativeHandle(ref, () => ({
        scrollToTop: () => {
            scrollRef.current?.scrollToTop();
        },
        scrollToBottom: () => {
            scrollRef.current?.scrollToBottom();
        },
        getScrollElement: () => scrollRef.current?.getScrollElement(),
    }));

    return (
        <Scrollbars {...props} ref={scrollRef} onScrollFrame={onScrollFrame}>
            {children}
        </Scrollbars>
    );
});

export default BugScrollbars;
