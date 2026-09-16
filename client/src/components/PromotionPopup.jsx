export default function PromotionPopup({ visible, onSelect }) {
  if (!visible) return null;

  return (
    <div className="popup2" style={{ display: 'block', position: 'fixed', backgroundColor: 'rgba(0,0,0,0.8)' }}>
      <div id="popup-message2">
        <label htmlFor="promotion">Choose what the pawn becomes: </label>
        <select
          id="promotion"
          defaultValue="s"
          onChange={(e) => {
            if (e.target.value !== 's') onSelect(e.target.value);
          }}
        >
          <option value="s">Select a piece</option>
          <option value="q">Queen</option>
          <option value="r">Rook</option>
          <option value="b">Bishop</option>
          <option value="n">Knight</option>
        </select>
      </div>
    </div>
  );
}
