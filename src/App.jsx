import React from 'react';
import { Box } from '@mui/material';
import Sidebar from './components/Sidebar';
import PreviewArea from './components/PreviewArea';
import MidArea from './components/MidArea';
import SpriteLibrary from './components/SpriteLibrary'; 
import './App.css';

function App() {
  return (
    <div>
      <div className="header">
        SCRATCH CLONE APP
      </div>
      
      <div className="main-container">
        <div className="actions-section">
          <div className="section-header"></div>
          <Sidebar />
        </div>

        <div className="preview-section">
          <div className="section-header">PREVIEW</div>
          <PreviewArea />
        </div>

        <div className="coding-section">
          <div className="section-header"></div>
          <MidArea />
        </div>

        <div className="sprite-library-section">
          <div className="section-header">SPRITE LIBRARY</div>
          <SpriteLibrary />
        </div>
      </div>
    </div>
  );
}

export default App;
