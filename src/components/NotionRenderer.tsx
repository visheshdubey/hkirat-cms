'use client';
// core styles shared by all of react-notion-x (required)
import 'react-notion-x/src/styles.css';
// used for code syntax highlighting (optional)
import 'prismjs/themes/prism-tomorrow.css';
// used for rendering equations (optional)
import 'katex/dist/katex.min.css';

import { DownloadIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { NotionRenderer as NotionRendererLib } from 'react-notion-x';

import { cn } from '@/lib/utils';

import { Loader } from './Loader';
import { buttonVariants } from './ui/button';

const Code = dynamic(() =>
  import('react-notion-x/build/third-party/code').then((m) => m.Code),
);
const Equation = dynamic(() =>
  import('react-notion-x/build/third-party/equation').then((m) => m.Equation),
);

// Week-4-1-647987d9b1894c54ba5c822978377910
export const NotionRenderer = ({ id }: { id: string }) => {
  const [data, setData] = useState(null);
  async function main() {
    const res = await fetch(`/api/notion?id=${id}`);
    const json = await res.json();
    setData(json.recordMap);
  }

  useEffect(() => {
    main();
  }, [id]);

  if (!data) {
    return <Loader />;
  }

  return (
    <div className="relative">
      <Link
        href={`/pdf/${id}`}
        target="_blank"
        className={cn(
          buttonVariants({ variant: 'secondary', size: 'sm' }),
          'absolute z-20 right-4 top-4 gap-1',
        )}
      >
        Download
        <DownloadIcon size={16} />
      </Link>
      <div style={{}}>
        <NotionRendererLib
          recordMap={data}
          fullPage={true}
          darkMode={true}
          className="z-10"
          components={{
            Code,
            Equation,
          }}
        />
      </div>
    </div>
  );
};
