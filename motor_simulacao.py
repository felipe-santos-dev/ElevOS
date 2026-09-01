# ============================================================
# MOTOR DE DIAGNÓSTICO — ElevOS (simulação em Python)
# FIAP · 2º semestre
#
# Simula, fora do front-end React, a mesma lógica de diagnóstico
# usada no fluxo de 12 perguntas do síndico: cada resposta ("Sim",
# "Não" ou "Não sei") ajusta a pontuação de 6 possíveis falhas do
# elevador. A cada resposta, recalculamos a confiança (%) de cada
# falha; se alguma atingir 80% ou mais, paramos na hora ("parada
# antecipada") e já damos o diagnóstico como certo, sem precisar
# fazer as perguntas restantes.
#
# Só usamos o que já vimos em aula: listas, dicionários, funções,
# laços, condicionais e o módulo "json" (só para imprimir bonito
# nos testes). Sem bibliotecas externas, sem classes.
# ============================================================

import json
import sys

# Garante que os acentos apareçam certos no terminal, mesmo em
# consoles do Windows que não usam UTF-8 por padrão.
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")


# ------------------------------------------------------------
# 1) DADOS FIXOS DO MOTOR (matriz de pesos, perguntas e peças)
# ------------------------------------------------------------

# Texto de cada uma das 12 perguntas, na ordem em que são feitas.
PERGUNTAS = {
    "P1": "O elevador faz barulho metálico?",
    "P2": "O elevador para com solavancos?",
    "P3": "A porta não abre ou trava?",
    "P4": "A porta fecha muito devagar?",
    "P5": "Há cheiro de queimado?",
    "P6": "A luz da cabine oscila?",
    "P7": "O painel de andares apaga?",
    "P8": "O elevador vibra na subida?",
    "P9": "O freio faz ruído ao parar?",
    "P10": "O cabo está desgastado?",
    "P11": "Há folga na polia?",
    "P12": "O disjuntor desarma?",
}

# Ordem oficial das perguntas — usada para saber "qual vem depois de qual"
# na hora de simular a parada antecipada.
ORDEM_PERGUNTAS = ["P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8", "P9", "P10", "P11", "P12"]

# Matriz de pesos: para cada falha, o peso (0 a 3) de cada pergunta.
# Peso 0 significa que aquela pergunta não diz nada sobre aquela falha.
MATRIZ_PESOS = {
    "Motor":              {"P1": 3, "P2": 2, "P3": 0, "P4": 0, "P5": 1, "P6": 0, "P7": 0, "P8": 1, "P9": 0, "P10": 0, "P11": 0, "P12": 0},
    "Freio":               {"P1": 1, "P2": 3, "P3": 0, "P4": 0, "P5": 0, "P6": 0, "P7": 0, "P8": 0, "P9": 2, "P10": 0, "P11": 0, "P12": 0},
    "Porta":               {"P1": 0, "P2": 0, "P3": 3, "P4": 2, "P5": 0, "P6": 1, "P7": 0, "P8": 0, "P9": 0, "P10": 0, "P11": 0, "P12": 0},
    "Sensor":              {"P1": 0, "P2": 1, "P3": 2, "P4": 0, "P5": 0, "P6": 0, "P7": 3, "P8": 0, "P9": 0, "P10": 0, "P11": 0, "P12": 0},
    "Polia/Cabo":          {"P1": 2, "P2": 1, "P3": 0, "P4": 0, "P5": 0, "P6": 0, "P7": 0, "P8": 0, "P9": 0, "P10": 2, "P11": 1, "P12": 0},
    "Contator Elétrico":   {"P1": 0, "P2": 0, "P3": 0, "P4": 0, "P5": 3, "P6": 0, "P7": 0, "P8": 0, "P9": 0, "P10": 0, "P11": 0, "P12": 3},
}

# Lista das 6 falhas possíveis, na mesma ordem da matriz acima.
FALHAS = list(MATRIZ_PESOS.keys())

# Peças recomendadas para cada falha.
PECAS_POR_FALHA = {
    "Motor":              ["Motor X34", "Rolamento"],
    "Freio":               ["Pastilha de Freio", "Sensor de Desgaste"],
    "Porta":               ["Atuador de Porta", "Fechadura Elétrica"],
    "Sensor":              ["Sensor de Porta", "Sensor de Presença"],
    "Polia/Cabo":          ["Cabo de Aço", "Polia", "Lubrificante"],
    "Contator Elétrico":   ["Contator", "Fusível", "Relé"],
}

# Limite de confiança a partir do qual já consideramos "Certeza"
# (usado tanto na parada antecipada quanto na classificação final).
LIMITE_CERTEZA = 80


