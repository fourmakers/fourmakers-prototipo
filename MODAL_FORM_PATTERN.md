# Padrão de Modal com Formulário (fourmakers-v2)

Referência: **fourmakers-v2** — rota `/inserir-reembolso`, botão "Editar dados bancários" → modal **Editar dados bancários**.

## Overlay do modal

- **Cor:** `bg-black/80` (preto com 80% de opacidade).
- **Sem** `backdrop-blur` no overlay (fundo escuro liso).
- **z-index:** `z-[110]` para overlay e conteúdo.
- Implementado no componente `@/components/ui/dialog` (DialogOverlay e DialogContent).

## Estrutura do modal

Sempre usar o **Dialog** do `@/components/ui/dialog` com **título e rodapé fixos** e **apenas o conteúdo rolável**:

```tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from "@/components/ui/dialog";
```

### Regra: header e footer fixos, só o corpo rola

- **DialogHeader** — fixo no topo (não rola). Contém título e descrição.
- **DialogBody** — única área com scroll. Todo o formulário/conteúdo fica aqui.
- **DialogFooter** — fixo na base (não rola). Botões de ação (Cancelar, Salvar).

O `DialogContent` já usa `max-h-[90vh]` e layout em coluna; o `DialogBody` é `flex-1 min-h-0 overflow-y-auto`.

### 1. Raiz e conteúdo

```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="max-w-2xl">
```

- `max-w-2xl` (ou `max-w-lg`) conforme necessidade.
- Não use `overflow-y-auto` no `DialogContent`; o scroll fica apenas no `DialogBody`.

### 2. Cabeçalho (DialogHeader) — fixo no topo

- **Título:** ícone opcional + `DialogTitle`.
- **Descrição:** sempre usar `DialogDescription` (texto auxiliar, acessibilidade).

```tsx
<DialogHeader>
  <div className="flex items-center gap-2">
    <Icone className="h-5 w-5" />
    <DialogTitle>Editar dados bancários</DialogTitle>
  </div>
  <DialogDescription>
    É necessário cadastrar ao menos uma informação bancária. Inclua uma chave Pix ou os dados de uma conta bancária.
  </DialogDescription>
</DialogHeader>
```

### 3. Corpo rolável (DialogBody) — único bloco com scroll

Todo o formulário deve ficar dentro de **DialogBody**. Container interno: `space-y-6`, seções com `space-y-4`, campos com `space-y-2`.

```tsx
<DialogBody>
  <div className="space-y-6">
    <div className="space-y-4">
      <h4 className="font-medium">Chave PIX</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="campo">Tipo chave PIX</Label>
          <Select ... />
        </div>
        <div className="space-y-2">
          <Label htmlFor="chave">Chave PIX</Label>
          <Input id="chave" ... />
        </div>
      </div>
    </div>
  </div>
</DialogBody>
```

### 4. Bloco de erros de validação

```tsx
{dadosBancariosErros.length > 0 && (
  <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
    <p className="text-sm font-medium text-destructive mb-2">Erros de validação:</p>
    <ul className="list-disc list-inside space-y-1 text-sm text-foreground">
      {dadosBancariosErros.map((erro, index) => (
        <li key={index}>{erro}</li>
      ))}
    </ul>
  </div>
)}
```

### 5. Rodapé (DialogFooter) — fixo na base

- Botão secundário (Cancelar): `variant="outline"`.
- Botão principal (Salvar): `variant="primary"`.
- Ordem: Cancelar à esquerda, ação principal à direita (classe do footer já inverte em mobile).

```tsx
<DialogFooter>
  <Button variant="outline" onClick={() => setOpen(false)} disabled={salvando}>
    Cancelar
  </Button>
  <Button variant="primary" onClick={handleSalvar} disabled={salvando}>
    {salvando ? <> <Loader2 className="h-4 w-4 animate-spin" /> Salvando... </> : "Salvar"}
  </Button>
</DialogFooter>
```

## Resumo

| Elemento        | Padrão fourmakers-v2                          |
|-----------------|------------------------------------------------|
| Overlay         | `bg-black/80`, z-[110], sem blur               |
| Conteúdo        | border-border, bg-white, max-h-[90vh], flex coluna |
| Botão fechar    | Canto superior direito, rounded-pillToken, h-9 w-9 |
| Header          | Fixo no topo. DialogTitle + DialogDescription (obrigatório) |
| **Body**        | **Única área rolável.** Usar `DialogBody` com todo o formulário |
| Footer          | Fixo na base. Outline (Cancelar) + Primary (ação) |

Todos os modais com formulário no projeto devem seguir este padrão e usar o componente `Dialog` de `@/components/ui/dialog`.
