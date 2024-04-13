'use client';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';

// import { QualitySelector } from '../QualitySelector';
import { VideoPlayerSegment } from '@/components/VideoPlayerSegment';
import { handleMarkAsCompleted } from '@/lib/utils';

import { buttonVariants, Button } from '../ui/button';
import VideoContentChapters from '../VideoContentChapters';

export const ContentRendererClient = ({
  metadata,
  content,
  nextContent,
}: {
  nextContent: {
    id: number;
    type: string;
    title: string;
  } | null;
  metadata: any;
  content: {
    type: 'video';
    id: number;
    title: string;
    thumbnail: string;
    description: string;
    markAsCompleted: boolean;
  };
}) => {
  const [contentCompleted, setContentCompleted] = useState(
    content.markAsCompleted,
  );
  const [loadingMarkAs, setLoadingMarkAs] = useState(false);
  const [showChapters, setShowChapters] = useState(
    metadata?.segments?.length > 0,
  );
  const searchParams = useSearchParams();

  const router = useRouter();

  //@ts-ignore
  const [quality, setQuality] = useState<string>(
    searchParams.get('quality') ?? '1080',
  );

  if (!metadata) {
    return <div>Loading</div>;
  }

  const mpdUrl = metadata?.[quality || '1080'] || '';

  const source = useMemo(() => {
    if (mpdUrl.endsWith('.mpd')) {
      return {
        src: mpdUrl,
        type: 'application/dash+xml',
        keySystems: {
          'com.widevine.alpha':
            'https://widevine-dash.ezdrm.com/proxy?pX=288FF5&user_id=MTAwMA==',
        },
      };
    } else if (mpdUrl.endsWith('.m3u8')) {
      return {
        src: mpdUrl,
        type: 'application/x-mpegURL',
      };
    }
    return {
      src: mpdUrl,
      type: 'video/mp4',
    };
  }, [mpdUrl]);

  const toggleShowChapters = () => {
    setShowChapters((prev) => !prev);
  };

  const handleMarkCompleted = async () => {
    setLoadingMarkAs(true);
    const data: any = await handleMarkAsCompleted(
      !contentCompleted,
      content.id,
    );

    if (data.contentId) {
      setContentCompleted((prev) => !prev);
    }
    setLoadingMarkAs(false);
  };

  return (
    <div className="flex flex-col items-start gap-2 lg:flex-row">
      <div className="flex-1 w-full">
        <VideoPlayerSegment
          setQuality={setQuality}
          contentId={content.id}
          subtitles={metadata.subtitles}
          thumbnails={[]}
          segments={metadata?.segments || []}
          videoJsOptions={{
            playbackrates: [0.5, 1, 1.25, 1.5, 1.75, 2],
            controls: true,
            fluid: true,
            html5: {
              vhs: {
                overridenative: true,
              },
            },
            thumbnail: metadata.thumbnail || false, // data.isComposite ? data.thumbnails[0] : null,
            isComposite: true,
            height: 720,
            width: 1080,
            delta: 30,
            autoplay: true,
            responsive: true,
            sources: [source],
          }}
          onVideoEnd={() => {
            setContentCompleted(true);
          }}
        />
        <br />
        <div className="flex flex-col justify-between w-full gap-2 mb-2">
          <div className="text-2xl font-medium">{content.title}</div>
          <div className="flex items-center justify-between">
            <Button
              disabled={loadingMarkAs}
              onClick={handleMarkCompleted}
              size={'sm'}
            >
              {contentCompleted ? 'Mark as Incomplete' : 'Mark as completed'}
            </Button>
            {!!metadata.slides && (
              <Link
                href={metadata.slides}
                target="_blank"
                className={buttonVariants({ size: 'sm', variant: 'default' })}
              >
                Slides
              </Link>
            )}
          </div>

          <div>
            {/* <QualitySelector /> */}
            <br />

            {!showChapters && metadata.segments?.length > 0 && (
              <button
                className="p-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
                onClick={() => {
                  scrollTo({ top: 0, behavior: 'smooth' });
                  toggleShowChapters();
                }}
              >
                View All Chapters
              </button>
            )}
          </div>
        </div>
        {nextContent ? (
          <div className="flex flex-row-reverse">
            <button
              className="px-4 py-2 ml-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
              onClick={() => {
                const originalPath = window.location.pathname;
                const parts = originalPath.split('/');
                parts.pop();
                parts.push(nextContent.id.toString());
                const newPath = parts.join('/');
                router.push(newPath);
              }}
            >
              {nextContent.title}
            </button>{' '}
          </div>
        ) : null}
      </div>

      {showChapters && (
        <VideoContentChapters
          segments={metadata?.segments}
          onCancel={toggleShowChapters}
        />
      )}
    </div>
  );
};
