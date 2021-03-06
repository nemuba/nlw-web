import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Home from './pages/Home';
import Point from './pages/Point';

const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <Route exact path="/" component={Home} />
      <Route path="/create-point" component={Point} />
    </BrowserRouter>
  );
}

export default Routes;