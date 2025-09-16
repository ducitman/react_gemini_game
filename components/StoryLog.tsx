
import React, { useRef, useEffect } from 'react';
import { StoryTurn } from '../types';

interface StoryLogProps {
  storyTurns: StoryTurn[];
}

const StoryLog: React.FC<StoryLogProps> = ({ storyTurns }) => {
  const endOfLogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfLogRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [storyTurns]);

  return (
    <div className="flex-grow overflow-y-auto pr-2 text-lg leading-relaxed">
      {storyTurns.map((turn) => (
        <div key={turn.id} className="mb-4 whitespace-pre-wrap">
          {turn.isPlayer ? (
            <p className="text-cyan-400">
              <span className="select-none">&gt; </span>{turn.playerAction}
            </p>
          ) : (
            <p className="text-green-400">{turn.scenario}</p>
          )}
        </div>
      ))}
      <div ref={endOfLogRef} />
    </div>
  );
};

export default StoryLog;
