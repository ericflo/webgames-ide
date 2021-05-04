import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { default as MonacoEditor } from '@monaco-editor/react';
import React, { useCallback, useEffect, useState } from 'react';

type Props = {
  initialValue?: string;
  onSave: (value: string) => void;
  onClose: () => void;
};

const CodeEditor = ({ initialValue, onSave, onClose }: Props) => {
  const [code, setCode] = useState(initialValue || '');
  useEffect(() => setCode(initialValue || ''), []);
  const [_, setKeysDown] = useState([]);
  const isInitialValue = code == initialValue;

  const handleCodeChange = useCallback(setCode, []);
  const handleSaveClick = useCallback(
    (ev: React.MouseEvent) => {
      ev.preventDefault();
      onSave(code);
      setCode('');
      onClose();
    },
    [code]
  );

  useEffect(() => {
    const handleKeyDown = (ev: KeyboardEvent) => {
      setKeysDown((keys) => {
        const resp = [...keys, ev.key.toLowerCase()];
        //console.log('resp', resp);
        if (resp.includes('escape')) {
          ev.preventDefault();
          if (
            !isInitialValue &&
            !confirm('Are you sure you want to quit without saving?')
          ) {
            return [];
          }
          setTimeout(() => {
            setCode('');
            onClose();
          }, 0);
        } else if (resp.includes('meta') && resp.includes('s')) {
          ev.preventDefault();
          setTimeout(() => {
            onSave(code);
          }, 0);
        }
        return resp;
      });
    };
    const handleKeyUp = (ev: KeyboardEvent) => {
      setKeysDown((keys) => keys.filter((k) => k != ev.key.toLowerCase()));
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isInitialValue, code, onSave, onClose]);

  return (
    <div className="w-full h-full overflow-hidden">
      <div className="px-4 py-4 h-14 border-b border-black flex place-content-between">
        <a
          href="https://kaboomjs.com/"
          target="_blank"
          className="text-blue-600"
        >
          Documentation
        </a>
        <a className="mx-4" onClick={handleSaveClick}>
          <FontAwesomeIcon
            className={isInitialValue ? '' : 'text-green-600 fill-current'}
            icon={faCheck}
          />
        </a>
      </div>
      <MonacoEditor
        language="javascript"
        value={code || initialValue}
        onChange={handleCodeChange}
        theme="vs-dark"
      />
    </div>
  );
};

export default CodeEditor;
