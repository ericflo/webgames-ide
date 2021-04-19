import React, { useEffect, useState } from 'react';

type Props = {
  className?: string;
};

const Console = ({ className }: Props) => {
  const [logs, setLogs] = useState([] as any[][]);

  useEffect(() => {
    window.addEventListener('message', (ev: MessageEvent) => {
      if (ev.data.type != 'console.log') {
        return;
      }
      setLogs((curr: any[][]): any[][] => {
        return [...curr, ev.data.args];
      });
    });
  }, []);

  return (
    <div className={className + ' flex flex-col'}>
      <h3 className="flex-none mx-5 my-2 font-light text-black text-opacity-70">
        Console
      </h3>
      <ul className="flex-1 px-5 overflow-y-scroll overflow-x-hide">
        {logs.map((log: any[], i: number) => {
          return <li key={i}>{log.join(' ')}</li>;
        })}
      </ul>
    </div>
  );
};

export default Console;
