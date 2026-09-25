(() => {
  const tokenKey = "demandas-github-token";
  const loginForm = document.querySelector("#loginForm");
  const configButton = document.querySelector("#configBtn");
  if (!loginForm || !configButton) return;

  const dialog = document.createElement("dialog");
  dialog.id = "githubTokenDialog";
  dialog.innerHTML = `
    <form method="dialog" class="github-token-form">
      <h2>Conectar ao GitHub</h2>
      <p id="githubTokenHelp">Informe um fine-grained token com acesso ao repositório MarquesiasoTerceiro/gestao-demandas-app e permissão Contents: Read and write.</p>
      <label for="githubTokenInput">Token pessoal do GitHub</label>
      <input id="githubTokenInput" type="password" autocomplete="off" spellcheck="false" required>
      <p class="github-token-warning">O token fica nesta aba enquanto ela estiver aberta. Não o compartilhe. O conteúdo deste repositório é público.</p>
      <div class="github-token-actions">
        <button type="button" data-token-action="remove">Remover token</button>
        <button type="button" data-token-action="cancel">Cancelar</button>
        <button type="submit">Salvar token</button>
      </div>
      <p id="githubTokenError" role="status" hidden></p>
    </form>`;
  dialog.style.cssText = "max-width: min(92vw, 480px); border: 0; border-radius: 16px; padding: 24px; box-shadow: 0 18px 60px #10243344; color: #18303b;";
  const style = document.createElement("style");
  style.textContent = `
    .github-token-form { display:grid; gap:12px; font:14px system-ui,sans-serif; }
    .github-token-form h2 { margin:0; font-size:22px; }
    .github-token-form p { margin:0; line-height:1.5; }
    .github-token-form label { font-weight:600; }
    .github-token-form input { box-sizing:border-box; width:100%; padding:11px; border:1px solid #b8c3cd; border-radius:8px; }
    .github-token-warning { color:#586c76; font-size:12px; }
    .github-token-actions { display:flex; flex-wrap:wrap; justify-content:flex-end; gap:8px; margin-top:6px; }
    .github-token-actions button { padding:9px 12px; border:1px solid #b8c3cd; border-radius:8px; background:white; cursor:pointer; }
    .github-token-actions button[type=submit] { background:#176b59; border-color:#176b59; color:white; }
    #githubTokenError { color:#a22; }
    #githubTokenDialog::backdrop { background:#10243388; }`;
  document.head.append(style);
  document.body.append(dialog);

  const input = dialog.querySelector("#githubTokenInput");
  const help = dialog.querySelector("#githubTokenHelp");
  let purpose = "settings";
  function openTokenDialog(forLogin) {
    purpose = forLogin ? "login" : "settings";
    help.textContent = forLogin
      ? "Para entrar e salvar dados, informe um fine-grained token da conta MarquesiasoTerceiro, limitado a gestao-demandas-app, com Contents: Read and write."
      : "Cole o token novo para substituir o atual. Ele precisa pertencer a MarquesiasoTerceiro, ter acesso a gestao-demandas-app e permissão Contents: Read and write.";
    input.value = "";
    dialog.querySelector('[data-token-action="remove"]').hidden = forLogin;
    dialog.querySelector("#githubTokenError").hidden = true;
    dialog.showModal();
    input.focus();
  }

  document.addEventListener("submit", (event) => {
    if (event.target !== loginForm || sessionStorage.getItem(tokenKey)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    openTokenDialog(true);
  }, true);

  document.addEventListener("click", (event) => {
    const button = event.target.closest("#configBtn");
    if (!button) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    openTokenDialog(false);
  }, true);

  dialog.querySelector('[data-token-action="cancel"]').addEventListener("click", () => dialog.close());
  dialog.querySelector('[data-token-action="remove"]').addEventListener("click", () => {
    sessionStorage.removeItem(tokenKey);
    dialog.close();
    if (typeof window.loadData === "function") window.loadData();
  });
  dialog.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
    const value = input.value.trim();
    if (!value) return;
    sessionStorage.setItem(tokenKey, value);
    dialog.close();
    if (purpose === "login") loginForm.requestSubmit();
    else if (typeof window.loadData === "function") window.loadData();
  });
})();
