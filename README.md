# Gestao de Demandas

Este site usa GitHub Pages para exibir o app e a API de conteudo do GitHub para gravar dados em `demandas.json` e `log.json` na raiz deste repositorio (`MarquesiasoTerceiro/gestao-demandas-app`, branch `main`). Cada gravacao cria um commit no repositorio.

## Primeiro acesso

1. Crie um fine-grained personal access token para a conta `MarquesiasoTerceiro`, limitado a este repositorio e com permissao **Contents: Read and write** (Metadata: read-only e necessario pelo GitHub).
2. Abra o site e entre com seu usuario. Na primeira entrada, cole o token na tela. Por padrao, ele fica no `localStorage` deste navegador para funcionar em outras abas; desmarque a opcao para limitar o token ao `sessionStorage` daquela aba. O token nao e incluido nos arquivos do site.
3. Use o icone de engrenagem para trocar ou remover o token. Remover apaga o token dos dois armazenamentos.

O repositorio e publico: os arquivos JSON e seu conteudo podem ser lidos por qualquer pessoa. Nao grave informacoes sensiveis. Nunca inclua o token nos arquivos, issues ou commits; revogue-o no GitHub ao terminar os testes.

As alteracoes concorrentes nos JSON sao detectadas por SHA; se houver conflito, recarregue os dados e tente novamente.
