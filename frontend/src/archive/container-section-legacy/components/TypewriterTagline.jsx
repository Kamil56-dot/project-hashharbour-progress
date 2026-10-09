import React, { useState, useEffect } from 'react';

const lines = [
  "Moving Trade. Powering Growth.",
  "Connecting Worlds. Delivering Trust.",
  "Smart Logistics. Seamless Tomorrow."
];

export default function TypewriterTagline() {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const targetLine = lines[currentLineIndex];
    const typingSpeed = isDeleting ? 30 : 60;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < targetLine.length) {
          setCurrentText(targetLine.slice(0, currentText.length + 1));
        } else {
          // Pause at full line before starting deletion or next phase
          setTimeout(() => {
            if (currentLineIndex < lines.length - 1) {
              setIsDeleting(true);
            }
          }, 2500);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(targetLine.slice(0, currentText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentLineIndex((prev) => (prev + 1) % lines.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentLineIndex]);

  return (
    <div className="border-l-[3px] border-[#00E5FF] pl-5 my-6 max-w-[500px]">
      <div className="text-[17px] sm:text-[18px] font-normal text-white/85 italic leading-relaxed min-h-[80px]">
        {lines.slice(0, currentLineIndex).map((line, idx) => (
          <p key={idx} className="text-white/70">{line}</p>
        ))}
        <p className="text-[#00E5FF]">
          {currentText}
          <span className="inline-block animate-pulse font-bold text-[#00E5FF] ml-0.5">|</span>
        </p>
      </div>
    </div>
  );
}
