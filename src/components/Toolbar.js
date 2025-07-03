import React from 'react';

function Toolbar({ color, setColor, strokeWidth, setStrokeWidth }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px',
        backgroundColor: '#f5f5f5',
        borderBottom: '1px solid #ccc',
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 1000,
        gap: '10px',
      }}
    >
      {/* Color Picker */}
      <label>
        Color:
        <select value={color} onChange={(e) => setColor(e.target.value)} style={{ marginLeft: '5px' }}>
          <option value="black">Black</option>
          <option value="red">Red</option>
          <option value="blue">Blue</option>
          <option value="green">Green</option>
        </select>
      </label>

      {/* Stroke Width Slider */}
      <label>
        Stroke Width:
        <input
          type="range"
          min="1"
          max="10"
          value={strokeWidth}
          onChange={(e) => setStrokeWidth(Number(e.target.value))}
          style={{ marginLeft: '5px' }}
        />
      </label>
    </div>
  );
}

export default Toolbar;
