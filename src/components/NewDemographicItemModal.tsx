import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';

interface NewDemographicItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (data: { titulo: string; subtitulo: string; items: string[] }) => void;
}

export function NewDemographicItemModal({ open, onOpenChange, onSave }: NewDemographicItemModalProps) {
  const [titulo, setTitulo] = useState('');
  const [subtitulo, setSubtitulo] = useState('');
  const [items, setItems] = useState<string[]>(['']);
  const [attempted, setAttempted] = useState(false);
  const { toast } = useToast();

  const tituloValid = titulo.trim().length > 0;
  const hasValidItem = items.some(i => i.trim().length > 0);
  const canSave = tituloValid && hasValidItem;

  const reset = () => {
    setTitulo('');
    setSubtitulo('');
    setItems(['']);
    setAttempted(false);
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const handleAddItem = () => {
    setItems(prev => [...prev, '']);
  };

  const handleRemoveItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, value: string) => {
    setItems(prev => prev.map((item, i) => (i === index ? value : item)));
  };

  const handleSave = () => {
    setAttempted(true);
    if (!canSave) return;

    const cleanItems = items.filter(i => i.trim().length > 0);
    onSave?.({ titulo: titulo.trim(), subtitulo: subtitulo.trim(), items: cleanItems });

    toast({
      title: 'Item demográfico criado',
      description: `"${titulo.trim()}" salvo com ${cleanItems.length} ite${cleanItems.length === 1 ? 'm' : 'ns'}.`,
    });

    reset();
    onOpenChange(false);
  };

  // Preview
  const filledItems = items.filter(i => i.trim().length > 0);
  const showPreview = titulo.trim().length > 0 || subtitulo.trim().length > 0 || filledItems.length > 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="text-foreground text-base font-semibold">
            Item Demográfico
          </DialogTitle>
          <DialogDescription>
            Crie um novo grupo demográfico com título, subtítulo e itens.
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
        <div className="space-y-5">
          {/* Campo 1 — Título */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="titulo" className="text-foreground text-sm font-medium">
                Título <span className="text-destructive">*</span>
              </Label>
              <span className="text-muted-foreground text-[11px]">{titulo.length}/30</span>
            </div>
            <Input
              id="titulo"
              placeholder="Digite o título"
              maxLength={30}
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              className="bg-input border-border rounded-xl text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Campo 2 — Subtítulo */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="subtitulo" className="text-foreground text-sm font-medium">
                Subtítulo <span className="text-muted-foreground text-[11px] font-normal">(opcional)</span>
              </Label>
              <span className="text-muted-foreground text-[11px]">{subtitulo.length}/20</span>
            </div>
            <Input
              id="subtitulo"
              placeholder="Digite o subtítulo (opcional)"
              maxLength={20}
              value={subtitulo}
              onChange={e => setSubtitulo(e.target.value)}
              className="bg-input border-border rounded-xl text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Campo 3 — Items demográficos */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-foreground text-sm font-medium">
                Item Demográfico <span className="text-destructive">*</span>
              </Label>
            </div>

            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Digite o item"
                      maxLength={20}
                      value={item}
                      onChange={e => handleItemChange(index, e.target.value)}
                      className="bg-input border-border rounded-xl text-foreground placeholder:text-muted-foreground pr-12"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[11px] pointer-events-none">
                      {item.length}/20
                    </span>
                  </div>

                  {index === items.length - 1 ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleAddItem}
                      className="shrink-0 border-border rounded-xl hover:bg-primary/10 hover:border-primary/30 transition-colors"
                      title="Adicionar item"
                    >
                      <Plus size={16} className="text-primary" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveItem(index)}
                      className="shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      title="Remover item"
                    >
                      <Trash2 size={14} />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {attempted && !hasValidItem && (
              <p className="text-destructive text-[11px]">Pelo menos 1 item é obrigatório.</p>
            )}
          </div>

          {/* Preview */}
          {showPreview && (
            <div className="space-y-1.5">
              <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                Pré-visualização
              </p>
              <div className="bg-surface-elevated border border-border rounded-xl shadow-soft overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-foreground">
                    {titulo.trim() || 'Título'}
                  </h4>
                  <span className="text-[11px] font-semibold text-muted-foreground">
                    Total: {String(filledItems.length).padStart(3, '0')}
                  </span>
                </div>

                {/* Subtítulo */}
                {subtitulo.trim() && (
                  <div className="px-4 py-1.5 border-b border-border">
                    <span className="text-[10px] text-muted-foreground font-medium">
                      {subtitulo.trim()}
                    </span>
                  </div>
                )}

                {/* Items list */}
                {filledItems.length > 0 ? (
                  <div>
                    {filledItems.map((item, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-3 px-4 py-2 ${i < filledItems.length - 1 ? 'border-b border-border' : ''}`}
                      >
                        <span className="text-xs text-foreground min-w-[80px] shrink-0">
                          {item.trim()}
                        </span>
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary/20 rounded-full" style={{ width: '0%' }} />
                        </div>
                        <span className="text-[11px] font-semibold text-foreground tabular-nums w-6 text-right">
                          00
                        </span>
                        <span className="text-[11px] text-muted-foreground tabular-nums w-12 text-right">
                          0.00%
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-3 text-xs text-muted-foreground italic">
                    Adicione itens para visualizar
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        </DialogBody>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={handleClose} className="rounded-full border-border">
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={attempted && !canSave} className="rounded-full">
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
