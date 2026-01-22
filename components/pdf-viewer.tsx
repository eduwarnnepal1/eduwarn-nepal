'use client';

import { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, FileText } from 'lucide-react';

interface PDFViewerProps {
  url: string;
}

export function PDFViewer({ url }: PDFViewerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dynamic import of pdf.js
    const loadPDF = async () => {
      try {
        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

        const pdf = await pdfjsLib.getDocument(url).promise;
        setTotalPages(pdf.numPages);
        setLoading(false);
      } catch (error) {
        console.error('Error loading PDF:', error);
        setLoading(false);
      }
    };

    loadPDF();
  }, [url]);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleZoomIn = () => {
    if (zoom < 200) setZoom(zoom + 10);
  };

  const handleZoomOut = () => {
    if (zoom > 50) setZoom(zoom - 10);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'study-notes.pdf';
    link.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading PDF...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200">
      {/* PDF Toolbar */}
      <div className="bg-gradient-to-r from-red-600 to-blue-600 text-white p-4 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="p-2 rounded hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
            title="Previous page"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="p-2 rounded hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
            title="Next page"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

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
        </div>

        <button
          onClick={handleDownload}
          className="p-2 rounded hover:bg-white/20 transition flex items-center gap-2"
          title="Download PDF"
        >
          <Download className="w-5 h-5" />
          <span className="text-sm font-medium">Download</span>
        </button>
      </div>

      {/* PDF Display */}
      <div className="w-full bg-gray-50 p-4 overflow-auto" style={{ maxHeight: '600px' }}>
        <embed
          src={`${url}#page=${currentPage}&zoom=${zoom}`}
          type="application/pdf"
          width="100%"
          height="500"
          className="rounded"
        />
      </div>

      {/* PDF Footer */}
      <div className="bg-gray-100 border-t border-gray-200 p-4 text-center text-sm text-gray-600">
        Viewing page {currentPage} of {totalPages}
      </div>
    </div>
  );
}
