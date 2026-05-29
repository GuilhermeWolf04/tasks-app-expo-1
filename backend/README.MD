[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

# Tasks App Backend

Este projeto é o backend da aplicação de gerenciamento de tarefas, desenvolvido utilizando Node, Express e SQLite (banco de dados dinâmico em memória).

## Autores

- [@renanalencar](https://www.github.com/renanalencar)

## Instalação

Na raiz do projeto, instale as dependências executando:

```bash
  npm install
```
    
## Como executar

Para rodar o servidor localmente (por padrão ele será aberto na porta 5000):

```bash
  npm start
```

> **Aviso:** Como o banco utiliza SQLite em memória (`:memory:`), todo o progresso será apagado caso você reinicie o servidor. No entanto, o sistema também é programado para criar imediatamente 10 tarefas pré-existentes de exemplo na inicialização, ajudando nos testes de front-end.


## Stack utilizada

**Back-end:** Node, Express e SQLite3


## Documentação da API

#### Retorna todas as tarefas

```http
  GET /
```

Não solicita nenhum parâmetro. Retorna um array com o objeto de todas as tarefas existentes.

#### Salva uma tarefa

```http
  POST /save
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `text`      | `string`   | **Obrigatório**. A descrição/título da nova tarefa |
| `dueDate`   | `string`   | A data de prazo de conclusão no formato ISO (ex: `"2026-12-31T23:59:59.000Z"`) |
| `completed` | `boolean`  | Status verdadeiro ou falso da tarefa (Opcional, por padrão é criado como `false`) |

#### Atualiza uma tarefa

```http
  POST /update
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `_id`       | `number`   | **Obrigatório**. O ID da tarefa que será modificada |
| `text`      | `string`   | A nova descrição/título da tarefa |
| `dueDate`   | `string`   | O novo prazo de conclusão para a tarefa |
| `completed` | `boolean`  | Se a tarefa agora mudou seu estado de conclusão |

#### Apaga uma tarefa

```http
  POST /delete
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `_id`       | `number`   | **Obrigatório**. O ID (inteiro) da tarefa que você deseja apagar |


## Referência / Projeto de Origem

 - [Full Stack ToDo App | Node, React, Express, MongoDB Tutorial](https://thebravecoders.com/full-stack-todo-app)