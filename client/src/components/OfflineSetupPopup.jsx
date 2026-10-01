import { useState } from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';

const COLOR_OPTIONS = ['White', 'Black'];

export const DIFFICULTY_OPTIONS = [
  { label: 'Easy', skillLevel: 2, movetimeMs: 300 },
  { label: 'Medium', skillLevel: 10, movetimeMs: 700 },
  { label: 'Hard', skillLevel: 20, movetimeMs: 1500 },
];

export default function OfflineSetupPopup({ visible, onClose, onPlay }) {
  const [color, setColor] = useState(COLOR_OPTIONS[0]);
  const [difficulty, setDifficulty] = useState(DIFFICULTY_OPTIONS[1]);

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
