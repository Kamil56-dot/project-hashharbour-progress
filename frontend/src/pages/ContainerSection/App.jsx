import React from 'react';
import ContainerShowcase from './components/ContainerShowcase';

export default function App() {
  return (
    <div className="min-h-screen bg-[#060B14] text-white">
      <ContainerShowcase onBookContainer={() => {}} />
    </div>
  );
}
