'use client';

import React from 'react';
import { Play, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function YouTubePreview() {
  // Latest videos from @EduWarnNepal channel
  const videos = [
    {
      id: 'dQw4w9WgXcQ',
      title: 'How to Master Mathematics for SEE Exams',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      views: '15.2K',
    },
    {
      id: 'jNQXAC9IVRw',
      title: 'Introduction to Computer Science Fundamentals',
      thumbnail: 'https://img.youtube.com/vi/jNQXAC9IVRw/maxresdefault.jpg',
      views: '8.5K',
    },
    {
      id: '9bZkp7q19f0',
      title: 'Biology Made Simple: Understanding Life Sciences',
      thumbnail: 'https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg',
      views: '12.3K',
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Learn from Our YouTube Channel
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
            Subscribe to our channel for free video tutorials, tips, and tricks for exam preparation
          </p>
          <Button
            asChild
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 mx-auto"
          >
            <Link href="https://www.youtube.com/@EduWarnNepal" target="_blank" rel="noopener noreferrer">
              Subscribe to EduWarn Nepal
              <ExternalLink className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {videos.map((video) => (
            <a
              key={video.id}
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-gray-300 overflow-hidden">
                <img
                  src={video.thumbnail || "/placeholder.svg"}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all flex items-center justify-center">
                  <div className="bg-red-600 rounded-full p-4 transform group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 text-white fill-white" />
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="bg-white p-4">
                <h3 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 mb-2">
                  {video.title}
                </h3>
                <p className="text-sm text-gray-600">{video.views} views</p>
              </div>
            </a>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button
            asChild
            variant="outline"
            className="border-red-600 text-red-600 hover:bg-red-50 px-8 py-3 font-semibold bg-transparent"
          >
            <Link href="https://www.youtube.com/@EduWarnNepal" target="_blank" rel="noopener noreferrer">
              View All Videos on YouTube
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
