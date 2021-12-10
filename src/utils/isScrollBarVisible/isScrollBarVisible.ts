import { RefObject } from 'react';

export const isScrollBarVisible = (ref: RefObject<any>) => Boolean(
    ref &&
    ref.current &&
    ref.current.scrollHeight - ref.current.scrollTop !== ref.current.clientHeight,
);
