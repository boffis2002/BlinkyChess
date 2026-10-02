import { useState } from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';

const COLOR_OPTIONS = ['White', 'Black'];

// The bottom rungs cap search depth on top of Skill Level — that's what
// actually makes the engine miss tactics; skill alone leaves it too sharp.
export const DEFAULT_DIFFICULTY_LABEL = 'Medium';

export const DIFFICULTY_OPTIONS = [
  { label: 'Beginner', skillLevel: 0, movetimeMs: 100, depth: 1 },
  { label: 'Easy', skillLevel: 0, movetimeMs: 200, depth: 2 },
  { label: 'Casual', skillLevel: 3, movetimeMs: 300, depth: 3 },
  { label: 'Medium', skillLevel: 8, movetimeMs: 500 },
  { label: 'Intermediate', skillLevel: 12, movetimeMs: 800 },
  { label: 'Hard', skillLevel: 16, movetimeMs: 1200 },
  { label: 'Expert', skillLevel: 19, movetimeMs: 1800 },
  { label: 'Master', skillLevel: 20, movetimeMs: 2500 },
];

export default function OfflineSetupPopup({ visible, onClose, onPlay }) {
  const [color, setColor] = useState(COLOR_OPTIONS[0]);
  const [difficulty, setDifficulty] = useState(
    DIFFICULTY_OPTIONS.find((o) => o.label === DEFAULT_DIFFICULTY_LABEL)
  );

  function handlePlay() {
    onPlay({ color: color === 'White' ? 'white' : 'black', difficulty });
  }

  return (
    <Modal open={visible} onClose={onClose} title="Play vs Computer">
      <div className="match-options-row">
        {COLOR_OPTIONS.map((option) => (
          <Button key={option} variant={option === color ? 'primary' : 'secondary'} onClick={() => setColor(option)}>
            {option}
          </Button>
        ))}
      </div>
      <div className="match-options-row">
        {DIFFICULTY_OPTIONS.map((option) => (
          <Button
            key={option.label}
            variant={option.label === difficulty.label ? 'primary' : 'secondary'}
            onClick={() => setDifficulty(option)}
          >
            {option.label}
          </Button>
        ))}
      </div>
      <Button variant="primary" className="match-options-play" onClick={handlePlay}>
        Play
      </Button>
    </Modal>
  );
}
