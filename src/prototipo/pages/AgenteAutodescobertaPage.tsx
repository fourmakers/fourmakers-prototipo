import { useCallback, useEffect, useRef, useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { ValorAutodescoberta } from "@/prototipo/agente-autodescoberta/autodescobertaValues";
import { VALORES_AUTODESCOBERTA } from "@/prototipo/agente-autodescoberta/autodescobertaValues";
import { getMensagemInicialMock, getRespostaAssistenteMock } from "@/prototipo/agente-autodescoberta/autodescobertaMockChat";
import { parseTag, stripAgentTags } from "@/prototipo/agente-autodescoberta/autodescobertaParse";
import { AutodescobertaResultadoExpandido } from "@/prototipo/agente-autodescoberta/AutodescobertaResultadoExpandido";

type ChatRole = "user" | "assistant";

interface ChatMessage {
  role: ChatRole;
  content: string;
}

function delay(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div
          className="mr-2 flex size-7 shrink-0 items-center justify-center self-end rounded-full bg-infoSoft text-info"
          aria-hidden
        >
          <Sparkles className="size-3.5" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[72%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
          isUser
            ? "rounded-br-sm bg-infoSoft text-primaryText"
            : "rounded-bl-sm border border-borderSoft bg-surfaceElevated text-primaryText",
        )}
      >
        {message.content}
      </div>
    </div>
  );
}

