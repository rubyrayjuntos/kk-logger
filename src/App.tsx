/**
 * Main App Component - HACCP Digital Compliance System
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { HACCPApp } from './HACCPApp';

const App: React.FC = () => {
  return <HACCPApp />;
};

// Render app
const root = createRoot(document.getElementById('root')!);
root.render(<App />);