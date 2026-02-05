'use client';

import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Download, FileText, ExternalLink } from 'lucide-react';

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
    link.click();
  };

  return (
    <div className="w-full h-full bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 flex flex-col">
      {/* Toolbar */}
      <div className="bg-gradient-to-r from-red-600 to-blue-600 text-white p-3 flex items-center justify-between flex-wrap gap-3 sticky top-0 z-10">
        <h3 className="font-semibold flex items-center gap-2 text-sm">
          <FileText className="w-5 h-5" />
          PDF Viewer
        </h3>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-white/20 rounded p-1">
            <button
              onClick={handleZoomOut}
              className="p-1 rounded hover:bg-white/20 transition"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-medium w-10 text-center">{zoom}%</span>
            <button
              onClick={handleZoomIn}
              className="p-1 rounded hover:bg-white/20 transition"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          <div className="border-l border-white/30 h-5" />

          <button
            onClick={handleDownload}
            className="p-1 rounded hover:bg-white/20 transition flex items-center gap-1"
            title="Download PDF"
            aria-label="Download PDF"
          >
            <Download className="w-4 h-4" />
            <span className="text-xs font-medium hidden sm:inline">Download</span>
          </button>

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 rounded hover:bg-white/20 transition flex items-center gap-1"
            title="Open in new tab"
            aria-label="Open in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* PDF Container */}
      <div className="flex-1 overflow-auto bg-gray-50 flex items-start justify-center py-4">
        <div 
          style={{ 
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 200ms ease-out'
          }}
          className="bg-white shadow-md"
        >
          <embed
            src={url}
            type="application/pdf"
            width="800"
            height="1000"
            title="PDF Document"
            className="w-full"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-100 border-t border-gray-200 px-3 py-2 text-center text-xs text-gray-600">
        Use zoom controls to resize • Right-click to save or print
      </div>
    </div>
  );
}
