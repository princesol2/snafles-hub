import React, { useRef, useState, useEffect } from 'react'

const VirtualTryOn = ({ product, onClose }) => {
  const canvasRef = useRef(null)
  const [bgImage, setBgImage] = useState(null)
  const [overlayOpacity, setOverlayOpacity] = useState(0.7)
  const [overlayScale, setOverlayScale] = useState(1)
  const [overlayX, setOverlayX] = useState(0)
  const [overlayY, setOverlayY] = useState(0)

  const productImage = (product?.images && product.images[0]) || product?.image

  const draw = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (bgImage) {
      const ratio = Math.min(canvas.width / bgImage.width, canvas.height / bgImage.height)
      const w = bgImage.width * ratio
      const h = bgImage.height * ratio
      const x = (canvas.width - w) / 2
      const y = (canvas.height - h) / 2
      ctx.drawImage(bgImage, x, y, w, h)
    } else {
      ctx.fillStyle = '#f3f4f6'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    const overlay = new Image()
    overlay.crossOrigin = 'anonymous'
    overlay.src = productImage || ''
    overlay.onload = () => {
      const w = overlay.width * overlayScale
      const h = overlay.height * overlayScale
      const x = (canvas.width - w) / 2 + overlayX
      const y = (canvas.height - h) / 2 + overlayY
      ctx.globalAlpha = overlayOpacity
      ctx.drawImage(overlay, x, y, w, h)
      ctx.globalAlpha = 1
    }
  }

  useEffect(() => { draw() })
  useEffect(() => { const i = setInterval(draw, 300); return () => clearInterval(i) })

  const handleUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const img = new Image()
    img.onload = () => setBgImage(img)
    img.src = URL.createObjectURL(file)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-large w-full max-w-4xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Virtual Try-On (beta)</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
          <div className="lg:col-span-2">
            <canvas ref={canvasRef} width={800} height={500} className="w-full bg-gray-100 rounded-lg" />
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Upload your photo</label>
              <input type="file" accept="image/*" onChange={handleUpload} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Overlay Opacity: {Math.round(overlayOpacity*100)}%</label>
              <input type="range" min="0.1" max="1" step="0.05" value={overlayOpacity} onChange={e=>setOverlayOpacity(parseFloat(e.target.value))} className="w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Overlay Scale: {overlayScale.toFixed(2)}×</label>
              <input type="range" min="0.2" max="2" step="0.05" value={overlayScale} onChange={e=>setOverlayScale(parseFloat(e.target.value))} className="w-full" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium mb-1">Offset X</label>
                <input type="range" min="-200" max="200" step="5" value={overlayX} onChange={e=>setOverlayX(parseInt(e.target.value))} className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Offset Y</label>
                <input type="range" min="-200" max="200" step="5" value={overlayY} onChange={e=>setOverlayY(parseInt(e.target.value))} className="w-full" />
              </div>
            </div>
            <div className="text-xs text-gray-500">This is a visual approximation for demo purposes.</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VirtualTryOn

