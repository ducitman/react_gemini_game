
import React, { useState } from 'react';

interface UserInputProps {
  onSubmit: (action: string) => void;
  disabled: boolean;
}

const UserInput: React.FC<UserInputProps> = ({ onSubmit, disabled }) => {
  const [action, setAction] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (action.trim()) {
      onSubmit(action);
      setAction('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <span className="text-cyan-400 text-2xl font-bold select-none">&gt;</span>
      <input
        type="text"
        value={action}
        onChange={(e) => setAction(e.target.value)}
        placeholder="What do you do?"
        disabled={disabled}
        className="flex-grow bg-transparent border-b-2 border-green-700 focus:border-green-400 text-cyan-400 text-xl p-2 outline-none transition-colors duration-300 disabled:opacity-50"
        autoFocus
      />
      <button
        type="submit"
        disabled={disabled}
        className="bg-green-800 text-green-300 border-2 border-green-600 px-6 py-2 rounded-sm hover:bg-green-700 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-bold"
      >
        SEND
      </button>
    </form>
  );
};

export default UserInput;
