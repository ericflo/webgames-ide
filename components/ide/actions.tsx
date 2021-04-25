import React, { useCallback } from 'react';
import { Action, ActionType } from '../data';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlusSquare,
  faTrash,
  faEdit,
} from '@fortawesome/free-solid-svg-icons';

type Props = {
  className?: string;
  actions: Action[];
  editingActionIndex: number;
  tags: string[];
  onAddAction: () => void;
  onDeleteAction: (index: number) => void;
  onChangeAction: (index: number, action: Action) => void;
  onEditAction: (index: number) => void;
};

const Actions = ({
  className,
  actions,
  editingActionIndex,
  tags,
  onAddAction,
  onDeleteAction,
  onChangeAction,
  onEditAction,
}: Props) => {
  const handleAddActionClick = useCallback((ev: React.MouseEvent) => {
    ev.preventDefault();
    onAddAction();
  }, []);

  const handleDeleteActionClick = useCallback(
    (i: number, ev: React.MouseEvent) => {
      ev.preventDefault();
      if (confirm('Are you sure you want to delete this action?')) {
        onDeleteAction(i);
      }
    },
    []
  );

  const handleChangeType = useCallback(
    (i: number, action: Action, ev: React.ChangeEvent<HTMLSelectElement>) => {
      action.type = ev.target.value as ActionType;
      onChangeAction(i, action);
    },
    []
  );

  const handleChangeTag = useCallback(
    (i: number, action: Action, ev: React.ChangeEvent<HTMLSelectElement>) => {
      action.tag = ev.target.value;
      onChangeAction(i, action);
    },
    []
  );

  const handleChangeEventName = useCallback(
    (i: number, action: Action, ev: React.ChangeEvent<HTMLSelectElement>) => {
      action.eventName = ev.target.value;
      onChangeAction(i, action);
    },
    []
  );

  const handleChangeKeyName = useCallback(
    (i: number, action: Action, ev: React.ChangeEvent<HTMLInputElement>) => {
      action.keyName = ev.target.value;
      onChangeAction(i, action);
    },
    []
  );

  const handleChangeOtherTag = useCallback(
    (i: number, action: Action, ev: React.ChangeEvent<HTMLSelectElement>) => {
      action.otherTag = ev.target.value;
      onChangeAction(i, action);
    },
    []
  );

  const handleEditActionClick = useCallback(
    (i: number, action: Action, ev: React.MouseEvent) => {
      ev.preventDefault();
      onEditAction(i);
    },
    [onEditAction]
  );

  return (
    <div className={className + ' flex flex-col relative'}>
      <h3 className="flex mx-5 my-2 font-light text-black text-opacity-70 select-none">
        <span className="flex-1">Actions</span>
      </h3>
      <ul className="overflow-y-scroll overflow-x-hide">
        {actions.map((action: Action, i: number) => {
          return (
            <li
              key={i}
              className={'px-4 py-2 select-none flex place-items-center'}
            >
              <select
                className="flex-none w-24"
                value={action.type}
                onChange={handleChangeType.bind(null, i, action)}
              >
                <option value={ActionType.Action}>Action</option>
                <option value={ActionType.Render}>Render</option>
                <option value={ActionType.Collides}>Collides</option>
                <option value={ActionType.Overlaps}>Overlaps</option>
                <option value={ActionType.On}>On</option>
                <option value={ActionType.KeyDown}>KeyDown</option>
                <option value={ActionType.KeyPress}>KeyPress</option>
                <option value={ActionType.KeyRelease}>KeyRelease</option>
                <option value={ActionType.CharInput}>CharInput</option>
                <option value={ActionType.MouseDown}>MouseDown</option>
                <option value={ActionType.MouseClick}>MouseClick</option>
                <option value={ActionType.MouseRelease}>MouseRelease</option>
              </select>
              {action.type == ActionType.On ? (
                <input
                  className="flex-none ml-2 w-28"
                  type="text"
                  placeholder="eventName"
                  value={action.eventName}
                  onChange={handleChangeEventName.bind(null, i, action)}
                />
              ) : null}
              {action.type == ActionType.Action ||
              action.type == ActionType.Render ||
              action.type == ActionType.Collides ||
              action.type == ActionType.Overlaps ||
              action.type == ActionType.On ? (
                <select
                  className={
                    (action.type == ActionType.Action ||
                    action.type == ActionType.Render
                      ? 'w-32'
                      : 'w-16') + ' flex-none ml-2'
                  }
                  value={action.tag}
                  onChange={handleChangeTag.bind(null, i, action)}
                >
                  <option value="">None</option>
                  {tags.map((tag: string) => {
                    return (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    );
                  })}
                </select>
              ) : null}
              {action.type == ActionType.KeyDown ||
              action.type == ActionType.KeyPress ||
              action.type == ActionType.KeyRelease ? (
                <input
                  className="flex-none ml-2 w-28"
                  type="text"
                  placeholder="key"
                  value={action.eventName}
                  onChange={handleChangeKeyName.bind(null, i, action)}
                />
              ) : null}
              {action.type == ActionType.Collides ||
              action.type == ActionType.Overlaps ? (
                <select
                  className="flex-1 ml-2 w-16"
                  defaultValue={action.otherTag}
                  onChange={handleChangeOtherTag.bind(null, i, action)}
                >
                  {tags.map((tag: string) => {
                    return (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    );
                  })}
                </select>
              ) : null}
              <span
                className={
                  (editingActionIndex == i ? 'bg-gray-300' : '') +
                  ' px-1.5 py-2.5 flex-1 ml-2 cursor-pointer'
                }
                onClick={handleEditActionClick.bind(null, i, action)}
              >
                <FontAwesomeIcon icon={faEdit} />
              </span>
              <span
                className="flex-1 ml-2 cursor-pointer px-1.5 py-2.5"
                onClick={handleDeleteActionClick.bind(null, i)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </span>
            </li>
          );
        })}
      </ul>
      <button
        className="absolute bottom-3 left-3 bg-white bg-opacity-60 w-10 h-10 rounded-full cursor-pointer border border-gray-500 shadow-2xl"
        onClick={handleAddActionClick}
      >
        <FontAwesomeIcon
          icon={faPlusSquare}
          className="text-gray-800 cursor-pointer"
        />
      </button>
    </div>
  );
};

export default Actions;
