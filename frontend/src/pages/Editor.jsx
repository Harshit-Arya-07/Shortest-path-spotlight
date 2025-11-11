import React from 'react';
import Header from '../components/Header';
import GraphCanvas from '../components/GraphCanvas';
import ControlPanel from '../components/ControlPanel';
import VisualizationPanel from '../components/VisualizationPanel';

export default function Editor() {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1">
          <GraphCanvas />
        </div>
        <div className="flex">
          <ControlPanel />
          <VisualizationPanel />
        </div>
      </div>
    </div>
  );
}
