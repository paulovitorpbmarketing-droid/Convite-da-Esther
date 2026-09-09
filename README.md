# Convite de 1 aninho — Esther Vitória

Site estático para GitHub Pages com confirmação de presença gravada em Google Sheets via Google Apps Script.

## Dados atuais

- Nome: Esther Vitória
- Idade: 1 aninho
- Data: 02/10/2026
- Horário: em breve
- Local: em breve
- Tema: rosa e branco
- Foto: ainda não definida

## Onde alterar os dados

Edite `js/config.js`.

Quando houver local, horário ou foto, basta preencher os campos correspondentes. Para a foto, envie o arquivo para `assets/foto-bebe.jpg` e use:

```js
babyPhoto: "assets/foto-bebe.jpg"
```

## Configurar o RSVP

1. Crie uma Planilha Google vazia.
2. Copie o ID da planilha, que fica na URL entre `/d/` e `/edit`.
3. Na planilha, abra **Extensões > Apps Script**.
4. Cole o conteúdo do arquivo `apps-script.gs`.
5. Troque `COLE_AQUI_O_ID_DA_PLANILHA` pelo ID real.
6. Salve e implante como **Aplicativo da Web**.
7. Configure o script para executar como o proprietário e permitir acesso aos convidados.
8. Copie a URL final que termina em `/exec`.
9. Abra `js/config.js` e cole essa URL em `rsvpEndpoint`.

A aba `Confirmacoes` será criada automaticamente no primeiro envio com as colunas:

`Data/Hora | Nome | Presença | Adultos | Crianças | Total | Recado | Origem`

### Fórmulas úteis no Google Sheets

Total confirmado:

```text
=SOMASE(C:C;"Sim";F:F)
```

Adultos:

```text
=SOMASE(C:C;"Sim";D:D)
```

Crianças:

```text
=SOMASE(C:C;"Sim";E:E)
```

## Publicar no GitHub Pages

Abra **Settings > Pages** no repositório e publique a branch `main` pela pasta `/ (root)`.

A planilha deve permanecer privada. O repositório público contém apenas o site e o código genérico de integração; não coloque dados privados nele.
