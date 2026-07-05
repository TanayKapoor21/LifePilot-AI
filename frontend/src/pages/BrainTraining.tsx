import React, { useState, useEffect } from 'react';
import { useLifePilotStore } from '../store/store';
import { Brain, Play, CheckCircle2, RotateCcw, Award, Zap, Clock, ShieldAlert } from 'lucide-react';

export const BrainTraining: React.FC = () => {
  const { submitGameScore } = useLifePilotStore();
  const [activeGame, setActiveGame] = useState<string | null>(null);
  
  // Game metrics logs
  const [scoreLog, setScoreLog] = useState<any>(null);

  // ==========================================
  // GAME 1: MEMORY MATRIX STATES & LOGIC
  // ==========================================
  const [gridSize, setGridSize] = useState(3); // 3x3 initially
  const [matrixTargets, setMatrixTargets] = useState<number[]>([]);
  const [userSelections, setUserSelections] = useState<number[]>([]);
  const [matrixState, setMatrixState] = useState<'idle' | 'flashing' | 'playing' | 'success' | 'fail'>('idle');

  const startMemoryMatrix = () => {
    setUserSelections([]);
    setMatrixState('flashing');
    
    // Choose random squares based on size
    const targetCount = gridSize + 1;
    const targets: number[] = [];
    const maxIndex = gridSize * gridSize;
    
    while (targets.length < targetCount) {
      const idx = Math.floor(Math.random() * maxIndex);
      if (!targets.includes(idx)) targets.push(idx);
    }
    setMatrixTargets(targets);

    // Flash for 1.5 seconds, then set to playing
    setTimeout(() => {
      setMatrixState('playing');
    }, 1500);
  };

  const handleCellClick = (idx: number) => {
    if (matrixState !== 'playing') return;
    if (userSelections.includes(idx)) return;

    const selections = [...userSelections, idx];
    setUserSelections(selections);

    // Check if clicked cell is a target
    if (!matrixTargets.includes(idx)) {
      setMatrixState('fail');
      logResult('Memory Matrix', 0, 800, 0); // Fail
      return;
    }

    // Check if completed all targets
    if (selections.length === matrixTargets.length) {
      setMatrixState('success');
      // Calculate score based on gridSize
      const finalScore = gridSize * 120;
      logResult('Memory Matrix', 100, 350, finalScore);
      // Advance difficulty
      if (gridSize < 5) setGridSize(gridSize + 1);
    }
  };

  // ==========================================
  // GAME 2: REACTION TEST STATES & LOGIC
  // ==========================================
  const [reactionState, setReactionState] = useState<'idle' | 'waiting' | 'ready' | 'result' | 'fail'>('idle');
  const [startTime, setStartTime] = useState<number>(0);
  const [reactionTime, setReactionTime] = useState<number>(0);

  const startReactionTest = () => {
    setReactionState('waiting');
    // Change color after random delay
    const delay = 1500 + Math.random() * 3000;
    setTimeout(() => {
      // Prevent running if user clicked too early
      setReactionState((curr) => {
        if (curr === 'waiting') {
          setStartTime(Date.now());
          return 'ready';
        }
        return curr;
      });
    }, delay);
  };

  const handleReactionClick = () => {
    if (reactionState === 'waiting') {
      setReactionState('fail');
    } else if (reactionState === 'ready') {
      const delta = Date.now() - startTime;
      setReactionTime(delta);
      setReactionState('result');
      // Score: 1000 - reactionTime, capped at 1000 and min 50
      const score = Math.max(50, Math.min(1000, 1000 - delta));
      logResult('Reaction Test', 100, delta, score);
    }
  };

  // ==========================================
  // GAME 3: COLOR STROOP TEST STATES & LOGIC
  // ==========================================
  const [stroopWord, setStroopWord] = useState('');
  const [stroopColor, setStroopColor] = useState('');
  const [stroopCorrect, setStroopCorrect] = useState<boolean>(true);
  const [stroopScore, setStroopScore] = useState(0);
  const [stroopRound, setStroopRound] = useState(0);
  const [stroopState, setStroopState] = useState<'idle' | 'playing' | 'result'>('idle');

  const colorNames = ['Red', 'Blue', 'Green', 'Yellow', 'Purple'];
  const colorHexes = {
    'Red': 'text-red-500',
    'Blue': 'text-blue-500',
    'Green': 'text-emerald-500',
    'Yellow': 'text-yellow-500',
    'Purple': 'text-purple-500'
  };

  const startStroopRound = () => {
    const word = colorNames[Math.floor(Math.random() * colorNames.length)];
    // 50% chance color matches word name
    const match = Math.random() > 0.5;
    let color = word;
    if (!match) {
      const filtered = colorNames.filter(c => c !== word);
      color = filtered[Math.floor(Math.random() * filtered.length)];
    }
    
    setStroopWord(word);
    setStroopColor(color);
    setStroopCorrect(match);
    setStroopState('playing');
  };

  const handleStroopAnswer = (answer: boolean) => {
    const isCorrect = answer === stroopCorrect;
    
    if (isCorrect) {
      setStroopScore(prev => prev + 100);
    }
    
    const nextRound = stroopRound + 1;
    setStroopRound(nextRound);

    if (nextRound >= 5) {
      setStroopState('result');
      const finalAccuracy = (isCorrect ? (stroopScore + 100) : stroopScore) / 500 * 100;
      logResult('Color Stroop Test', finalAccuracy, 420, stroopScore + (isCorrect ? 100 : 0));
    } else {
      startStroopRound();
    }
  };

  // ==========================================
  // COMMON GAME COMPLETION LOGGER
  // ==========================================
  const logResult = async (gameName: string, accuracy: number, reaction: number, score: number) => {
    const result = await submitGameScore({
      game_name: gameName,
      accuracy,
      reaction_time_ms: reaction,
      score
    });
    if (result) {
      setScoreLog(result);
    }
  };

  const closeGame = () => {
    setActiveGame(null);
    setScoreLog(null);
    setGridSize(3);
    setReactionState('idle');
    setStroopRound(0);
    setStroopScore(0);
    setStroopState('idle');
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Cognitive Gym</h1>
        <p className="text-zinc-500 text-xs mt-1">Neuro-adaptive training games and reaction telemetry</p>
      </div>

      {/* Main viewport area */}
      {!activeGame ? (
        // Game lists
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-3xl glass-panel border-zinc-800/80 flex flex-col justify-between h-[240px]">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-zinc-200">Memory Matrix</h3>
              <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">
                Memorize flashed cells on a expanding layout. Tests spatial indexing and working visual memory.
              </p>
            </div>
            <button 
              onClick={() => { setActiveGame('matrix'); startMemoryMatrix(); }}
              className="w-full py-2 bg-zinc-900 border border-zinc-850 hover:border-zinc-700 hover:text-white rounded-xl text-xs font-semibold transition"
            >
              Train Memory Matrix
            </button>
          </div>

          <div className="p-6 rounded-3xl glass-panel border-zinc-800/80 flex flex-col justify-between h-[240px]">
            <div>
              <div className="w-10 h-10 rounded-xl bg-teal-600/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-zinc-200">Reaction Test</h3>
              <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">
                Click as fast as possible when the display flashes green. Measures neurotransmitter velocity latency.
              </p>
            </div>
            <button 
              onClick={() => { setActiveGame('reaction'); setReactionState('idle'); }}
              className="w-full py-2 bg-zinc-900 border border-zinc-850 hover:border-zinc-700 hover:text-white rounded-xl text-xs font-semibold transition"
            >
              Train Reaction Latency
            </button>
          </div>

          <div className="p-6 rounded-3xl glass-panel border-zinc-800/80 flex flex-col justify-between h-[240px]">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-zinc-200">Color Stroop Test</h3>
              <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">
                Choose if color names match the semantic ink representation. Tests semantic cognitive flexibility.
              </p>
            </div>
            <button 
              onClick={() => { setActiveGame('stroop'); setStroopRound(0); setStroopScore(0); startStroopRound(); }}
              className="w-full py-2 bg-zinc-900 border border-zinc-850 hover:border-zinc-700 hover:text-white rounded-xl text-xs font-semibold transition"
            >
              Train Stroop Interference
            </button>
          </div>

        </div>
      ) : (
        // Game active viewport container
        <div className="rounded-3xl glass-panel p-8 border border-zinc-800/80 flex flex-col items-center justify-center min-h-[450px] relative">
          
          {/* Back button */}
          <button 
            onClick={closeGame}
            className="absolute top-4 right-4 text-zinc-500 hover:text-white text-xs font-mono"
          >
            QUIT TRAINING [ESC]
          </button>

          {/* ==========================================
              GAME VIEW 1: MEMORY MATRIX
              ========================================== */}
          {activeGame === 'matrix' && (
            <div className="flex flex-col items-center space-y-6">
              <div className="text-center">
                <h3 className="font-bold text-sm">Memory Matrix — {gridSize}x{gridSize} Layout</h3>
                <p className="text-[10px] text-zinc-500 mt-0.5">
                  {matrixState === 'flashing' ? 'Memorizing flashing tiles...' : 'Tap the active squares!'}
                </p>
              </div>

              {/* Grid drawing */}
              <div 
                className="grid gap-2 p-4 bg-zinc-950/60 border border-zinc-850 rounded-2xl"
                style={{ 
                  gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                  width: '240px',
                  height: '240px'
                }}
              >
                {Array.from({ length: gridSize * gridSize }).map((_, idx) => {
                  const isTarget = matrixTargets.includes(idx);
                  const isSelected = userSelections.includes(idx);
                  const showFlash = matrixState === 'flashing' && isTarget;
                  const showSuccess = matrixState === 'success' && isTarget;
                  const showFail = matrixState === 'fail' && isTarget;
                  
                  return (
                    <div
                      key={idx}
                      onClick={() => handleCellClick(idx)}
                      className={`game-grid-item rounded-lg cursor-pointer border ${
                        showFlash ? 'bg-blue-500 border-blue-400 scale-[1.03]' :
                        showSuccess ? 'bg-emerald-500 border-emerald-400' :
                        showFail ? 'bg-red-500 border-red-400' :
                        isSelected ? 'bg-zinc-800 border-zinc-700' :
                        'bg-zinc-900 border-zinc-900 hover:bg-zinc-800/50'
                      }`}
                    />
                  );
                })}
              </div>

              {/* Reset/Control */}
              {(matrixState === 'success' || matrixState === 'fail') && (
                <button 
                  onClick={startMemoryMatrix}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{matrixState === 'success' ? 'Next Round' : 'Retry'}</span>
                </button>
              )}
            </div>
          )}

          {/* ==========================================
              GAME VIEW 2: REACTION TEST
              ========================================== */}
          {activeGame === 'reaction' && (
            <div 
              onClick={handleReactionClick}
              className={`w-full max-w-lg h-72 rounded-3xl border flex flex-col items-center justify-center cursor-pointer select-none transition-all duration-300 ${
                reactionState === 'idle' ? 'bg-zinc-900 border-zinc-850 hover:border-zinc-800' :
                reactionState === 'waiting' ? 'bg-red-500/10 border-red-500/20' :
                reactionState === 'ready' ? 'bg-emerald-500 border-emerald-400 scale-[1.01] shadow-2xl shadow-emerald-500/20' :
                reactionState === 'result' ? 'bg-blue-600/10 border-blue-500/20' :
                'bg-zinc-950 border-red-600/30'
              }`}
            >
              {reactionState === 'idle' && (
                <div className="text-center space-y-2">
                  <Play className="w-8 h-8 text-blue-500 mx-auto animate-pulse" />
                  <h3 className="font-bold text-sm">Test reaction time</h3>
                  <p className="text-[10px] text-zinc-500">Tap anywhere to initialize. Wait for GREEN flash.</p>
                </div>
              )}
              {reactionState === 'waiting' && (
                <div className="text-center space-y-1">
                  <h3 className="font-bold text-sm text-red-400 animate-pulse">WAIT FOR GREEN...</h3>
                  <p className="text-[9px] text-zinc-500">Tap before green causes failure</p>
                </div>
              )}
              {reactionState === 'ready' && (
                <div className="text-center space-y-1">
                  <h3 className="font-extrabold text-xl text-black select-none">TAP NOW!</h3>
                </div>
              )}
              {reactionState === 'result' && (
                <div className="text-center space-y-3">
                  <CheckCircle2 className="w-8 h-8 text-blue-400 mx-auto" />
                  <h3 className="font-bold text-2xl font-mono text-zinc-200">{reactionTime} ms</h3>
                  <p className="text-[10px] text-zinc-500">Tap anywhere to restart.</p>
                </div>
              )}
              {reactionState === 'fail' && (
                <div className="text-center space-y-3">
                  <ShieldAlert className="w-8 h-8 text-red-500 mx-auto animate-bounce" />
                  <h3 className="font-bold text-sm text-red-400">TRIGGERED TOO EARLY</h3>
                  <p className="text-[10px] text-zinc-500">Tap anywhere to restart.</p>
                </div>
              )}
            </div>
          )}

          {/* ==========================================
              GAME VIEW 3: COLOR STROOP TEST
              ========================================== */}
          {activeGame === 'stroop' && (
            <div className="flex flex-col items-center space-y-8 w-full max-w-md">
              <div className="text-center">
                <span className="text-[10px] font-mono text-zinc-500 uppercase">ROUND {stroopRound}/5 • SCORE: {stroopScore}</span>
              </div>

              {stroopState === 'playing' && (
                <div className="flex flex-col items-center space-y-6">
                  {/* Display Flash word */}
                  <h2 className={`text-5xl font-black tracking-wide ${colorHexes[stroopColor as keyof typeof colorHexes]}`}>
                    {stroopWord.toUpperCase()}
                  </h2>
                  <p className="text-[10px] text-zinc-500">Does the printed ink color match the word spelling name?</p>

                  <div className="flex space-x-4 w-full">
                    <button
                      onClick={() => handleStroopAnswer(true)}
                      className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold transition text-xs"
                    >
                      Yes, Matches
                    </button>
                    <button
                      onClick={() => handleStroopAnswer(false)}
                      className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-bold transition text-xs"
                    >
                      No, Different
                    </button>
                  </div>
                </div>
              )}

              {stroopState === 'result' && (
                <div className="text-center space-y-4">
                  <Award className="w-10 h-10 text-purple-400 mx-auto" />
                  <h3 className="font-bold text-lg">Stroop Round Complete</h3>
                  <p className="text-xs text-zinc-400">Total Score: {stroopScore}/500</p>
                  <button 
                    onClick={() => { setStroopRound(0); setStroopScore(0); startStroopRound(); }}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold"
                  >
                    Play Again
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Gamification feedback display */}
          {scoreLog && (
            <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 text-xs font-mono rounded-2xl w-full max-w-sm flex items-center justify-between text-zinc-300 animate-slide-up">
              <div>
                <span className="font-bold text-blue-400 block mb-1">🎮 SCORE TELEMETRY SYNCED</span>
                <span>XP earned: +{scoreLog.xp_earned} XP</span>
              </div>
              <div className="text-right">
                <span className="block font-bold text-amber-400">🪙 +{scoreLog.coins_earned} GP</span>
                {scoreLog.level_up && <span className="text-[10px] text-teal-400 font-bold animate-bounce">LEVEL UP!</span>}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
export default BrainTraining;
