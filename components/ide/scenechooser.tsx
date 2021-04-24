import React, { useCallback } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlusSquare } from '@fortawesome/free-solid-svg-icons';

type Props = {
  className?: string;
  currentSceneName?: string;
  sceneNames?: string[];
  onChange: (name: string) => void;
  onNew: () => void;
  onDelete: () => void;
};

function handleChange(
  onChange: (name: string) => void,
  ev: React.ChangeEvent<HTMLSelectElement>
) {
  if (onChange) {
    onChange(ev.target.value);
  }
}

const SceneChooser = ({
  className,
  currentSceneName,
  sceneNames,
  onChange,
  onNew,
  onDelete,
}: Props) => {
  const handleAddClick = useCallback(
    (ev: React.MouseEvent) => {
      ev.preventDefault();
      onNew();
    },
    [onNew]
  );
  const handleDeleteClick = useCallback(
    (ev: React.MouseEvent) => {
      ev.preventDefault();
      onDelete();
    },
    [onDelete]
  );
  return (
    <div className={className + ' flex pr-4'}>
      <h3 className="flex-none mx-4 font-light text-black text-opacity-70 w-14 self-center select-none">
        Scene
      </h3>
      <div className="flex-1 flex flex-row">
        <select
          className="flex-1 rounded-full m-1"
          onChange={handleChange.bind(null, onChange)}
          value={currentSceneName}
        >
          {sceneNames.map((sceneName: string) => (
            <option key={sceneName} value={sceneName}>
              Scene: {sceneName}
            </option>
          ))}
        </select>
        <button className="flex-none m-2" onClick={handleAddClick}>
          <FontAwesomeIcon icon={faPlusSquare} />
        </button>
        {sceneNames.length > 1 && currentSceneName != 'main' ? (
          <button className="flex-none m-2" onClick={handleDeleteClick}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default SceneChooser;
