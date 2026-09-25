(() => {
  const owner = "MarquesiasoTerceiro";
  const repo = "gestao-demandas-app";
  const branch = "main";
  const tokenKey = "demandas-github-token";
  const endpoint = `https://api.github.com/repos/${owner}/${repo}/contents/`;
  const token = () => localStorage.getItem(tokenKey) || sessionStorage.getItem(tokenKey);
  const encode = (text) => {
    const bytes = new TextEncoder().encode(text);
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary);
  };
  const decode = (content) => {
    const binary = atob(content.replace(/\s/g, ""));
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  };
  async function github(path, options = {}) {
    const headers = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token() ? { Authorization: `Bearer ${token()}` } : {})
    };
    const response = await fetch(path, { ...options, headers: { ...headers, ...(options.headers || {}) } });
    const body = response.status === 204 ? null : await response.json().catch(() => null);
    if (!response.ok) {
      const error = new Error(body?.message || `GitHub respondeu HTTP ${response.status}.`);
      error.status = response.status;
      throw error;
    }
    return body;
  }
  async function readFile(name) {
    try {(() => {
  const owner = "MarquesiasoTerceiro";
  const repo = "gestao-demandas-app";
  const branch = "main";
  const tokenKey = "demandas-github-token";
  const endpoint = `https://api.github.com/repos/${owner}/${repo}/contents/`;
  const token = () => sessionStorage.getItem(tokenKey);
  const encode = (text) => {
    const bytes = new TextEncoder().encode(text);
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary);
  };
  const decode = (content) => {
    const binary = atob(content.replace(/\s/g, ""));
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  };
  async function github(path, options = {}) {
    const headers = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token() ? { Authorization: `Bearer ${token()}` } : {})
    };
    const response = await fetch(path, { ...options, headers: { ...headers, ...(options.headers || {}) } });
    const body = response.status === 204 ? null : await response.json().catch(() => null);
    if (!response.ok) {
      const error = new Error(body?.message || `GitHub respondeu HTTP ${response.status}.`);
      error.status = response.status;
      throw error;
    }
    return body;
  }
  async function readFile(name) {
    try {
      const file = await github(`${endpoint}${name}?ref=${branch}`);
      return { data: JSON.parse(decode(file.content)), sha: file.sha };
    } catch (error) {
      if (error.status === 404) return { data: [], sha: null };
      throw error;
    }
  }
  async function writeFile(name, data, sha) {
    const file = await github(`${endpoint}${name}`, {
      method: "PUT",
      body: JSON.stringify({
        message: `Atualiza ${name} pelo app de demandas`,
        content: encode(`${JSON.stringify(data, null, 2)}\n`),
        ...(sha ? { sha } : {}),
        branch
      })
    });
    return file.content.sha;
  }
  function checkVersion(expected, actual) {
    if (expected && expected !== actual) {
      const error = new Error("O JSON foi alterado por outra pessoa. Recarregue os dados e tente novamente.");
      error.status = 409;
      throw error;
    }
  }
  window.api = async (path, options = {}) => {
    if (path === "/api/load") {
      const [demands, log] = await Promise.all([readFile("demandas.json"), readFile("log.json")]);
      return { data: { demandas: demands.data, log: log.data, versions: { demandas: demands.sha, log: log.sha } } };
    }
    if (!token()) throw new Error("Entre com um token GitHub com acesso de escrita ao repositório.");
    const input = JSON.parse(options.body || "{}");
    if (path === "/api/demands") {
      const file = await readFile("demandas.json");
      checkVersion(input.expectedSha, file.sha);
      const demands = Array.isArray(file.data) ? file.data : [];
      const id = input.demand.activityId || input.demand.id;
      const index = demands.findIndex((item) => (item.activityId || item.id) === id);
      if (index < 0) demands.unshift(input.demand);
      else demands[index] = input.demand;
      const version = await writeFile("demandas.json", demands, file.sha);
      return { demand: input.demand, version };
    }
    if (path === "/api/log") {
      const file = await readFile("log.json");
      checkVersion(input.expectedSha, file.sha);
      const entries = Array.isArray(file.data) ? file.data : [];
      entries.unshift(input.entry);
      const version = await writeFile("log.json", entries, file.sha);
      return { entry: input.entry, version };
    }
    if (path === "/api/transfer") {
      const [demandsFile, logFile] = await Promise.all([readFile("demandas.json"), readFile("log.json")]);
      checkVersion(input.expectedDemandSha, demandsFile.sha);
      checkVersion(input.expectedLogSha, logFile.sha);
      const demand = demandsFile.data.find((item) => (item.activityId || item.id) === input.activityId);
      if (!demand) throw new Error("Demanda não encontrada no JSON.");
      demand.developer = input.destination;
      demand.assignee = input.destination;
      const demandsVersion = await writeFile("demandas.json", demandsFile.data, demandsFile.sha);
      const log = Array.isArray(logFile.data) ? logFile.data : [];
      log.unshift(input.entry);
      const logVersion = await writeFile("log.json", log, logFile.sha);
      return { versions: { demandas: demandsVersion, log: logVersion } };
    }
    throw new Error(`Operação GitHub não suportada: ${path}`);
  };
  const login = document.querySelector("#loginForm");
  login.addEventListener("submit", (event) => {
    if (token()) return;
    const value = window.prompt("Cole seu token pessoal do GitHub. Ele será mantido apenas nesta sessão do navegador, não será publicado nem salvo nos arquivos do site. Precisa de Contents: Read and write no repositório MarquesiasoTerceiro/gestao-demandas-app.");
    if (!value?.trim()) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    sessionStorage.setItem(tokenKey, value.trim());
  }, true);
  const configButton = document.querySelector("#configBtn");
  configButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    const value = window.prompt("Informe o token GitHub para esta sessão. Deixe vazio para remover o token.", "");
    if (value === null) return;
    if (value.trim()) sessionStorage.setItem(tokenKey, value.trim());
    else sessionStorage.removeItem(tokenKey);
    if (token()) window.loadData();
  }, true);
  const connection = document.querySelector(".sidebar-footer span:nth-child(2)");
  if (connection) connection.textContent = "GitHub conectado";
})();
