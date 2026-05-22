import React from 'react'

export default function EqBars({ count = 5, size = 'normal' }) {
  const heights = size === 'small' ? [10, 16, 12, 14, 10] : [18, 28, 22, 26, 20, 24, 18]
  const bars = Array.from({ length: count }, (_, i) => i)

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: size === 'small' ? 2 : 3, height: size === 'small' ? 16 : 28 }}>
      {bars.map(i => (
        <div
          key={i}
          className="eq-bar"
          style={{
            height: heights[i % heights.length],
            animationDelay: `${i * 0.1}s`,
            width: size === 'small' ? 2 : 3,
          }}
        />
      ))}
    </div>
  )
}
