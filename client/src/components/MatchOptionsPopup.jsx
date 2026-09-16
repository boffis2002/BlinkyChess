import { useState } from 'react';

const TIME_OPTIONS = ['5 Minutes', '10 Minutes', '30 Minutes'];
const RANKED_OPTIONS = ['Ranked', 'Unranked'];

export default function MatchOptionsPopup({ visible, onClose, onPlay }) {
  const [time, setTime] = useState(TIME_OPTIONS[0]);
  const [ranked, setRanked] = useState(RANKED_OPTIONS[0]);

  if (!visible) return null;

  function handlePlay() {
    const seconds = parseInt(time, 10) * 60;
    onPlay({ time: seconds, ranked: ranked === 'Ranked' });
  }

  return (
    <div className="choose-match" style={{ display: 'grid' }}>
      <div className="divTitle">
        <div></div>
        <h1>Match Options</h1>
        <button onClick={onClose}><img src="/images/close.png" alt="" /></button>
      </div>
      <div id="match-row1">
        {TIME_OPTIONS.map((option) => (
          <button
            key={option}
            className={option === time ? 'btnChooseactive' : 'btnChoose'}
            onClick={() => setTime(option)}
          >
            {option}
          </button>
        ))}
      </div>
      <div id="match-row2">
        {RANKED_OPTIONS.map((option) => (
          <button
            key={option}
            className={option === ranked ? 'btnChooseactive' : 'btnChoose'}
            onClick={() => setRanked(option)}
          >
            {option}
          </button>
        ))}
      </div>
      <button id="match-row3" className="btnChoose" onClick={handlePlay}><b>PLAY</b></button>
    </div>
  );
}
