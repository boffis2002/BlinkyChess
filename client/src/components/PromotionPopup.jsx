import Modal from './ui/Modal';
import Button from './ui/Button';

const PIECES = [
  { value: 'q', label: 'Queen' },
  { value: 'r', label: 'Rook' },
  { value: 'b', label: 'Bishop' },
  { value: 'n', label: 'Knight' },
];

export default function PromotionPopup({ visible, onSelect }) {
  return (
    <Modal open={visible} title="Promote your pawn" closeOnBackdrop={false}>
      <div className="promotion-options">
        {PIECES.map((piece) => (
          <Button key={piece.value} variant="secondary" onClick={() => onSelect(piece.value)}>
            {piece.label}
          </Button>
        ))}
      </div>
    </Modal>
  );
}
