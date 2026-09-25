(() => {
  const tokenKey = "demandas-github-token";
  const loginForm = document.querySelector("#loginForm");
  if (!loginForm || !document.querySelector("#configBtn")) return;
  const dialog = document.createElement("dialog");
  dialog.id = "githubTokenDialog";
  dialog.innerHTML = [
    '<form method="dialog" class="github-token-form"><h2>Conectar ao GitHub</h2>',
    '<p id="githubTokenHelp"></p><label for="githubTokenInput">Token pessoal do GitHub</label>',
    '<input id="githubTokenInput" type="password" autocomplete="off" spellcheck="false" required>',
    '<label class="github-token-remember"><input id="githubTokenRemember" type="checkbox" checked> Salvar neste navegador para usar em outras abas</label>',
    '<p class="github-token-warning">O token será salvo apenas neste navegador, não no repositório. Não o compartilhe. O conteúdo do repositório é público.</p>',
    '<div class="github-token-actions"><button type="button" data-token-action="remove">Remover token</button><button type="button" data-token-action="cancel">Cancelar</button><button type="submit">Salvar token</button></div>',
    '<p id="githubTokenError" role="status" hidden></p></form>'
  ].join("");
  dialog.style.cssText = "max-width:min(92vw,480px);border:0;border-radius:16px;padding:24px;box-shadow:0 18px 60px #10243344;color:#18303b";
  const style = document.createElement("style");
  style.textContent = ".github-token-form{display:grid;gap:12px;font:14px system-ui,sans-serif}.github-token-form h2,.github-token-form p{margin:0}.github-token-form p{line-height:1.5}.github-token-form label{font-weight:600}.github-token-form input[type=password]{box-sizing:border-box;width:100%;padding:11px;border:1px solid #b8c3cd;border-radius:8px}.github-token-form .github-token-remember{display:flex;align-items:center;gap:8px}.github-token-warning{color:#586c76;font-size:12px}.github-token-actions{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:8px;margin-top:6px}.github-token-actions button{padding:9px 12px;border:1px solid #b8c3cd;border-radius:8px;background:white;cursor:pointer}.github-token-actions button[type=submit]{background:#176b59;border-color:#176b59;color:white}#githubTokenError{color:#a22}#githubTokenDialog::backdrop{background:#10243388}";
  document.head.append(style);
  document.body.append(dialog);
  const input = dialog.querySelector("#githubTokenInput");
  const remember = dialog.querySelector("#githubTokenRemember");
  const help = dialog.querySelector("#githubTokenHelp");
  let purpose = "settings";
  function openTokenDialog(forLogin) {
    purpose = forLogin ? "login" : "settings";
    help.textContent = "Cole o token novo da conta MarquesiasoTerceiro, limitado a gestao-demandas-app, com permissão Contents: Read and write.";
    input.value = ""; remember.checked = true;
    dialog.querySelector('[data-token-action="remove"]').hidden = forLogin;
    dialog.showModal(); input.focus();
  }
  document.addEventListener("submit", (event) => {
    if (event.target !== loginForm || localStorage.getItem(tokenKey) || sessionStorage.getItem(tokenKey)) return;
    event.preventDefault(); event.stopImmediatePropagation(); openTokenDialog(true);
  }, true);
  document.addEventListener("click", (event) => {
    if (!event.target.closest("#configBtn")) return;
    event.preventDefault(); event.stopImmediatePropagation(); openTokenDialog(false);
  }, true);
  dialog.querySelector('[data-token-action="cancel"]').addEventListener("click", () => dialog.close());
  dialog.querySelector('[data-token-action="remove"]').addEventListener("click", () => {
    localStorage.removeItem(tokenKey); sessionStorage.removeItem(tokenKey); dialog.close();
    if (typeof window.loadData === "function") window.loadData();
  });
  dialog.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault(); const value = input.value.trim(); if (!value) return;
    if (remember.checked) { localStorage.setItem(tokenKey, value); sessionStorage.removeItem(tokenKey); }
    else { sessionStorage.setItem(tokenKey, value); localStorage.removeItem(tokenKey); }
    dialog.close();
    if (purpose === "login") loginForm.requestSubmit();
    else if (typeof window.loadData === "function") window.loadData();
  });
})();
