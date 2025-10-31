// src/App.js
import React, { Suspense } from 'react';
const Home = React.lazy(() => import('./pages/Home'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Home />
    </Suspense>
  );
}
