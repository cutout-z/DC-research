/* Static export only: the capex return model's controls, run in the reader's browser.

   The model's controls are sliders, so the export cannot pre-render every state the way static-export.js
   expects. Instead a control change inside [data-static-live] is answered here: on the first change this loads
   Pyodide (Python in WebAssembly, vendored under static/vendor/pyodide/: about 6 MB to download gzipped, 13 MB if not, once), the
   model's own source, templates and inputs (capex-model-live.zip, written by scripts/export_static.py from
   app/capex_model/live.py), and from then on renders the region with the same Python the app's
   /partials/capex-return-model route runs: live.render(). The result is swapped in by htmx, as a response
   would be, so the page's chart drawing (htmx:afterSettle in base.html) follows.

   static-export.js leaves these requests alone (it checks the same attribute). Nothing leaves the browser
   after the files load: no request carries the reader's settings. */
(function () {
  "use strict";
  const BASE = (document.currentScript && document.currentScript.dataset.base) || "/";
  const VENDOR = BASE + "static/vendor/pyodide/";
  const say = (box, text) => { if (box) { box.textContent = text || ""; box.hidden = !text; } };
  let ready = null;   // one load per page, shared by every change

  function script(src) {
    return new Promise((ok, fail) => {
      const s = document.createElement("script");
      s.src = src; s.onload = ok; s.onerror = () => fail(new Error("could not load " + src));
      document.head.appendChild(s);
    });
  }

  async function load() {
    await script(VENDOR + "pyodide.js");
    const py = await window.loadPyodide({ indexURL: VENDOR });
    // Jinja2 and MarkupSafe from Pyodide's own lock (hash-checked); Markdown is pure Python, loaded by its wheel.
    await py.loadPackage(["jinja2", "markupsafe", VENDOR + "Markdown-3.4.1-py3-none-any.whl"]);
    const res = await fetch(BASE + "capex-model-live.zip");
    if (!res.ok) throw new Error("capex-model-live.zip: " + res.status);
    py.unpackArchive(await res.arrayBuffer(), "zip", { extractDir: "/bundle" });
    py.runPython([
      "import os, sys",
      "os.environ['AIDC_DATA_ROOT'] = '/bundle'",
      "sys.path.insert(0, '/bundle')",
      "from pathlib import Path",
      "from app.capex_model import live",
      "ENV = live.environment(Path('/bundle/templates'))",
    ].join("\n"));
    window.CAPEX_MODEL_LIVE.loaded = true;
    return py;
  }

  async function run(elt, params) {
    const box = document.querySelector("[data-crm-status]");
    const first = !ready;
    say(box, first ? box && box.dataset.loading : box && box.dataset.working);
    try {
      ready = ready || load();
      const py = await ready;
      py.globals.set("QP", py.toPy(params));
      const html = py.runPython("live.render(QP, ENV)");
      window.CAPEX_MODEL_LIVE.renders += 1;
      window.CAPEX_MODEL_LIVE.last = params;
      // eventInfo as a response's swap carries it: the page's htmx:afterSwap listeners read detail.target.
      const target = document.querySelector("#crm");
      htmx.swap(target, html, { swapStyle: "outerHTML" }, { eventInfo: { elt, target } });
    } catch (err) {
      if (first) ready = null;   // a failed load may be retried by the next change
      window.CAPEX_MODEL_LIVE.error = String(err);
      console.error("capex model:", err);
      say(document.querySelector("[data-crm-status]"), box && box.dataset.failed);
    }
  }

  window.CAPEX_MODEL_LIVE = { renders: 0, loaded: false };
  document.addEventListener("htmx:configRequest", e => {
    const d = e.detail;
    if (d.verb !== "get" || !d.elt || !d.elt.closest("[data-static-live]")) return;
    e.preventDefault();
    const params = {};
    for (const [k, v] of d.formData.entries()) params[k] = String(v);
    run(d.elt, params);
  });
})();