export function AgenteAutodescobertaPage() {
  const [stage, setStage] = useState<"chatting" | "selecting_values">("chatting");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [bootLoading, setBootLoading] = useState(true);
  const [selectedValues, setSelectedValues] = useState<ValorAutodescoberta[]>([]);
  const [userTurnCount, setUserTurnCount] = useState(0);
  const [tecnicas, setTecnicas] = useState<string[]>([]);
  const [comportamentais, setComportamentais] = useState<string[]>([]);
  const [cargos, setCargos] = useState<string[]>([]);
  const [flowComplete, setFlowComplete] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const valuesAnchorRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setBootLoading(true);
      await delay(450);
      if (cancelled) return;
      setMessages([{ role: "assistant", content: getMensagemInicialMock() }]);
      setBootLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, tecnicas, loading, stage]);

  useEffect(() => {
    if (stage === "selecting_values") {
      valuesAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [stage]);

  const appendAssistantFromRaw = useCallback((raw: string) => {
    const showVals = raw.includes("[SHOW_VALUES]");
    const t = parseTag(raw, "TECNICAS");
    const b = parseTag(raw, "COMPORTAMENTAIS");
    const c = parseTag(raw, "CARGOS");
    const clean = stripAgentTags(raw);
    setMessages((prev) => [...prev, { role: "assistant", content: clean }]);
    if (t.length > 0) {
      setTecnicas(t);
      setComportamentais(b);
      setCargos(c);
      setFlowComplete(true);
    }
    if (showVals) {
      window.setTimeout(() => setStage("selecting_values"), 650);
    }
  }, []);

  const processUserMessage = useCallback(
    async (userText: string) => {
      if (loading || flowComplete) return;
      const nextTurn = userTurnCount + 1;
      setUserTurnCount(nextTurn);
      setMessages((prev) => [...prev, { role: "user", content: userText }]);
      setLoading(true);
      try {
        await delay(620);
        const raw = getRespostaAssistenteMock(nextTurn);
        if (!raw) return;
        appendAssistantFromRaw(raw);
      } catch {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Não conseguimos processar sua resposta agora. Tente novamente." },
        ]);
      } finally {
        setLoading(false);
        window.setTimeout(() => inputRef.current?.focus(), 120);
      }
    },
    [appendAssistantFromRaw, flowComplete, loading, userTurnCount],
  );

  const handleSend = () => {
    const msg = input.trim();
    if (!msg || loading || flowComplete || bootLoading) return;
    setInput("");
    void processUserMessage(msg);
  };

  const toggleValue = (v: ValorAutodescoberta) => {
    setSelectedValues((prev) => {
      const sel = prev.find((s) => s.id === v.id);
      if (sel) return prev.filter((s) => s.id !== v.id);
      if (prev.length >= 10) return prev;
      return [...prev, v];
    });
  };

  const confirmValues = () => {
    if (selectedValues.length !== 10) return;
    const msg = `Escolhi estes valores: ${selectedValues.map((v) => v.nome).join(", ")}`;
    setStage("chatting");
    setSelectedValues([]);
    void processUserMessage(msg);
  };

  const hasResults = tecnicas.length > 0 || comportamentais.length > 0 || cargos.length > 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agente de Autodescoberta"
        description="Conversa em 9 etapas (mock). Depois: confirmar análise prévia (Perfil de Atuação), competências + vagas em colunas, composição humano/agentes/híbrido com sliders e carreiras potencializadas."
      />

      <div className={cn("mx-auto w-full", flowComplete && hasResults ? "max-w-6xl" : "max-w-3xl")}>
        <Card className="overflow-hidden">
        <h2 className="sr-only">Conversa de autodescoberta com o agente do Fourmakers</h2>

        <div className="flex items-center gap-2.5 border-b border-borderSoft bg-surfaceElevated px-5 py-3.5">
          <div className="flex size-8 items-center justify-center rounded-full bg-infoSoft text-info">
            <Sparkles className="size-4" aria-hidden />
          </div>
          <div>
            <p className="m-0 text-sm font-medium text-primaryText">Fourmakers</p>
            <p className="m-0 text-xs text-secondaryText">conversa de autodescoberta</p>
          </div>
          {stage === "selecting_values" && (
            <span className="ml-auto rounded-pillToken border border-borderSoft bg-secondaryBackground px-2.5 py-1 text-xs text-secondaryText">
              seleção de valores
            </span>
          )}
        </div>

        <CardContent className="p-0">
          <div
            className={cn(
              "flex flex-col overflow-y-auto border-borderSoft bg-secondaryBackground",
              stage === "selecting_values" ? "max-h-[140px] shrink-0 border-b" : "max-h-[min(520px,55vh)] min-h-[200px]",
            )}
          >
            <div className="flex flex-col gap-3 p-4">
              {messages.map((m, i) => (
                <ChatBubble key={`${m.role}-${i}`} message={m} />
              ))}

              {(loading || bootLoading) && (
                <div className="flex items-center gap-2">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-infoSoft text-info">
                    <Sparkles className="size-3.5" aria-hidden />
                  </div>
                  <div className="rounded-2xl rounded-bl-sm border border-borderSoft bg-surfaceElevated px-3.5 py-2.5">
                    <div className="flex items-center gap-1">
                      {[0, 1, 2].map((d) => (
                        <span
                          key={d}
                          className="size-1.5 animate-pulse rounded-full bg-secondaryText"
                          style={{ animationDelay: `${d * 200}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {stage === "selecting_values" && (
            <div className="max-h-[min(420px,45vh)] overflow-y-auto bg-secondaryBackground px-4 py-3.5">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div>
                  <p className="m-0 text-sm font-medium text-primaryText">Escolha seus 10 valores</p>
                  <p className="m-0 text-xs text-secondaryText">os que mais representam quem você é</p>
                </div>
                <span
                  className={cn(
                    "text-sm font-medium",
                    selectedValues.length === 10 ? "text-success" : "text-secondaryText",
                  )}
                >
                  {selectedValues.length}/10
                </span>
              </div>
              <div className="mb-3 grid grid-cols-[repeat(auto-fill,minmax(138px,1fr))] gap-2">
                {VALORES_AUTODESCOBERTA.map((v) => {
                  const sel = !!selectedValues.find((s) => s.id === v.id);
                  const disabled = !sel && selectedValues.length === 10;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      disabled={disabled}
                      onClick={() => toggleValue(v)}
                      className={cn(
                        "rounded-lgToken border px-2.5 py-2 text-left transition-colors",
                        sel
                          ? "border-info bg-infoSoft"
                          : "border-borderSoft bg-surfaceElevated hover:border-borderDefault",
                        disabled && "cursor-not-allowed opacity-40",
                      )}
                    >
                      <p className={cn("m-0 text-[13px] font-medium", sel ? "text-info" : "text-primaryText")}>
                        {v.nome}
                      </p>
                      <p
                        className={cn(
                          "mt-0.5 text-[11px] leading-snug",
                          sel ? "text-primaryText" : "text-secondaryText",
                        )}
                      >
                        {v.descricao}
                      </p>
                    </button>
                  );
                })}
              </div>
              <Button
                ref={valuesAnchorRef}
                type="button"
                className="w-full"
                disabled={selectedValues.length !== 10}
                onClick={confirmValues}
              >
                {selectedValues.length === 10
                  ? "Confirmar meus valores"
                  : `Selecione mais ${10 - selectedValues.length} valor${10 - selectedValues.length !== 1 ? "es" : ""}`}
              </Button>
            </div>
          )}

          {stage === "chatting" && (
            <div className="flex gap-2 border-t border-borderSoft bg-surfaceElevated p-3">
              <Textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Escreva sua resposta..."
                disabled={loading || bootLoading || flowComplete}
                rows={2}
                className="min-h-[44px] flex-1 resize-none border-borderSoft bg-secondaryBackground text-primaryText placeholder:text-placeholder"
              />
              <Button
                type="button"
                size="icon"
                className="size-10 shrink-0 self-end"
                disabled={!input.trim() || loading || bootLoading || flowComplete}
                aria-label="Enviar"
                onClick={handleSend}
              >
                <Send className="size-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

        {flowComplete && hasResults && (
          <AutodescobertaResultadoExpandido
            tecnicas={tecnicas}
            comportamentais={comportamentais}
            cargos={cargos}
          />
        )}
      </div>
    </div>
  );
}
