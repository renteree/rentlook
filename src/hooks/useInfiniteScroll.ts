import { useEffect } from 'react';

type Types = {
  onLoadMore: Function;
  disabled?: boolean;
  selectorId?: string;
};

export const useInfiniteScroll = ({ onLoadMore, disabled = false, selectorId = 'main-container' }: Types) => {
  useEffect(() => {
    const element = document.getElementById(selectorId) || document.documentElement;
    const handleScroll = () => {
      const isPageEnd = element.offsetHeight + element.scrollTop >= element.scrollHeight - 40;

      if (isPageEnd && !disabled) {
        onLoadMore();
      }
    };

    element.addEventListener('scroll', handleScroll, { passive: true });
    return () => element.removeEventListener('scroll', handleScroll);
  }, [disabled, onLoadMore, selectorId]);
};
