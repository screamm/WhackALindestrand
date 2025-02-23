import React from 'react';
import alicia from './assets/alicia.png';
import alicia2 from './assets/alicia2.png';
import alexander from './assets/alexander.png';
import alexander2 from './assets/alexander2.png';

interface HighScore {
  name: string;
  score: number;
}

type IntervalType = ReturnType<typeof setInterval>;

const WhackAMole: React.FC = () => {
  const [playerName, setPlayerName] = React.useState<string>('');
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
  const [score, setScore] = React.useState<number>(0);
  const [timeLeft, setTimeLeft] = React.useState<number>(30);
  const [activeMole, setActiveMole] = React.useState<number>(-1);
  const [isAlicia, setIsAlicia] = React.useState<boolean>(true);
  const [hitState, setHitState] = React.useState<boolean>(false);
  const [highScores, setHighScores] = React.useState<HighScore[]>([]);
  const [showNameDialog, setShowNameDialog] = React.useState<boolean>(true);
  const [gameOver, setGameOver] = React.useState<boolean>(false);

  const MOLE_COUNT = 9;
  const GAME_DURATION = 30;
  const HIT_DISPLAY_DURATION = 1000;

  React.useEffect(() => {
    const savedScores = localStorage.getItem('whackAMoleHighScores');
    if (savedScores) {
      setHighScores(JSON.parse(savedScores));
    }
  }, []);

  const updateHighScores = React.useCallback((newScore: number) => {
    const newHighScores = [...highScores, { name: playerName, score: newScore }]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    
    setHighScores(newHighScores);
    localStorage.setItem('whackAMoleHighScores', JSON.stringify(newHighScores));
  }, [highScores, playerName]);

  const startGame = (): void => {
    if (!playerName.trim()) return;
    
    setShowNameDialog(false);
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setGameOver(false);
    setActiveMole(-1);
  };

  React.useEffect(() => {
    let timerInterval: IntervalType;
    let moleInterval: IntervalType;

    if (isPlaying) {
      timerInterval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsPlaying(false);
            setGameOver(true);
            setActiveMole(-1); // Dölj sista bilden
            updateHighScores(score);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      moleInterval = setInterval(() => {
        setActiveMole(Math.floor(Math.random() * MOLE_COUNT));
        setIsAlicia(Math.random() > 0.5);
      }, 800);
    }

    return () => {
      clearInterval(timerInterval);
      clearInterval(moleInterval);
    };
  }, [isPlaying, score, updateHighScores]);

  const handleMoleHit = (index: number): void => {
    if (index === activeMole && isPlaying) {
      setScore((prev) => prev + 1);
      setHitState(true);
      
      setTimeout(() => {
        setHitState(false);
        setActiveMole(-1);
      }, HIT_DISPLAY_DURATION);
    }
  };

  const getMoleImage = (index: number): string | undefined => {
    if (index !== activeMole || gameOver) return undefined;
    
    if (hitState) {
      return isAlicia ? alicia2 : alexander2;
    }
    return isAlicia ? alicia : alexander;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPlayerName(e.target.value);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-4">
      {/* Name Dialog */}
      {showNameDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 max-w-full mx-4">
            <h2 className="text-2xl font-bold mb-4 text-slate-800">Ange ditt namn</h2>
            <input
              type="text"
              value={playerName}
              onChange={handleInputChange}
              placeholder="Skriv ditt namn här"
              className="w-full p-3 border border-slate-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              onClick={startGame}
              disabled={!playerName.trim()}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg font-medium disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              Starta Spelet
            </button>
          </div>
        </div>
      )}

      {/* Game Over Dialog */}
      {gameOver && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 max-w-full mx-4">
            <h2 className="text-2xl font-bold mb-4 text-slate-800">Spelet är slut!</h2>
            <p className="text-lg mb-4">Din poäng: {score}</p>
            
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3 text-slate-800">Topplista</h3>
              <div className="bg-slate-50 rounded-lg p-4 shadow-inner">
                {highScores.map((entry, index) => (
                  <div key={index} className="flex justify-between py-2 border-b last:border-0 border-slate-200">
                    <span className="font-medium">{index + 1}. {entry.name}</span>
                    <span className="font-bold text-slate-700">{entry.score}</span>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={startGame} 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg font-medium transition-colors"
            >
              Spela igen
            </button>
          </div>
        </div>
      )}

      {/* Game UI */}
      {!showNameDialog && !gameOver && (
        <>
          <div className="fixed top-0 left-0 right-0 bg-white shadow-md p-4 flex justify-center space-x-8 text-lg font-medium">
            <span>Poäng: {score}</span>
            <span>Tid kvar: {timeLeft}s</span>
          </div>

          <div className="grid grid-cols-3 gap-4 md:gap-6 mt-20">
            {Array.from({ length: MOLE_COUNT }).map((_, index) => (
              <button
                key={index}
                className={`w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-lg overflow-hidden shadow-lg transition-transform
                  ${activeMole === index ? 'scale-110' : 'bg-slate-200'} 
                  hover:brightness-95 active:scale-95`}
                onClick={() => handleMoleHit(index)}
                onTouchStart={(e) => {
                  e.preventDefault();
                  handleMoleHit(index);
                }}
              >
                {getMoleImage(index) && (
                  <img 
                    src={getMoleImage(index)} 
                    alt={isAlicia ? "Alicia" : "Alexander"}
                    className="w-full h-full object-cover"
                  />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default WhackAMole;