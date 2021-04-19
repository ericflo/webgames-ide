import React, { useEffect, useRef, useState } from 'react';

type Props = {
  className?: string;
};

const Console = ({ className }: Props) => {
  const [logs, setLogs] = useState([] as any[][]);

  const ulRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    window.addEventListener('message', (ev: MessageEvent) => {
      if (ev.data.type === 'console.log') {
        setLogs((curr: any[][]): any[][] => {
          return [...curr, ev.data.args];
        });
        ulRef.current.scrollTo(0, ulRef.current.scrollHeight);
      }
    });
  }, [ulRef]);

  return (
    <div className={className + ' flex flex-col'}>
      <h3 className="flex-none mx-5 my-2 font-light text-black text-opacity-70">
        Console
      </h3>
      <ul ref={ulRef} className="flex-1 px-5 overflow-y-scroll overflow-x-hide">
        {logs.map((log: any[], i: number) => {
          return <li key={i}>{log.join(' ')}</li>;
        })}
      </ul>
    </div>
  );
};

export default Console;
