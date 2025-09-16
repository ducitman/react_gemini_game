
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StoryTurn } from './types';
import { startNewGame, generateNextTurn } from './services/geminiService';
import StoryLog from './components/StoryLog';
import UserInput from './components/UserInput';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const [storyTurns, setStoryTurns] = useState<StoryTurn[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const initializeGame = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const firstScenario = await startNewGame();
      setStoryTurns([{ id: Date.now(), scenario: firstScenario, isPlayer: false }]);
    } catch (e) {
      setError("Failed to start the adventure. Please try refreshing the page.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleActionSubmit = async (action: string) => {
    if (!action.trim() || isLoading) return;

    const newPlayerTurn: StoryTurn = {
      id: Date.now(),
      playerAction: action,
      scenario: '',
      isPlayer: true,
    };

    const currentHistory = [...storyTurns, newPlayerTurn];
    setStoryTurns(currentHistory);
    setIsLoading(true);
    setError(null);

    try {
      const nextScenario = await generateNextTurn(storyTurns, action);
      const newGmTurn: StoryTurn = {
        id: Date.now() + 1,
        scenario: nextScenario,
        isPlayer: false,
      };
      setStoryTurns(prevTurns => [...prevTurns, newGmTurn]);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(`The story could not continue. ${errorMessage}`);
      // Optionally remove the player's failed action
      setStoryTurns(prevTurns => prevTurns.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-black text-green-400 min-h-screen p-4 sm:p-6 md:p-8 flex flex-col items-center font-mono">
      <header className="w-full max-w-4xl mb-4 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-shadow-green tracking-widest">
          GEMINI ADVENTURE
        </h1>
        <p className="text-green-600">A new world generated with every command</p>
      </header>
      
      <main className="w-full max-w-4xl flex-grow flex flex-col bg-gray-900/50 border-2 border-green-700 rounded-lg shadow-2xl shadow-green-500/10 p-4">
        <StoryLog storyTurns={storyTurns} />

        {isLoading && <LoadingSpinner />}
        
        {error && <p className="text-red-500 my-2 text-center">{error}</p>}
        
        <div className="mt-auto pt-4">
          <UserInput onSubmit={handleActionSubmit} disabled={isLoading} />
        </div>
      </main>
      
      <footer className="w-full max-w-4xl mt-4 text-center text-green-700 text-sm">
        <p>This adventure is dynamically generated and may be unpredictable. Your fate is your own.</p>
      </footer>
    </div>
  );
};

export default App;