# ------------------------------------------------------------
# 2) FUNÇÕES PRINCIPAIS DO MOTOR
# ------------------------------------------------------------

def calcular_pontuacao(respostas):
    """
    Recebe um dicionário de respostas, por exemplo:
        {"P1": "Sim", "P2": "Não", "P3": "Não sei"}
    (pode ter menos de 12 perguntas, se o diagnóstico ainda
    não chegou ao fim).

    Devolve um dicionário com a pontuação bruta de cada uma
    das 6 falhas, somando ou subtraindo o peso de cada pergunta
    conforme a resposta dada:
        "Sim"     -> soma o peso
        "Não"     -> subtrai o peso
        "Não sei" -> soma 0 (não altera a pontuação)
        pergunta não respondida -> também soma 0
    """
    pontuacao = {}

    for falha in FALHAS:
        pesos_da_falha = MATRIZ_PESOS[falha]
        soma = 0
        for pergunta, peso in pesos_da_falha.items():
            resposta = respostas.get(pergunta)  # None se não foi respondida ainda
            if resposta == "Sim":
                soma += peso
            elif resposta == "Não":
                soma -= peso
            # "Não sei" ou pergunta não respondida: não faz nada (soma 0)
        pontuacao[falha] = soma

    return pontuacao


def calcular_confianca(pontuacao):
    """
    Recebe o dicionário de pontuação bruta (pode ter valores
    negativos) e devolve um dicionário com a confiança de cada
    falha, em porcentagem (0 a 100), seguindo a regra:

    1) Pontuação negativa vira 0 (uma falha não pode "pesar menos
       que nada" na hora de calcular a porcentagem).
    2) Soma-se todas as pontuações positivas -> total_positivo.
    3) Se total_positivo > 0, a confiança de cada falha é
       (pontuacao_positiva_da_falha / total_positivo) * 100.
    4) Se total_positivo == 0 (nenhuma falha tem pontuação
       positiva), todas as confianças ficam em 0.
    """
    pontuacoes_positivas = {}
    for falha, valor in pontuacao.items():
        pontuacoes_positivas[falha] = valor if valor > 0 else 0

    total_positivo = sum(pontuacoes_positivas.values())

    confianca = {}
    for falha, valor_positivo in pontuacoes_positivas.items():
        if total_positivo > 0:
            confianca[falha] = (valor_positivo / total_positivo) * 100
        else:
            confianca[falha] = 0

    return confianca


def _falha_principal_e_secundaria(confianca):
    """
    Função auxiliar: percorre o dicionário de confiança com um
    laço "for" simples e vai guardando a maior e a segunda maior
    confiança encontradas até agora (sem usar sorted/lambda).
    Devolve (falha_principal, valor_principal, falha_secundaria)
    — a falha_secundaria é a segunda colocada (sempre existe,
    já que há 6 falhas cadastradas).
    """
    falha_principal = None
    valor_principal = -1
    falha_secundaria = None
    valor_secundario = -1

    for falha, valor in confianca.items():
        if valor > valor_principal:
            # a antiga "1º lugar" cai para "2º lugar"
            falha_secundaria = falha_principal
            valor_secundario = valor_principal
            falha_principal = falha
            valor_principal = valor
        elif valor > valor_secundario:
            falha_secundaria = falha
            valor_secundario = valor

    return falha_principal, valor_principal, falha_secundaria


def _sugerir_pecas(tipo, falha_principal, falha_secundaria):
    """
    Função auxiliar: decide quais peças sugerir de acordo com o
    tipo de diagnóstico.
        Certeza    -> só as peças da falha principal
        Provável   -> peças da falha principal + da secundária
        Dúvida     -> peças da principal + secundária, limitado a 3-4 itens
        Incerteza  -> "kit completo" (peças de todas as falhas)
    """
    if tipo == "Certeza":
        return list(PECAS_POR_FALHA[falha_principal])

    if tipo in ("Provável", "Dúvida"):
        pecas = list(PECAS_POR_FALHA[falha_principal])
        if falha_secundaria:
            for peca in PECAS_POR_FALHA[falha_secundaria]:
                if peca not in pecas:
                    pecas.append(peca)
        if tipo == "Dúvida":
            pecas = pecas[:4]  # sugere só 3-4 peças, conforme regra de negócio
        return pecas

    # Incerteza: kit completo, com as peças de todas as falhas (sem repetir)
    kit_completo = []
    for pecas_da_falha in PECAS_POR_FALHA.values():
        for peca in pecas_da_falha:
            if peca not in kit_completo:
                kit_completo.append(peca)
    return kit_completo


