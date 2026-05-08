import { useState, useEffect } from 'react';
import { Trash2, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DEMOGRAPHIC_ITEMS, CardConfig } from '@/data/mockData';

interface CustomMapModalProps {
  open: boolean;
  onClose: () => void;
  editingCard: number | null;
  existingCards: (CardConfig | null)[];
  onSave: (config: CardConfig, cardIndex: number) => void;
  onClearCard: (index: number) => void;
  onApplyItems: (items: string[]) => void;
}

const SHARING_OPTIONS = [
  { value: 'privado', label: 'Privado' },
  { value: 'publico', label: 'Público' },
] as const;

export function CustomMapModal({
  open,
  onClose,
  editingCard,
  existingCards,
  onSave,
  onClearCard,
  onApplyItems,
}: CustomMapModalProps) {
  const [name, setName] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [sharing, setSharing] = useState<'privado' | 'publico'>('privado');
  const [saveToCard, setSaveToCard] = useState(true);
  const [targetCard, setTargetCard] = useState<number>(0);

  useEffect(() => {
    if (!open) return;
    if (editingCard !== null && existingCards[editingCard]) {
      const c = existingCards[editingCard]!;
      setName(c.name);
      setSelectedItems(c.items);
      setSharing(c.sharing === 'especifico' ? 'privado' : c.sharing as 'privado' | 'publico');
      setTargetCard(editingCard);
    } else {
      setName('');
      setSelectedItems([]);
      setSharing('privado');
      setTargetCard(editingCard ?? 0);
    }
    setSaveToCard(true);
  }, [open, editingCard, existingCards]);

  const toggleItem = (item: string) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  };

  const handleClear = () => {
    setName('');
    setSelectedItems([]);
    setSharing('privado');
  };

  const handleSave = () => {
    if (selectedItems.length === 0) return;

    if (!saveToCard) {
      onApplyItems(selectedItems);
      onClose();
      return;
    }

    if (!name.trim()) return;
    const config: CardConfig = {
      id: Date.now(),
      name: name.trim(),
      items: selectedItems,
      sharing,
    };
    onSave(config, targetCard);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>Mapa Personalizado</DialogTitle>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleClear}
              title="Limpar todos os campos"
              className="h-8 w-8 shrink-0 rounded-pillToken text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            Crie um mapa com itens demográficos. Escolha salvar em um card fixo ou apenas aplicar os itens.
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
        <div className="space-y-6">
          {/* Salvar no card */}
          <div className="space-y-4">
            <h4 className="font-medium">Salvar no card</h4>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <div
                onClick={() => setSaveToCard((p) => !p)}
                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors cursor-pointer
                  ${saveToCard ? 'bg-primary border-primary' : 'border-border bg-surface'}`}
              >
                {saveToCard && <Check size={10} className="text-primary-foreground" />}
              </div>
              <span className="text-sm text-foreground">Salvar personalizado no card fixo</span>
            </label>

            {saveToCard && (
              <div className="grid grid-cols-5 gap-2">
                {existingCards.map((card, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setTargetCard(i)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-xs transition-all
                      ${targetCard === i
                        ? 'bg-primary/15 border-primary text-primary'
                        : 'border-border bg-surface text-muted-foreground hover:border-primary/30'
                      }`}
                  >
                    <span className="font-semibold">#{i + 1}</span>
                    <span className="text-[10px] truncate w-full text-center">
                      {card ? card.name : 'Vazio'}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Título do Mapa */}
          <div className={`space-y-2 ${!saveToCard ? 'opacity-50' : ''}`}>
            <Label htmlFor="mapa-titulo">
              Título do Mapa <span className="text-muted-foreground font-normal">({name.length}/25)</span>
            </Label>
            <Input
              id="mapa-titulo"
              type="text"
              maxLength={25}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite o título do mapa..."
              disabled={!saveToCard}
              className="w-full"
            />
          </div>

          {/* Itens Demográficos */}
          <div className="space-y-4">
            <h4 className="font-medium">
              Itens Demográficos
              {selectedItems.length > 0 && (
                <span className="ml-1.5 bg-primary text-primary-foreground text-[10px] font-semibold rounded-full px-1.5 py-0.5">
                  {selectedItems.length}
                </span>
              )}
            </h4>
            <div className="max-h-48 overflow-y-auto rounded-lg border border-border bg-surface divide-y divide-border">
              {DEMOGRAPHIC_ITEMS.map((item) => {
                const checked = selectedItems.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleItem(item)}
                    className={`flex items-center gap-3 w-full px-3 py-2.5 text-sm text-left transition-colors
                      ${checked ? 'bg-primary/10 text-foreground' : 'text-foreground hover:bg-btnGhostHover'}`}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors
                      ${checked ? 'bg-primary border-primary' : 'border-border'}`}>
                      {checked && <Check size={10} className="text-primary-foreground" />}
                    </div>
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Compartilhar */}
          <div className="space-y-4">
            <h4 className="font-medium">Compartilhar</h4>
            <div className="flex gap-2">
              {SHARING_OPTIONS.map((opt) => (
                <Button
                  key={opt.value}
                  type="button"
                  variant={sharing === opt.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSharing(opt.value)}
                  className="flex-1 rounded-pillToken"
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
        </DialogBody>

        <DialogFooter className="flex-row flex-wrap gap-2 sm:justify-between">
          {editingCard !== null && existingCards[editingCard] && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => { onClearCard(editingCard); onClose(); }}
              className="text-muted-foreground hover:text-destructive mr-auto order-first w-full sm:w-auto"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1.5" />
              Limpar card
            </Button>
          )}
          <div className="flex gap-2 w-full sm:w-auto sm:ml-auto">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleSave}
              disabled={selectedItems.length === 0 || (saveToCard && !name.trim())}
            >
              Salvar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
