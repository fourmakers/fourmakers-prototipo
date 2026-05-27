interface EtapaPlaceholderProps {
  titulo: string;
  descricao: string;
}

export function EtapaPlaceholder({ titulo, descricao }: EtapaPlaceholderProps) {
  return (
    <div className="rounded-md border border-dashed border-borderDefault bg-surfaceSubtle px-5 py-10 text-center">
      <p className="text-sm font-semibold text-primaryText">{titulo}</p>
      <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-secondaryText">{descricao}</p>
    </div>
  );
}
