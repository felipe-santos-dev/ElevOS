import { condominios, elevadores } from '../data/mock'

// Acha o regiaoId de um RG procurando na árvore de condomínios da
// Central — usado até para os elevadores que vêm da base do síndico,
// já que os mesmos prédios aparecem nas duas estruturas de dados.
function regiaoDoRg(rg) {
  for (const cond of condominios) {
    for (const bloco of cond.blocos) {
      if (bloco.elevadores.some((e) => e.rg === rg)) return cond.regiaoId
    }
  }
  return null
}

// Localiza um elevador pelo RG tanto na base do síndico quanto na
// árvore de condomínios da Central, devolvendo um formato único —
// permite que o mesmo fluxo de perguntas e a mesma tela de detalhe
// sirvam os dois perfis. Nem todo campo existe para todo elevador:
// os campos "ricos" (preventiva, capacidade, contrato...) só existem
// para os elevadores cadastrados na base do síndico.
export function buscarElevador(rg) {
  const doSindico = elevadores.find((e) => e.rg === rg)
  if (doSindico) {
    return {
      rg: doSindico.rg,
      nome: doSindico.nome,
      local: `${doSindico.torre} · ${doSindico.nome}`,
      tecnologia: doSindico.tecnologia,
      torre: doSindico.torre,
      condominio: null,
      regiaoId: regiaoDoRg(rg) ?? 'sp-zona-sul',
      status: doSindico.status,
      statusLabel: doSindico.statusLabel,
      operacao: doSindico.operacao,
      modelo: doSindico.modelo,
      capacidade: doSindico.capacidade,
      paradas: doSindico.paradas,
      contrato: doSindico.contrato,
      preventiva: doSindico.preventiva,
      chamados: doSindico.chamados,
    }
  }

  for (const cond of condominios) {
    for (const bloco of cond.blocos) {
      const el = bloco.elevadores.find((e) => e.rg === rg)
      if (el) {
        return {
          rg: el.rg,
          nome: el.nome,
          local: `${cond.nome} · ${bloco.nome} · ${el.nome}`,
          tecnologia: el.tecnologia,
          torre: bloco.nome,
          condominio: cond.nome,
          regiaoId: cond.regiaoId,
          status: el.status,
          statusLabel: null,
          operacao: null,
          modelo: null,
          capacidade: null,
          paradas: null,
          contrato: null,
          preventiva: null,
          chamados: null,
        }
      }
    }
  }

  return null
}
