📰 Coleta Automatizada de Notícias – New York Times

Este projeto consiste em um script em Node.js que realiza a coleta automatizada de notícias do New York Times (NYTimes) com base em um tema informado pelo usuário.
As notícias coletadas são exportadas para um arquivo Excel (.xlsx), contendo título, data de publicação e descrição.

O sistema utiliza a API oficial do New York Times (Article Search API), garantindo estabilidade, confiabilidade e conformidade com os termos de uso do serviço.

----------------------------------------------------------------------------------------------------------------------------------------
📌 Funcionalidades

🔍 Busca de notícias por tema

📰 Coleta de múltiplas páginas de resultados

🚫 Filtragem de conteúdos não jornalísticos (ex.: Wordle / Games)

📅 Conversão de datas para o formato YYYY-MM-DD

📊 Exportação dos resultados para arquivo Excel

🧠 Tratamento de limite de requisições (erro 429 – rate limit)

💬 Interação via terminal (entrada de tema pelo usuário)

----------------------------------------------------------------------------------------------------------------------------------------

🛠️ Tecnologias Utilizadas

Node.js

Axios – Requisições HTTP

ExcelJS – Geração de arquivos .xlsx

dotenv – Gerenciamento de variáveis de ambiente

New York Times Article Search API

----------------------------------------------------------------------------------------------------------------------------------------

📁 Estrutura do Projeto
nytimes-coleta/
├── src/
│   ├── index.js
│   └── utils/
│       ├── httpClient.js
│       └── formatDate.js
├── output/
│   └── (arquivos .xlsx gerados)
├── .env
├── package.json
└── README.md

----------------------------------------------------------------------------------------------------------------------------------------

⚙️ Pré-requisitos

Node.js (versão 18 ou superior recomendada)

Conta no New York Times Developers

🔑 Configurações Necessárias
1️⃣ Criar uma API Key do NYTimes

Acesse: https://developer.nytimes.com/

Crie uma conta

Ative a Article Search API

Copie sua API Key

2️⃣ Configurar variáveis de ambiente

Crie um arquivo chamado .env na raiz do projeto:

NYT_API_KEY=SUA_API_KEY_AQUI

----------------------------------------------------------------------------------------------------------------------------------------

📌 Importante:
Nunca versionar o arquivo .env.
Inclua-o no .gitignore se estiver usando Git.

📦 Instalação das Dependências

No diretório raiz do projeto, execute:

npm install


Isso instalará todas as dependências necessárias listadas no package.json.

----------------------------------------------------------------------------------------------------------------------------------------

▶️ Execução do Script
Opção 1 – Informar o tema diretamente
node src/index.js economia

node src/index.js "economia"

Opção 2 – Informar o tema via terminal (interativo)
node src/index.js

O programa solicitará:

Informe o tema para pesquisa:

Comportamentos esperados

Se o tema for informado corretamente, o script inicia a coleta

Se nenhum tema for informado, o programa encerra informando que não há resultados

Caso não sejam encontradas 50 notícias, o sistema informa quantas foram coletadas

Exemplo:

Não foi possível encontrar 50 notícias para o tema "economia". Encontrado apenas 37.

Arquivo de Saída

Os arquivos Excel são gerados na pasta /Noticias, na raiz do projeto

Nome do arquivo:

noticias-<tema>.xlsx


Exemplo:

noticias-economia.xlsx

----------------------------------------------------------------------------------------------------------------------------------------

Observações Técnicas

A API do NYTimes retorna no máximo 10 resultados por página

Para evitar erros de limite de requisição (HTTP 429), o sistema:

Limita o número de páginas buscadas

Insere atrasos entre requisições

Implementa retry automático com backoff exponencial

A filtragem de conteúdos não jornalísticos é feita na camada de aplicação