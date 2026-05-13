import { useState, useEffect } from 'react';
import './styles.css';

interface Bet {
  id: string;
  amount: number;
  timestamp: Date;
  status: 'active' | 'won' | 'lost';
}

interface PoolStats {
  totalPool: number;
  totalBettors: number;
  winnersCount: number;
  yourPotentialWin: number;
}

function App() {
  const [currentSteps, setCurrentSteps] = useState(4283);
  const [dailyGoal] = useState(10000);
  const [balance, setBalance] = useState(127.50);
  const [betAmount, setBetAmount] = useState('');
  const [activeBet, setActiveBet] = useState<Bet | null>(null);
  const [showBetModal, setShowBetModal] = useState(false);
  const [poolStats, setPoolStats] = useState<PoolStats>({
    totalPool: 2847.50,
    totalBettors: 47,
    winnersCount: 23,
    yourPotentialWin: 0
  });
  const [timeRemaining, setTimeRemaining] = useState({ hours: 8, minutes: 42, seconds: 31 });
  const [betHistory] = useState<Bet[]>([
    { id: '1', amount: 25, timestamp: new Date(Date.now() - 86400000), status: 'won' },
    { id: '2', amount: 15, timestamp: new Date(Date.now() - 172800000), status: 'won' },
    { id: '3', amount: 20, timestamp: new Date(Date.now() - 259200000), status: 'lost' },
  ]);

  const progress = (currentSteps / dailyGoal) * 100;
  const stepsRemaining = Math.max(0, dailyGoal - currentSteps);

  // Simulate step counter
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSteps(prev => Math.min(prev + Math.floor(Math.random() * 15), dailyGoal));
    }, 3000);
    return () => clearInterval(interval);
  }, [dailyGoal]);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update potential winnings
  useEffect(() => {
    if (activeBet) {
      const share = poolStats.totalPool / (poolStats.winnersCount + 1);
      setPoolStats(prev => ({ ...prev, yourPotentialWin: share }));
    }
  }, [activeBet, poolStats.totalPool, poolStats.winnersCount]);

  const handlePlaceBet = () => {
    const amount = parseFloat(betAmount);
    if (amount > 0 && amount <= balance) {
      setActiveBet({
        id: Date.now().toString(),
        amount,
        timestamp: new Date(),
        status: 'active'
      });
      setBalance(prev => prev - amount);
      setPoolStats(prev => ({
        ...prev,
        totalPool: prev.totalPool + amount,
        totalBettors: prev.totalBettors + 1
      }));
      setBetAmount('');
      setShowBetModal(false);
    }
  };

  const formatTime = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="app-container">
      <div className="noise-overlay" />

      {/* Header */}
      <header className="header">
        <div className="logo">
          <span className="logo-icon">$</span>
          <span className="logo-text">STEPSTAKES</span>
        </div>
        <div className="balance-display">
          <span className="balance-label">Balance</span>
          <span className="balance-amount">${balance.toFixed(2)}</span>
        </div>
      </header>

      {/* Main Progress Section */}
      <main className="main-content">
        <section className="progress-section">
          <div className="time-remaining">
            <span className="time-label">TIME REMAINING</span>
            <div className="time-digits">
              <span className="time-unit">{formatTime(timeRemaining.hours)}</span>
              <span className="time-separator">:</span>
              <span className="time-unit">{formatTime(timeRemaining.minutes)}</span>
              <span className="time-separator">:</span>
              <span className="time-unit">{formatTime(timeRemaining.seconds)}</span>
            </div>
          </div>

          <div className="progress-ring-container">
            <svg className="progress-ring" viewBox="0 0 200 200">
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00ff87" />
                  <stop offset="100%" stopColor="#00cc6a" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <circle
                className="progress-ring-bg"
                cx="100"
                cy="100"
                r="85"
                fill="none"
                stroke="#1a1a1f"
                strokeWidth="12"
              />
              <circle
                className="progress-ring-fill"
                cx="100"
                cy="100"
                r="85"
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${progress * 5.34} 534`}
                transform="rotate(-90 100 100)"
                filter="url(#glow)"
              />
            </svg>
            <div className="progress-inner">
              <span className="steps-current">{currentSteps.toLocaleString()}</span>
              <span className="steps-divider">/</span>
              <span className="steps-goal">{dailyGoal.toLocaleString()}</span>
              <span className="steps-label">STEPS</span>
            </div>
          </div>

          <div className="steps-remaining">
            <span className="remaining-value">{stepsRemaining.toLocaleString()}</span>
            <span className="remaining-label">steps to go</span>
          </div>
        </section>

        {/* Pool Stats */}
        <section className="pool-section">
          <div className="pool-header">
            <h2 className="pool-title">TODAY'S POT</h2>
            <div className="pool-amount">${poolStats.totalPool.toFixed(2)}</div>
          </div>

          <div className="pool-stats-grid">
            <div className="pool-stat">
              <span className="stat-value">{poolStats.totalBettors}</span>
              <span className="stat-label">Players</span>
            </div>
            <div className="pool-stat">
              <span className="stat-value">{poolStats.winnersCount}</span>
              <span className="stat-label">On Track</span>
            </div>
            <div className="pool-stat">
              <span className="stat-value">{poolStats.totalBettors - poolStats.winnersCount}</span>
              <span className="stat-label">Failing</span>
            </div>
          </div>

          {activeBet ? (
            <div className="active-bet-card">
              <div className="bet-status">
                <span className="bet-status-dot" />
                <span>YOUR BET IS ACTIVE</span>
              </div>
              <div className="bet-details">
                <div className="bet-stake">
                  <span className="bet-stake-label">At Stake</span>
                  <span className="bet-stake-amount">${activeBet.amount.toFixed(2)}</span>
                </div>
                <div className="bet-potential">
                  <span className="bet-potential-label">Potential Win</span>
                  <span className="bet-potential-amount">${poolStats.yourPotentialWin.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ) : (
            <button className="place-bet-btn" onClick={() => setShowBetModal(true)}>
              <span className="bet-btn-icon">$</span>
              <span>PLACE YOUR BET</span>
            </button>
          )}
        </section>

        {/* Bet History */}
        <section className="history-section">
          <h3 className="history-title">RECENT BETS</h3>
          <div className="history-list">
            {betHistory.map(bet => (
              <div key={bet.id} className={`history-item history-item-${bet.status}`}>
                <div className="history-status">
                  <span className={`status-indicator status-${bet.status}`} />
                  <span className="status-text">{bet.status.toUpperCase()}</span>
                </div>
                <span className="history-amount">
                  {bet.status === 'won' ? '+' : '-'}${bet.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Bet Modal */}
      {showBetModal && (
        <div className="modal-overlay" onClick={() => setShowBetModal(false)}>
          <div className="bet-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowBetModal(false)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            <h2 className="modal-title">PLACE YOUR BET</h2>
            <p className="modal-subtitle">
              Hit 10,000 steps today or lose your stake
            </p>

            <div className="bet-input-container">
              <span className="bet-input-prefix">$</span>
              <input
                type="number"
                inputMode="decimal"
                className="bet-input"
                placeholder="0.00"
                value={betAmount}
                onChange={e => setBetAmount(e.target.value)}
                min="0"
                max={balance}
                step="0.01"
              />
            </div>

            <div className="quick-amounts">
              {[5, 10, 25, 50].map(amount => (
                <button
                  key={amount}
                  className="quick-amount-btn"
                  onClick={() => setBetAmount(amount.toString())}
                  disabled={amount > balance}
                >
                  ${amount}
                </button>
              ))}
            </div>

            <div className="modal-info">
              <div className="info-row">
                <span>Available Balance</span>
                <span>${balance.toFixed(2)}</span>
              </div>
              <div className="info-row">
                <span>Current Pool</span>
                <span>${poolStats.totalPool.toFixed(2)}</span>
              </div>
            </div>

            <button
              className="confirm-bet-btn"
              onClick={handlePlaceBet}
              disabled={!betAmount || parseFloat(betAmount) <= 0 || parseFloat(betAmount) > balance}
            >
              LOCK IN BET
            </button>

            <p className="modal-disclaimer">
              Winners split the pool equally. No refunds.
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        Requested by <a href="https://twitter.com/T1000_V2" target="_blank" rel="noopener noreferrer">@T1000_V2</a> · Built by <a href="https://twitter.com/clonkbot" target="_blank" rel="noopener noreferrer">@clonkbot</a>
      </footer>
    </div>
  );
}

export default App;
