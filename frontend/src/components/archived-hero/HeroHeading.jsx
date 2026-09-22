import React, { useEffect } from 'react';
import customFontUrl from '../../assets/fonts/ZiKuXingQiuFeiYangTi.ttf';

/**
 * Main Hero Display Heading Component.
 * Live HTML text rendered with Strokes-Regular.otf / custom font.
 */
export const HeroHeading = React.forwardRef(function HeroHeading(
  { className = '', style = {}, ...props },
  ref
) {
  useEffect(() => {
    if (typeof FontFace !== 'undefined' && !document.fonts.check("1em 'HashHarbourCustom'")) {
      const font = new FontFace('HashHarbourCustom', `url(${customFontUrl})`, {
        weight: 'normal',
        style: 'normal',
        display: 'swap',
      });
      font.load().then((loadedFont) => {
        document.fonts.add(loadedFont);
      }).catch((err) => {
        console.warn('Failed to load HashHarbourCustom font:', err);
      });
    }
  }, []);
  return (
    <h1
      ref={ref}
      style={{
        fontFamily: "'HashHarbourCustom', 'Strokes', sans-serif",
        fontStyle: 'italic',
        ...style,
      }}
      className={`text-[60px] sm:text-[84px] lg:text-[104px] xl:text-[112px] font-normal italic leading-[0.94] tracking-[0.04em] uppercase text-white ${className}`}
      {...props}
    >
      #HASHHARBOUR
    </h1>
  );
});