def _classificar_tipo(confianca_principal):
    """
    Função auxiliar: transforma o valor de confiança (0 a 100)
    no rótulo do diagnóstico, conforme as faixas do negócio.
    """
    if confianca_principal >= 80:
        return "Certeza"
    if confianca_principal >= 65:
        return "Provável"
    if confianca_principal >= 40:
        return "Dúvida"
    return "Incerteza"


def diagnosticar(respostas, parar_antecipado=True):
    """
    Recebe o dicionário de respostas (até 12 perguntas) e simula
    o síndico respondendo uma pergunta de cada vez, na ordem
    P1 -> P12.

    Se "parar_antecipado" for True, depois de CADA resposta o
    motor recalcula a confiança de todas as falhas; assim que a
    maior confiança atingir 80% ou mais, o motor para na hora,
    mesmo que ainda existam perguntas no dicionário "respostas"
    que não chegaram a ser usadas.

    Se nunca atingir 80% (ou se "parar_antecipado" for False),
    o motor usa todas as respostas disponíveis e classifica o
    diagnóstico pela maior confiança encontrada no final.

    Devolve um dicionário com:
        tipo, falha_principal, falha_secundaria,
        pecas_sugeridas, confianca, parou_antes, perguntas_feitas
    """
    respostas_ate_agora = {}
    perguntas_feitas = 0
    parou_antes = False

    # pontuacao/confianca "atuais" — começam zeradas caso nenhuma
    # pergunta tenha sido respondida ainda.
    pontuacao_atual = calcular_pontuacao({})
    confianca_atual = calcular_confianca(pontuacao_atual)

    for pergunta in ORDEM_PERGUNTAS:
        if pergunta not in respostas:
            # Não há mais respostas nesse chamado (ou pularam uma
            # pergunta) — encerra a simulação aqui.
            break

        respostas_ate_agora[pergunta] = respostas[pergunta]
        perguntas_feitas += 1

        pontuacao_atual = calcular_pontuacao(respostas_ate_agora)
        confianca_atual = calcular_confianca(pontuacao_atual)

        _, maior_confianca, _ = _falha_principal_e_secundaria(confianca_atual)

        if parar_antecipado and maior_confianca >= LIMITE_CERTEZA:
            parou_antes = True
            break

    falha_principal, confianca_principal, falha_secundaria = _falha_principal_e_secundaria(confianca_atual)
    tipo = _classificar_tipo(confianca_principal)
    pecas_sugeridas = _sugerir_pecas(tipo, falha_principal, falha_secundaria)

    return {
        "tipo": tipo,
        "falha_principal": falha_principal,
        "falha_secundaria": falha_secundaria,
        "pecas_sugeridas": pecas_sugeridas,
        "confianca": round(confianca_principal, 2),
        "parou_antes": parou_antes,
        "perguntas_feitas": perguntas_feitas,
    }


def processar_chamado(respostas):
    """
    Função "de mais alto nível": recebe as respostas de um chamado
    (até 12 perguntas — pode ter menos, se o síndico parou antes)
    e devolve um dicionário completo com:
        respostas   -> só as perguntas realmente usadas no diagnóstico
        pontuacao   -> pontuação bruta final de cada falha
        confianca   -> confiança (%) final de cada falha
        diagnostico -> resultado de diagnosticar()
    """
    diagnostico = diagnosticar(respostas, parar_antecipado=True)

    # Reconstrói só as respostas que de fato foram usadas (respeita
    # a parada antecipada, mesmo que "respostas" tivesse mais itens).
    perguntas_usadas = ORDEM_PERGUNTAS[: diagnostico["perguntas_feitas"]]
    respostas_usadas = {}
    for pergunta in perguntas_usadas:
        if pergunta in respostas:
            respostas_usadas[pergunta] = respostas[pergunta]

    pontuacao_final = calcular_pontuacao(respostas_usadas)
    confianca_final = calcular_confianca(pontuacao_final)

    return {
        "respostas": respostas_usadas,
        "pontuacao": pontuacao_final,
        "confianca": confianca_final,
        "diagnostico": diagnostico,
    }


