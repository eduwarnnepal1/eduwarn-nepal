'use client';

import { useState } from 'react';
import { ZoomIn, ZoomOut, Download, FileText } from 'lucide-react';

interface PDFViewerProps {
  url: string;
}

export function PDFViewer({ url }: PDFViewerProps) {
  const [zoom, setZoom] = useState(100);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 20, 200));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 20, 50));
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'study-notes.pdf';
    link.target = '_blank';
    link.click();
  };

  return (
    <div className="w-full bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200">
      <div className="bg-gradient-to-r from-red-600 to-blue-600 text-white p-4 flex items-center justify-between flex-wrap gap-4 sticky top-0 z-10">
        <h3 className="font-semibold flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Study Notes
        </h3>

        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            className="p-2 rounded hover:bg-white/20 transition"
            title="Zoom out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium w-12 text-center">{zoom}%</span>
          <button
            onClick={handleZoomIn}
            className="p-2 rounded hover:bg-white/20 transition"
            title="Zoom in"
          >
            <ZoomIn className="w-5 h-5" />
          </button>

          <div className="border-l border-white/30 mx-2" />

          <button
            onClick={handleDownload}
            className="p-2 rounded hover:bg-white/20 transition flex items-center gap-2"
            title="Download PDF"
          >
            <Download className="w-5 h-5" />
            <span className="text-sm font-medium hidden sm:inline">Download</span>
          </button>
        </div>
      </div>

      <div className="w-full bg-gray-50 overflow-auto" style={{ maxHeight: '600px' }}>
        <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }} className="transition-transform">
          <iframe
            src={`${url}#zoom=${zoom}&view=FitH`}
            width="100%"
            height="600"
            style={{ border: 'none', minWidth: '800px' }}
            title="PDF Viewer"
            className="bg-white"
          />
        </div>
      </div>

      <div className="bg-gray-100 border-t border-gray-200 px-4 py-2 text-center text-xs text-gray-600">
        PDF Viewer - Use zoom controls to adjust view size
      </div>
    </div>
  );
}
