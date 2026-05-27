# Abertura de vaga — Seleção de colaborador substituído

**Protótipo:** `/prototipo/recrutamento/abertura-vaga-substituicao`  
**Módulo:** Recrutamento · Etapa 1 (Contexto)

## Objetivo

Revelação progressiva no formulário de abertura de vaga: quando a origem é **substituição** e o motivo é **pedido de demissão** ou **desligamento**, o gestor informa o colaborador que sai. O sistema calcula se a saída ocorre nos primeiros **90 dias** (período de experiência) para alimentar o card "Subst. em Experiência" no dashboard do recrutador.

## UI implementada no protótipo

| Pergunta | Condição | Componente |
|----------|----------|------------|
| Origem da vaga | Sempre | `OrigemVagaField` |
| Motivo de saída | `origem = substituicao` | `MotivoSaidaField` + `RevealField` |
| Colaborador substituído | `motivo IN (demissao_voluntaria, desligamento)` | `ColaboradorSubstituidoField` |

## Código

| Artefato | Caminho |
|----------|---------|
| Página | `src/prototipo/pages/AberturaVagaSubstituicaoPage.tsx` |
| Etapa | `src/prototipo/recrutamento/abertura-vaga/components/EtapaContexto.tsx` |
| Cálculo experiência | `src/prototipo/recrutamento/abertura-vaga/utils/experiencia.ts` |
| Mock colaboradores | `src/prototipo/recrutamento/abertura-vaga/mocks/colaboradoresAtivos.ts` |

## Habilitação do botão Avançar

```
origem selecionada
AND (
  origem != substituicao
  OR (motivo selecionado AND (motivo não exige colaborador OR colaborador selecionado))
)
```

## Integração futura

- `GET /api/colaboradores/ativos?q=&cliente_id=` — substituir mock em `useColaboradoresAtivos`
- Persistência: `origem_vaga`, `motivo_saida`, `colaborador_substituido_id` na tabela `requisicoes`

## Critérios de aceite (protótipo)

- [x] Revelação animada (max-height + opacity) para P2 e P3
- [x] Reset em cascata ao mudar origem ou motivo
- [x] Busca com dropdown, filtro e clique fora
- [x] Bloco admissão + banner warning/success conforme 90 dias
- [x] Barra de progresso com faixas de cor (40 / 70 dias)