def gerar_explicacao(respostas, diagnostico):
    """
    Recebe as respostas originais e o diagnóstico já calculado
    (dicionário devolvido por diagnosticar()) e monta um texto
    em português explicando o resultado: qual falha foi apontada,
    com que confiança, quais respostas mais pesaram a favor dela
    e se o motor parou antes de terminar as 12 perguntas.
    """
    falha_principal = diagnostico["falha_principal"]
    pesos_da_falha = MATRIZ_PESOS[falha_principal]

    # Perguntas que o síndico respondeu "Sim" e que têm peso para a
    # falha principal — são as respostas que mais contribuíram.
    respostas_que_mais_pesaram = []
    for pergunta, peso in pesos_da_falha.items():
        if peso > 0 and respostas.get(pergunta) == "Sim":
            respostas_que_mais_pesaram.append(f'{pergunta} ("{PERGUNTAS[pergunta]}")')

    texto = (
        f"Diagnóstico: {diagnostico['tipo']} — a falha mais provável é '{falha_principal}', "
        f"com {diagnostico['confianca']}% de confiança."
    )

    if respostas_que_mais_pesaram:
        texto += " As respostas que mais contribuíram para essa conclusão foram: "
        texto += ", ".join(respostas_que_mais_pesaram) + "."
    else:
        texto += " Nenhuma resposta 'Sim' apontou diretamente para essa falha; o resultado veio principalmente da eliminação das outras hipóteses."

    if diagnostico["parou_antes"]:
        texto += (
            f" O motor parou de perguntar depois de {diagnostico['perguntas_feitas']} pergunta(s), "
            f"pois a confiança já havia atingido o limite de {LIMITE_CERTEZA}% para ter certeza."
        )
    else:
        texto += f" Todas as {diagnostico['perguntas_feitas']} pergunta(s) disponíveis foram usadas antes de fechar o diagnóstico."

    if diagnostico["falha_secundaria"]:
        texto += f" A segunda hipótese mais provável é '{diagnostico['falha_secundaria']}'."

    return texto


# ------------------------------------------------------------
# 3) TESTES — três cenários (Certeza, Provável e Incerteza)
# ------------------------------------------------------------

def _imprimir_cenario(titulo, respostas):
    """Função auxiliar só para deixar a saída dos testes organizada."""
    print("=" * 70)
    print(titulo)
    print("=" * 70)

    resultado = processar_chamado(respostas)
    explicacao = gerar_explicacao(resultado["respostas"], resultado["diagnostico"])

    print(json.dumps(resultado, indent=2, ensure_ascii=False))
    print("\nExplicação:")
    print(explicacao)
    print()


if __name__ == "__main__":
    # ------------------------------------------------------------
    # Cenário 1 — leva a "Certeza" com PARADA ANTECIPADA.
    #
    # O síndico responde "Sim" para os sintomas de Motor (P1 e P8)
    # e "Não" para P9 e P10 (que eliminam Freio e Polia/Cabo, os
    # dois "concorrentes" que P1 também alimentava). O restante
    # fica em "Não sei". Com isso, na 10ª pergunta a confiança do
    # Motor chega a 100% e o motor de diagnóstico para na hora,
    # sem precisar perguntar P11 e P12.
    # ------------------------------------------------------------
    respostas_certeza = {
        "P1": "Sim",
        "P2": "Não sei",
        "P3": "Não sei",
        "P4": "Não sei",
        "P5": "Não sei",
        "P6": "Não sei",
        "P7": "Não sei",
        "P8": "Sim",
        "P9": "Não",
        "P10": "Não",
        # P11 e P12 nem chegam a ser perguntadas — o diagnóstico já
        # fechou antes, então nem precisam estar neste dicionário.
    }
    _imprimir_cenario("CENÁRIO 1 — Certeza (parada antecipada)", respostas_certeza)

    # ------------------------------------------------------------
    # Cenário 2 — leva a "Provável" (65% a 79% de confiança), sem
    # parada antecipada: o Motor termina com aproximadamnte 66,7%
    # de confiança porque só eliminamos o Freio (resposta "Não" em
    # P9), mas deixamos a Polia/Cabo com pontuação positiva — isso
    # segura a confiança do Motor abaixo dos 80% até o fim das
    # 12 perguntas.
    # ------------------------------------------------------------
    respostas_provavel = {
        "P1": "Sim",
        "P2": "Não sei",
        "P3": "Não sei",
        "P4": "Não sei",
        "P5": "Não sei",
        "P6": "Não sei",
        "P7": "Não sei",
        "P8": "Sim",
        "P9": "Não",
        "P10": "Não sei",
        "P11": "Não sei",
        "P12": "Não sei",
    }
    _imprimir_cenario("CENÁRIO 2 — Provável", respostas_provavel)

    # ------------------------------------------------------------
    # Cenário 3 — leva a "Incerteza" (< 40% de confiança): o
    # síndico responde "Não sei" para todas as 12 perguntas, então
    # nenhuma falha tem pontuação positiva (total_positivo == 0) e
    # todas as confianças ficam em 0%. O motor sugere o kit
    # completo de peças, já que não há nenhuma pista.
    # ------------------------------------------------------------
    respostas_incerteza = {}
    for pergunta in ORDEM_PERGUNTAS:
        respostas_incerteza[pergunta] = "Não sei"
    _imprimir_cenario("CENÁRIO 3 — Incerteza", respostas_incerteza)
