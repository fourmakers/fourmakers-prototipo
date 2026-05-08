import { useState } from 'react';
import { Settings, Pencil } from 'lucide-react';
import { CardConfig } from '@/data/mockData';

interface FixedCardsProps {
  cards: (CardConfig | null)[];
  onEdit: (index: number) => void;
  onCardClick: (index: number) => void;
  activeCardIndex: number | null;
}

export function FixedCards({ cards, onEdit, onCardClick, activeCardIndex }: FixedCardsProps) {
  return (
    <div className="grid grid-cols-5 gap-3">
      {cards.map((card, i) => (
        <FixedCard key={i} index={i} card={card} onEdit={onEdit} onCardClick={onCardClick} isActive={activeCardIndex === i} />
      ))}
    </div>
  );
}

function FixedCard({
  index,
  card,
  onEdit,
  onCardClick,
  isActive,
}: {
  index: number;
  card: CardConfig | null;
  onEdit: (i: number) => void;
  onCardClick: (i: number) => void;
  isActive: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative flex flex-col rounded-xl border transition-all duration-200 min-h-[100px] cursor-pointer
        ${card
          ? `bg-surface-elevated border-border hover:border-primary/40 hover:shadow-card-hover ${isActive ? 'ring-2 ring-primary border-primary/50' : ''}`
          : 'bg-muted border-border border-dashed hover:border-primary/40'
        }`}
      onClick={() => card ? onCardClick(index) : onEdit(index)}
    >
      {/* Edit icon — only for populated cards */}
      {card && (
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(index); }}
          className={`absolute top-2 right-2 flex items-center justify-center w-6 h-6 rounded-md transition-all duration-150
            ${hovered ? 'text-primary bg-primary/15 opacity-100' : 'text-muted-foreground opacity-50'}
          `}
        >
          <Pencil size={12} />
        </button>
      )}

      <div className="flex flex-col gap-1 p-3 pt-3 flex-1">
        {card ? (
          <>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pr-6 leading-tight">
              {card.name}
            </p>
            <div className="flex flex-wrap gap-1 mt-1">
              {card.items.slice(0, 4).map((item) => (
                <span
                  key={item}
                  className="text-[10px] bg-primary/10 text-primary border border-primary/20 rounded-md px-1.5 py-0.5 font-medium"
                >
                  {item}
                </span>
              ))}
              {card.items.length > 4 && (
                <span className="text-[10px] text-muted-foreground px-1">
                  +{card.items.length - 4}
                </span>
              )}
            </div>
            <div className="mt-auto pt-2 flex items-center gap-1">
              <span className={`text-[10px] rounded-full px-1.5 py-0.5 font-medium border
                ${card.sharing === 'publico'
                  ? 'text-success border-success/30 bg-success/10'
                  : 'text-muted-foreground border-border'
                }`}>
                {card.sharing === 'publico' ? 'Público' : 'Privado'}
              </span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 gap-1.5 py-2">
            <Settings size={18} className="text-muted-foreground opacity-40" />
            <p className="text-[11px] text-muted-foreground text-center leading-tight opacity-60">
              Card vazio<br />Clique para configurar
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
