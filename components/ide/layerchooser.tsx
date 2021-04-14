import React, { useCallback } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlusSquare } from '@fortawesome/free-solid-svg-icons';

type Props = {
  className?: string;
  layerNames?: string[];
  layerIndex: number;
  onChange?: (name: string) => void;
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

const LayerChooser = ({
  className,
  layerNames,
  layerIndex,
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
    <div className={className + ' flex flex-row mr-4'}>
      <select
        className="flex-1 rounded-full m-1"
        onChange={handleChange.bind(null, onChange)}
        value={layerNames[layerIndex]}
      >
        {layerNames.map((layerName: string) => (
          <option key={layerName} value={layerName}>
            Layer: {layerName}
          </option>
        ))}
      </select>
      <button className="flex-none m-2">
        <FontAwesomeIcon icon={faPlusSquare} onClick={handleAddClick} />
      </button>
      {layerNames.length > 1 ? (
        <button className="flex-none m-2">
          <FontAwesomeIcon icon={faTrash} onClick={handleDeleteClick} />
        </button>
      ) : null}
    </div>
  );
};

export default LayerChooser;
