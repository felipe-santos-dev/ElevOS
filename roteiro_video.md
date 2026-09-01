# Roteiro — Vídeo de demonstração do ElevOS

Duração total alvo: **até 5 minutos** (soma dos blocos abaixo: 4min30).
Grave em uma resolução que deixe o texto da tela legível (1440px de largura
no navegador, zoom do terminal aumentado).

---

## 1. Introdução (15s)

**Tela:** slide simples ou tela do login do ElevOS, ainda sem clicar em nada.

**Fala:**
> "Este é o ElevOS, um sistema de apoio ao diagnóstico de falhas em
> elevadores que não têm sensores conectados. Quando o elevador não avisa
> sozinho o que está errado, o síndico descreve o sintoma e o sistema aponta
> a causa mais provável antes do técnico chegar."

---

## 2. Motor de diagnóstico (30s)

**Tela:** terminal, com o repositório aberto, rodando:
```bash
python motor_simulacao.py
```
Deixe a saída dos 3 cenários rolar na tela (Certeza, Provável, Incerteza).

**Fala:**
> "O motor de diagnóstico é Python puro — sem inteligência artificial e sem
> estatística. É uma matriz de pesos: cada uma das 12 perguntas tem um peso
> para cada uma das 6 possíveis falhas, e cada resposta soma ou subtrai esse
> peso. Aqui rodamos três cenários de teste: um em que o sistema já tem
> certeza e para de perguntar antes da 12ª pergunta, um em que o diagnóstico
> fica só 'provável', e um em que não há sintomas suficientes e o resultado
> é 'incerteza'."

---

## 3. Back-end (30s)

**Tela:** terminal rodando `python app.py` mostrando o servidor no ar, depois
uma segunda janela de terminal (ou o Postman) chamando:
```bash
curl http://localhost:5000/api/health
curl -X POST http://localhost:5000/api/diagnosticar -H "Content-Type: application/json" -d "{\"respostas\": {\"P1\": \"Sim\", \"P8\": \"Sim\", \"P9\": \"Não\", \"P10\": \"Não\"}}"
```

**Fala:**
> "Também montamos um back-end bem simples em Flask, só para mostrar que
> esse mesmo motor de diagnóstico funciona por trás de uma API HTTP — a
> rota `/api/diagnosticar` recebe as respostas e devolve o mesmo resultado
> que vimos no terminal. O front-end que vamos mostrar agora não depende
> desse back-end; ele usa dados de exemplo prontos para a demonstração."

---

## 4. Front-end — Síndico (1min)

**Tela:** login escolhendo o perfil "Síndico" → tela de elevadores → abrir um
elevador com chamado → clicar em "Abrir chamado" → responder algumas das 12
perguntas → tela de diagnóstico.

**Fala:**
> "Do lado do síndico, ele escolhe o elevador com problema e responde um
> questionário de 12 perguntas de sim, não ou não sei. Conforme ele
> responde, o sistema recalcula a confiança de cada possível falha — se
> algum problema já ficar claro, o questionário para antes de terminar as
> 12 perguntas. No final, aparece o diagnóstico com o nível de confiança,
> as probabilidades por causa e as peças sugeridas, além de uma explicação
> de quais respostas mais pesaram nessa conclusão."

---

## 5. Front-end — Central (1min)

**Tela:** login como "Central OTIS" → painel (mostrando os indicadores e a
lista de chamados recentes, sem Fleet Health) → tela de chamados → abrir um
chamado pelo botão ao lado de "Detalhes" → responder o questionário →
atribuir um técnico.

**Fala:**
> "A Central acompanha todos os condomínios de uma região: quantos
> elevadores estão em cada nível de risco, os chamados recentes e a
> prioridade da carteira. A Central também pode abrir um chamado direto
> pelo site, usando o mesmo questionário de 12 perguntas do síndico — e,
> depois do diagnóstico, escolhe qual técnico vai atender, já vendo a carga
> de chamados de cada um."

---

## 6. Front-end — Técnico (1min)

**Tela:** login como "Técnico" → agenda com a aba "Urgentes" (mostrando só
os chamados atribuídos a ele) → abrir um chamado → confirmar saída → tela
de finalizar chamado, preenchendo resultado e observações → salvar feedback.

**Fala:**
> "O técnico só enxerga os chamados atribuídos a ele. Ele não tem opção de
> 'aceitar' — só de confirmar que está saindo para o atendimento, o que já
> atualiza a situação para a Central acompanhar. O chamado só é considerado
> concluído depois que o técnico registra o feedback: se resolveu ou não, se
> o diagnóstico estava certo e quais peças usou."

---

## 7. Encerramento (15s)

**Tela:** volta para o login ou para um slide final com o nome do projeto.

**Fala:**
> "O código completo está no GitHub. Todo o projeto — front-end, motor de
> diagnóstico e back-end — usa só o que foi visto no 2º semestre: sem
> bibliotecas externas de dados, sem banco de dados, sem inteligência
> artificial. Obrigado!"
