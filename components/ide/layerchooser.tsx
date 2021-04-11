import React, { useMemo } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlusSquare } from '@fortawesome/free-solid-svg-icons';

type Props = {
  className?: string;
  layerNames?: string[];
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

const LayerChooser = ({ className, layerNames, onChange }: Props) => (
  <div className={className + ' flex flex-row'}>
    <select
      className="flex-1 rounded-full m-1"
      onChange={handleChange.bind(null, onChange)}
    >
      {layerNames.map((layerName: string) => (
        <option key={layerName} value={layerName}>
          Layer: {layerName}
        </option>
      ))}
    </select>
    <button className="flex-none m-2">
      <FontAwesomeIcon icon={faPlusSquare} />
    </button>
    {layerNames.length > 1 ? (
      <button className="flex-none m-2">
        <FontAwesomeIcon icon={faTrash} />
      </button>
    ) : null}
  </div>
);

export default LayerChooser;
