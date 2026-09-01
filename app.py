# ============================================================
# app.py — Backend mínimo do ElevOS (Flask)
# FIAP · 2º semestre
#
# Este servidor é só demonstrativo: mostra que o motor de
# diagnóstico (motor_simulacao.py) também funciona por trás de
# uma API HTTP simples. O front-end React NÃO consome este
# backend no dia a dia — ele continua usando os dados mockados
# do Context API. Este arquivo existe para provar a arquitetura,
# não para substituir o front.
#
# Rotas:
#   GET  /api/health        -> confirma que o servidor está de pé
#   POST /api/diagnosticar  -> recebe respostas e devolve o diagnóstico
#   GET  /api/chamados      -> devolve os chamados salvos em database.json
#
# Só usamos Flask, flask_cors e json (bibliotecas permitidas).
# Sem classes, sem list comprehension, sem lambda/map/filter/reduce.
# ============================================================

import json

from flask import Flask, jsonify, request
from flask_cors import CORS

from motor_simulacao import gerar_explicacao, processar_chamado

app = Flask(__name__)
CORS(app)  # permite que outra origem (ex: o front em localhost:5173) chame essa API

NOME_ARQUIVO_CHAMADOS = "database.json"


def ler_chamados():
    """Lê e devolve a lista de chamados salva em database.json."""
    arquivo = open(NOME_ARQUIVO_CHAMADOS, "r", encoding="utf-8")
    chamados = json.load(arquivo)
    arquivo.close()
    return chamados


@app.route("/api/health", methods=["GET"])
def health():
    """Rota simples só para confirmar que o servidor está rodando."""
    return jsonify({"status": "ok"})


@app.route("/api/diagnosticar", methods=["POST"])
def diagnosticar_rota():
    """
    Recebe um JSON no formato:
        {"respostas": {"P1": "Sim", "P2": "Não", "P3": "Não sei", ...}}

    Usa as funções de motor_simulacao.py (processar_chamado e
    gerar_explicacao) para calcular o diagnóstico e devolve tudo
    em um único JSON de resposta.
    """
    dados_recebidos = request.get_json()

    if dados_recebidos is None or "respostas" not in dados_recebidos:
        return jsonify({"erro": "Envie um JSON com a chave 'respostas'."}), 400

    respostas = dados_recebidos["respostas"]

    resultado = processar_chamado(respostas)
    diagnostico = resultado["diagnostico"]
    explicacao = gerar_explicacao(resultado["respostas"], diagnostico)

    resposta = {
        "tipo": diagnostico["tipo"],
        "falha_principal": diagnostico["falha_principal"],
        "falha_secundaria": diagnostico["falha_secundaria"],
        "pecas_sugeridas": diagnostico["pecas_sugeridas"],
        "confianca": diagnostico["confianca"],
        "parou_antes": diagnostico["parou_antes"],
        "perguntas_feitas": diagnostico["perguntas_feitas"],
        "explicacao": explicacao,
    }

    return jsonify(resposta)


@app.route("/api/chamados", methods=["GET"])
def listar_chamados():
    """Devolve a lista de chamados salva em database.json (somente leitura)."""
    chamados = ler_chamados()
    return jsonify(chamados)


if __name__ == "__main__":
    app.run(port=5000, debug=True)
