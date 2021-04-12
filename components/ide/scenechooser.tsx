import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlusSquare } from '@fortawesome/free-solid-svg-icons';

type Props = {
  className?: string;
  sceneNames?: string[];
  onChange?: (name: string) => void;
};

function handleChange(
  onChange: (name: string) => void,
  ev: React.ChangeEvent<HTMLSelectElement>
) {
  if (onChange) {
    onChange(ev.target.value);
  }
}

const SceneChooser = ({ className, sceneNames, onChange }: Props) => (
  <div className={className + ' flex'}>
    <h3 className="flex-none mx-4 font-light text-black text-opacity-70 w-14 self-center">
      Scene
    </h3>
    <div className="flex-1 flex flex-row">
      <select
        className="flex-1 rounded-full m-1"
        onChange={handleChange.bind(null, onChange)}
      >
        {sceneNames.map((sceneName: string) => (
          <option key={sceneName} value={sceneName}>
            Scene: {sceneName}
          </option>
        ))}
      </select>
      <button className="flex-none m-2">
        <FontAwesomeIcon icon={faPlusSquare} />
      </button>
      {sceneNames.length > 1 ? (
        <button className="flex-none m-2">
          <FontAwesomeIcon icon={faTrash} />
        </button>
      ) : null}
    </div>
  </div>
);

export default SceneChooser;
