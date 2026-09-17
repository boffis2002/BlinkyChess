import { useState } from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';

const TIME_OPTIONS = ['5 Minutes', '10 Minutes', '30 Minutes'];
const RANKED_OPTIONS = ['Ranked', 'Unranked'];

export default function MatchOptionsPopup({ visible, onClose, onPlay }) {
  const [time, setTime] = useState(TIME_OPTIONS[0]);
  const [ranked, setRanked] = useState(RANKED_OPTIONS[0]);

  function handlePlay() {
    const seconds = parseInt(time, 10) * 60;
    onPlay({ time: seconds, ranked: ranked === 'Ranked' });
  }

  return (
    <Modal open={visible} onClose={onClose} title="Match options">
      <div className="match-options-row">
        {TIME_OPTIONS.map((option) => (
          <Button
            key={option}
            variant={option === time ? 'primary' : 'secondary'}
            onClick={() => setTime(option)}
          >
            {option}
          </Button>
        ))}
      </div>
      <div className="match-options-row">
        {RANKED_OPTIONS.map((option) => (
          <Button
            key={option}
            variant={option === ranked ? 'primary' : 'secondary'}
            onClick={() => setRanked(option)}
          >
            {option}
          </Button>
        ))}
      </div>
      <Button variant="primary" className="match-options-play" onClick={handlePlay}>
        Play
      </Button>
    </Modal>
  );
}
