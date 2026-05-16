(function () {
  const D = window.ReliableDashboard;
  const pageId = window.ReliablePageId;
  const inputClass = "h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100";
  const areaClass = "min-h-32 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100";
  const labelClass = "mb-2 block text-sm font-bold text-slate-700";
  const buttonClass = "inline-flex h-12 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-extrabold text-white transition hover:bg-blue-700";
  const cardClass = "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6";

  function optionList(items, placeholder) {
    return `<option value="">${placeholder}</option>${items.map((item) => `<option value="${item}">${item}</option>`).join("")}`;
  }

  function historyTable(headers, bodyId) {
    return `
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead><tr class="border-b text-left text-slate-500">${headers.map((header) => `<th class="whitespace-nowrap px-3 py-3">${header}</th>`).join("")}</tr></thead>
          <tbody id="${bodyId}"></tbody>
        </table>
      </div>
    `;
  }

  function pageIntro(kicker, title, tag) {
    return `
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div><p class="text-sm font-bold text-slate-500">${kicker}</p><h2 class="mt-1 text-2xl font-extrabold text-slate-900">${title}</h2></div>
        ${tag ? `<span class="rounded-full bg-blue-50 px-3 py-1 text-xs font-extrabold text-blue-700">${tag}</span>` : ""}
      </div>
    `;
  }

  function renderGenericRows(target, rows, cells) {
    const safeRows = Array.isArray(rows) ? rows : [];
    if (!safeRows.length) {
      target.innerHTML = `
        <tr>
          <td colspan="${cells.length}" class="px-3 py-8 text-center text-sm font-bold text-slate-500">No records yet.</td>
        </tr>
      `;
      return;
    }

    target.innerHTML = safeRows.map((row) => `
      <tr class="border-b border-slate-100 last:border-0">
        ${cells.map((cell) => `<td class="whitespace-nowrap px-3 py-3 ${cell.className || ""}">${cell.render(row)}</td>`).join("")}
      </tr>
    `).join("");
  }

  const pages = {
    "social-boost": {
      active: "social-boost",
      title: "Social Boost",
      mobileTitle: "Social Boost",
      content() {
        return `
          <section class="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
            <div class="${cardClass}">
              ${pageIntro("New Order", "Boost a social post", "Frontend Preview")}
              <form id="socialForm" class="mt-6 grid gap-5 sm:grid-cols-2">
                <div><label for="platform" class="${labelClass}">Platform</label><select id="platform" class="${inputClass}">${optionList(["Instagram", "TikTok", "YouTube", "Facebook"], "Select platform")}</select></div>
                <div><label for="service" class="${labelClass}">Service</label><select id="service" class="${inputClass}">${optionList(["Followers", "Likes", "Views", "Comments"], "Select service")}</select></div>
                <div><label for="quantity" class="${labelClass}">Quantity</label><input id="quantity" type="number" min="50" step="10" placeholder="1000" class="${inputClass}" /></div>
                <div><label for="targetLink" class="${labelClass}">Post or Profile Link</label><input id="targetLink" type="url" placeholder="https://instagram.com/..." class="${inputClass}" /></div>
                <div id="socialMessage" class="hidden sm:col-span-2"></div>
                <button type="submit" class="${buttonClass} sm:col-span-2">Submit Order</button>
              </form>
            </div>
            <aside class="space-y-5">
              <section class="${cardClass}">
                <p class="text-sm font-bold text-slate-500">Price Preview</p>
                <h3 id="socialTotal" class="mt-3 text-4xl font-extrabold text-slate-900">&#8358;0</h3>
                <div class="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
                  <div class="flex justify-between gap-4"><span class="font-bold text-slate-500">Rate</span><span id="socialRate" class="font-extrabold text-slate-900">Select service</span></div>
                  <div class="mt-3 flex justify-between gap-4"><span class="font-bold text-slate-500">Delivery</span><span class="font-extrabold text-slate-900">Gradual</span></div>
                  <div class="mt-3 flex justify-between gap-4"><span class="font-bold text-slate-500">Wallet</span><span id="socialWallet" class="font-extrabold text-slate-900">&#8358;0</span></div>
                </div>
              </section>
              <section class="${cardClass}">
                <p class="text-sm font-bold text-slate-500">Popular Packages</p>
                <div class="mt-4 grid gap-3">
                  <button type="button" data-package="Instagram|Followers|1000" class="social-package rounded-xl border border-slate-200 px-4 py-3 text-left hover:border-blue-300 hover:bg-blue-50/50"><span class="block text-sm font-extrabold">Instagram Followers</span><span class="mt-1 block text-xs font-bold text-slate-500">1,000 followers from &#8358;1,200</span></button>
                  <button type="button" data-package="TikTok|Views|5000" class="social-package rounded-xl border border-slate-200 px-4 py-3 text-left hover:border-blue-300 hover:bg-blue-50/50"><span class="block text-sm font-extrabold">TikTok Views</span><span class="mt-1 block text-xs font-bold text-slate-500">5,000 views from &#8358;900</span></button>
                  <button type="button" data-package="YouTube|Likes|1000" class="social-package rounded-xl border border-slate-200 px-4 py-3 text-left hover:border-blue-300 hover:bg-blue-50/50"><span class="block text-sm font-extrabold">YouTube Likes</span><span class="mt-1 block text-xs font-bold text-slate-500">1,000 likes from &#8358;1,850</span></button>
                </div>
              </section>
            </aside>
          </section>
          <section class="mt-5 ${cardClass}">
            <div class="mb-5 flex flex-wrap items-center justify-between gap-3"><div><p class="text-sm font-bold text-slate-500">Orders</p><h3 class="mt-1 text-lg font-extrabold">Recent Social Boost Orders</h3></div><a href="transactions.html" class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-extrabold hover:bg-slate-50">View Transactions</a></div>
            ${historyTable(["Date", "Platform", "Service", "Quantity", "Amount", "Status"], "socialHistory")}
          </section>
        `;
      },
      init() {
        const rates = {
          Instagram: { Followers: 1200, Likes: 850, Views: 420, Comments: 2500 },
          TikTok: { Followers: 1050, Likes: 700, Views: 180, Comments: 2100 },
          YouTube: { Followers: 2400, Likes: 1850, Views: 650, Comments: 3200 },
          Facebook: { Followers: 1100, Likes: 780, Views: 350, Comments: 2200 },
        };
        const defaults = [];
        const els = {
          platform: document.getElementById("platform"),
          service: document.getElementById("service"),
          quantity: document.getElementById("quantity"),
          link: document.getElementById("targetLink"),
          total: document.getElementById("socialTotal"),
          rate: document.getElementById("socialRate"),
          wallet: document.getElementById("socialWallet"),
          message: document.getElementById("socialMessage"),
          history: document.getElementById("socialHistory"),
          form: document.getElementById("socialForm"),
        };
        const calc = () => {
          const rate = rates[els.platform.value]?.[els.service.value] || 0;
          const qty = Math.max(0, Number(els.quantity.value || 0));
          const total = rate && qty ? Math.ceil((qty / 1000) * rate) : 0;
          els.total.textContent = D.money(total);
          els.rate.textContent = rate ? `${D.money(rate)} per 1,000` : "Select service";
          els.wallet.textContent = D.money(D.readWallet());
          return total;
        };
        const render = () => {
          const rows = D.readJson("rs_social_orders", defaults);
          renderGenericRows(els.history, rows, [
            { render: (row) => row.date, className: "font-bold text-slate-700" },
            { render: (row) => row.platform, className: "font-extrabold text-slate-900" },
            { render: (row) => row.service },
            { render: (row) => Number(row.quantity).toLocaleString("en-NG") },
            { render: (row) => D.money(row.amount), className: "font-extrabold text-slate-900" },
            { render: (row) => `<span class="${D.badge(row.status)}">${D.normalizeStatus(row.status)}</span>` },
          ]);
        };
        ["change", "input"].forEach((eventName) => {
          [els.platform, els.service, els.quantity].forEach((el) => el.addEventListener(eventName, () => {
            D.clearMessage(els.message);
            calc();
          }));
        });
        document.querySelectorAll(".social-package").forEach((button) => {
          button.addEventListener("click", () => {
            const [platform, service, quantity] = button.dataset.package.split("|");
            els.platform.value = platform;
            els.service.value = service;
            els.quantity.value = quantity;
            calc();
          });
        });
        els.form.addEventListener("submit", (event) => {
          event.preventDefault();
          const total = calc();
          if (!els.platform.value || !els.service.value) return D.message(els.message, "error", "Select a platform and service.");
          if (Number(els.quantity.value) < 50) return D.message(els.message, "error", "Quantity must be at least 50.");
          if (!/^https?:\/\/.+\..+/i.test(els.link.value.trim())) return D.message(els.message, "error", "Enter a valid profile or post link.");
          const spend = D.spendWallet(total, {
            type: "Social Boost",
            description: `${els.platform.value} ${els.service.value} x${Number(els.quantity.value).toLocaleString("en-NG")}`,
          }, "Pending");
          if (!spend.ok) {
            calc();
            return D.message(els.message, "error", "Insufficient balance");
          }
          const order = { date: D.nowStamp(), reference: spend.transaction.reference, platform: els.platform.value, service: els.service.value, quantity: Number(els.quantity.value), amount: total, status: "Pending" };
          const rows = [order, ...D.readJson("rs_social_orders", defaults)].slice(0, 10);
          D.writeJson("rs_social_orders", rows);
          D.message(els.message, "success", "Social boost order submitted successfully.");
          els.form.reset();
          calc();
          render();
        });
        calc();
        render();
      },
    },

    "sms-verification": {
      active: "sms-verification",
      title: "SMS Verification",
      mobileTitle: "SMS Verification",
      content() {
        return `
          <section class="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
            <div class="${cardClass}">
              ${pageIntro("Virtual Number", "Get a number for OTP", "Demo Numbers")}
              <form id="smsForm" class="mt-6 grid gap-5 sm:grid-cols-2">
                <div><label for="smsCountry" class="${labelClass}">Country</label><select id="smsCountry" class="${inputClass}">${optionList(["Nigeria", "United States", "United Kingdom", "Ghana", "Kenya"], "Select country")}</select></div>
                <div><label for="smsService" class="${labelClass}">Service</label><select id="smsService" class="${inputClass}">${optionList(["WhatsApp", "Telegram", "Instagram", "Facebook", "Google"], "Select service")}</select></div>
                <div id="smsMessage" class="hidden sm:col-span-2"></div>
                <button type="submit" class="${buttonClass} sm:col-span-2">Get Number</button>
              </form>
            </div>
            <aside class="space-y-5">
              <section class="${cardClass}">
                <p class="text-sm font-bold text-slate-500">Price Preview</p>
                <h3 id="smsPrice" class="mt-3 text-4xl font-extrabold">&#8358;0</h3>
                <p id="smsHint" class="mt-2 text-sm font-bold text-slate-500">Select country and service</p>
              </section>
              <section id="otpPanel" class="${cardClass}">
                <p class="text-sm font-bold text-slate-500">OTP Waiting Section</p>
                <h3 id="otpNumber" class="mt-3 text-2xl font-extrabold text-slate-900">No number yet</h3>
                <div class="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
                  <p id="otpStatus" class="text-sm font-extrabold text-amber-700">Waiting for request</p>
                  <p id="otpCode" class="mt-2 text-3xl font-extrabold tracking-[0.18em] text-slate-900">------</p>
                </div>
              </section>
            </aside>
          </section>
          <section id="inbox" class="mt-5 ${cardClass}">
            <div class="mb-5"><p class="text-sm font-bold text-slate-500">Inbox</p><h3 class="mt-1 text-lg font-extrabold">Recent SMS Orders</h3></div>
            ${historyTable(["Date", "Country", "Service", "Number", "Price", "Status"], "smsHistory")}
          </section>
        `;
      },
      init() {
        const base = { Nigeria: 420, "United States": 850, "United Kingdom": 780, Ghana: 500, Kenya: 460 };
        const serviceExtra = { WhatsApp: 180, Telegram: 120, Instagram: 150, Facebook: 140, Google: 220 };
        const defaults = [];
        const country = document.getElementById("smsCountry");
        const service = document.getElementById("smsService");
        const priceEl = document.getElementById("smsPrice");
        const hint = document.getElementById("smsHint");
        const msg = document.getElementById("smsMessage");
        const historyEl = document.getElementById("smsHistory");
        const numberEl = document.getElementById("otpNumber");
        const statusEl = document.getElementById("otpStatus");
        const codeEl = document.getElementById("otpCode");
        const calc = () => {
          const price = country.value && service.value ? (base[country.value] + serviceExtra[service.value]) : 0;
          priceEl.textContent = D.money(price);
          hint.textContent = price ? `${service.value} number in ${country.value}` : "Select country and service";
          return price;
        };
        const render = () => {
          renderGenericRows(historyEl, D.readJson("rs_sms_history", defaults), [
            { render: (row) => row.date, className: "font-bold text-slate-700" },
            { render: (row) => row.country, className: "font-extrabold text-slate-900" },
            { render: (row) => row.service },
            { render: (row) => row.number },
            { render: (row) => D.money(row.price), className: "font-extrabold text-slate-900" },
            { render: (row) => `<span class="${D.badge(row.status)}">${D.normalizeStatus(row.status)}</span>` },
          ]);
        };
        [country, service].forEach((el) => el.addEventListener("change", () => {
          D.clearMessage(msg);
          calc();
        }));
        document.getElementById("smsForm").addEventListener("submit", (event) => {
          event.preventDefault();
          const price = calc();
          if (!country.value || !service.value) return D.message(msg, "error", "Select country and service.");
          const spend = D.spendWallet(price, {
            type: "SMS Verification",
            description: `${service.value} number in ${country.value}`,
          }, "Pending");
          if (!spend.ok) return D.message(msg, "error", "Insufficient balance");
          const prefixes = { Nigeria: "+234 803", "United States": "+1 646", "United Kingdom": "+44 7700", Ghana: "+233 54", Kenya: "+254 71" };
          const number = `${prefixes[country.value]} ${Math.floor(100000 + Math.random() * 899999)}`;
          numberEl.textContent = number;
          statusEl.textContent = "Waiting for OTP...";
          statusEl.className = "text-sm font-extrabold text-amber-700";
          codeEl.textContent = "------";
          const item = { date: D.nowStamp(), reference: spend.transaction.reference, country: country.value, service: service.value, number, price, status: "Pending" };
          D.writeJson("rs_sms_history", [item, ...D.readJson("rs_sms_history", defaults)].slice(0, 10));
          D.message(msg, "success", "Number reserved. OTP will appear in the waiting section.");
          render();
          setTimeout(() => {
            const code = String(Math.floor(100000 + Math.random() * 899999));
            codeEl.textContent = code;
            statusEl.textContent = "OTP received";
            statusEl.className = "text-sm font-extrabold text-emerald-700";
          }, 1800);
        });
        calc();
        render();
      },
    },

    "pay-bills": {
      active: "pay-bills",
      title: "Pay Bills",
      mobileTitle: "Pay Bills",
      content() {
        return `
          <section class="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
            <div class="${cardClass}">
              ${pageIntro("Utilities", "Pay utility bills", "Instant Receipt")}
              <form id="billForm" class="mt-6 grid gap-5 sm:grid-cols-2">
                <div><label for="billType" class="${labelClass}">Bill Type</label><select id="billType" class="${inputClass}">${optionList(["Electricity", "Cable TV", "Internet"], "Select bill type")}</select></div>
                <div><label for="billProvider" class="${labelClass}">Provider</label><select id="billProvider" class="${inputClass}"><option value="">Select bill type first</option></select></div>
                <div><label for="customerNumber" class="${labelClass}">Customer/Meter/Smartcard Number</label><input id="customerNumber" class="${inputClass}" placeholder="Enter customer number" /></div>
                <div><label for="billAmount" class="${labelClass}">Amount</label><input id="billAmount" type="number" min="100" step="50" class="${inputClass}" placeholder="5000" /></div>
                <div id="billMessage" class="hidden sm:col-span-2"></div>
                <button type="submit" class="${buttonClass} sm:col-span-2">Pay Bill</button>
              </form>
            </div>
            <aside class="${cardClass}">
              <p class="text-sm font-bold text-slate-500">Payment Preview</p>
              <h3 id="billTotal" class="mt-3 text-4xl font-extrabold">&#8358;0</h3>
              <div class="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
                <div class="flex justify-between gap-4"><span class="font-bold text-slate-500">Provider</span><span id="billProviderPreview" class="font-extrabold text-slate-900">Not selected</span></div>
                <div class="mt-3 flex justify-between gap-4"><span class="font-bold text-slate-500">Fee</span><span class="font-extrabold text-slate-900">&#8358;0</span></div>
                <div class="mt-3 flex justify-between gap-4"><span class="font-bold text-slate-500">Wallet</span><span id="billWallet" class="font-extrabold text-slate-900">&#8358;0</span></div>
              </div>
            </aside>
          </section>
          <section class="mt-5 ${cardClass}">
            <div class="mb-5"><p class="text-sm font-bold text-slate-500">Bills</p><h3 class="mt-1 text-lg font-extrabold">Recent Bill Payments</h3></div>
            ${historyTable(["Date", "Type", "Provider", "Customer", "Amount", "Status"], "billHistory")}
          </section>
        `;
      },
      init() {
        const providers = {
          Electricity: ["IKEDC", "EKEDC", "AEDC", "PHED", "KEDCO"],
          "Cable TV": ["DSTV", "GOtv", "Startimes"],
          Internet: ["Spectranet", "Smile", "Swift", "Tizeti"],
        };
        const defaults = [];
        const typeEl = document.getElementById("billType");
        const providerEl = document.getElementById("billProvider");
        const customerEl = document.getElementById("customerNumber");
        const amountEl = document.getElementById("billAmount");
        const totalEl = document.getElementById("billTotal");
        const walletEl = document.getElementById("billWallet");
        const providerPreview = document.getElementById("billProviderPreview");
        const msg = document.getElementById("billMessage");
        const historyEl = document.getElementById("billHistory");
        const update = () => {
          const amount = Number(amountEl.value || 0);
          totalEl.textContent = D.money(amount);
          walletEl.textContent = D.money(D.readWallet());
          providerPreview.textContent = providerEl.value || "Not selected";
        };
        typeEl.addEventListener("change", () => {
          providerEl.innerHTML = optionList(providers[typeEl.value] || [], "Select provider");
          D.clearMessage(msg);
          update();
        });
        [providerEl, amountEl].forEach((el) => el.addEventListener("input", update));
        [providerEl, amountEl].forEach((el) => el.addEventListener("change", update));
        const render = () => {
          renderGenericRows(historyEl, D.readJson("rs_bill_history", defaults), [
            { render: (row) => row.date, className: "font-bold text-slate-700" },
            { render: (row) => row.type, className: "font-extrabold text-slate-900" },
            { render: (row) => row.provider },
            { render: (row) => row.customer },
            { render: (row) => D.money(row.amount), className: "font-extrabold text-slate-900" },
            { render: (row) => `<span class="${D.badge(row.status)}">${D.normalizeStatus(row.status)}</span>` },
          ]);
        };
        document.getElementById("billForm").addEventListener("submit", (event) => {
          event.preventDefault();
          const amount = Number(amountEl.value || 0);
          if (!typeEl.value || !providerEl.value) return D.message(msg, "error", "Select bill type and provider.");
          if (customerEl.value.trim().length < 6) return D.message(msg, "error", "Enter a valid customer, meter, or smartcard number.");
          if (amount < 100) return D.message(msg, "error", "Amount must be at least \u20a6100.");
          const spend = D.spendWallet(amount, {
            type: "Bill Payment",
            description: `${providerEl.value} ${typeEl.value} payment`,
          }, "Successful");
          if (!spend.ok) {
            update();
            return D.message(msg, "error", "Insufficient balance");
          }
          const row = { date: D.nowStamp(), reference: spend.transaction.reference, type: typeEl.value, provider: providerEl.value, customer: customerEl.value.trim(), amount, status: "Successful" };
          D.writeJson("rs_bill_history", [row, ...D.readJson("rs_bill_history", defaults)].slice(0, 10));
          D.message(msg, "success", "Bill payment completed successfully.");
          document.getElementById("billForm").reset();
          providerEl.innerHTML = '<option value="">Select bill type first</option>';
          update();
          render();
        });
        update();
        render();
      },
    },

    "add-fund": {
      active: "add-fund",
      title: "Add Fund",
      mobileTitle: "Add Fund",
      content() {
        return `
          <section class="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
            <aside class="${cardClass}">
              <p class="text-sm font-bold text-slate-500">Wallet Balance</p>
              <h2 id="fundWallet" class="mt-3 text-4xl font-extrabold">&#8358;0</h2>
              <p class="mt-2 text-sm font-bold text-emerald-600">Available for all services</p>
            </aside>
            <div class="${cardClass}">
              ${pageIntro("Deposit", "Fund your wallet", "Frontend Only")}
              <form id="fundForm" class="mt-6 grid gap-5">
                <div><label for="fundAmount" class="${labelClass}">Amount</label><input id="fundAmount" type="number" min="500" step="100" class="${inputClass}" placeholder="5000" /></div>
                <div>
                  <p class="${labelClass}">Payment Method</p>
                  <div class="grid gap-3 sm:grid-cols-3">
                    <button type="button" data-method="Bank Transfer" class="fund-method rounded-xl border border-blue-500 bg-blue-50 p-4 text-left"><span class="block text-sm font-extrabold text-blue-700">Bank Transfer</span><span class="mt-1 block text-xs font-bold text-slate-500">Manual transfer</span></button>
                    <button type="button" data-method="Card Payment" class="fund-method rounded-xl border border-slate-200 p-4 text-left hover:border-blue-300"><span class="block text-sm font-extrabold">Card Payment</span><span class="mt-1 block text-xs font-bold text-slate-500">Visa or Mastercard</span></button>
                    <button type="button" data-method="USSD" class="fund-method rounded-xl border border-slate-200 p-4 text-left hover:border-blue-300"><span class="block text-sm font-extrabold">USSD</span><span class="mt-1 block text-xs font-bold text-slate-500">Bank code</span></button>
                  </div>
                </div>
                <div id="fundMessage" class="hidden"></div>
                <button type="submit" class="${buttonClass}">Deposit</button>
              </form>
            </div>
          </section>
          <section class="mt-5 ${cardClass}">
            <div class="mb-5"><p class="text-sm font-bold text-slate-500">Deposits</p><h3 class="mt-1 text-lg font-extrabold">Deposit History</h3></div>
            ${historyTable(["Date", "Method", "Amount", "Reference", "Status"], "fundHistory")}
          </section>
        `;
      },
      init() {
        const defaults = [];
        let selectedMethod = "Bank Transfer";
        const walletEl = document.getElementById("fundWallet");
        const amountEl = document.getElementById("fundAmount");
        const msg = document.getElementById("fundMessage");
        const historyEl = document.getElementById("fundHistory");
        const updateWallet = () => { walletEl.textContent = D.money(D.readWallet()); };
        const render = () => {
          renderGenericRows(historyEl, D.readJson("rs_fund_history", defaults), [
            { render: (row) => row.date, className: "font-bold text-slate-700" },
            { render: (row) => row.method, className: "font-extrabold text-slate-900" },
            { render: (row) => D.money(row.amount), className: "font-extrabold text-slate-900" },
            { render: (row) => row.ref },
            { render: (row) => `<span class="${D.badge(row.status)}">${D.normalizeStatus(row.status)}</span>` },
          ]);
        };
        document.querySelectorAll(".fund-method").forEach((button) => {
          button.addEventListener("click", () => {
            selectedMethod = button.dataset.method;
            document.querySelectorAll(".fund-method").forEach((item) => item.className = "fund-method rounded-xl border border-slate-200 p-4 text-left hover:border-blue-300");
            button.className = "fund-method rounded-xl border border-blue-500 bg-blue-50 p-4 text-left";
          });
        });
        document.getElementById("fundForm").addEventListener("submit", (event) => {
          event.preventDefault();
          const amount = Number(amountEl.value || 0);
          if (amount < 500) return D.message(msg, "error", "Deposit amount must be at least \u20a6500.");
          const transaction = D.depositWallet(amount, {
            type: "Wallet Deposit",
            description: selectedMethod,
          });
          const row = { date: D.nowStamp(), method: selectedMethod, amount, ref: transaction.reference, status: "Successful" };
          D.writeJson("rs_fund_history", [row, ...D.readJson("rs_fund_history", defaults)].slice(0, 10));
          D.message(msg, "success", `Wallet funded with ${D.money(amount)} using ${selectedMethod}.`);
          amountEl.value = "";
          updateWallet();
          render();
        });
        updateWallet();
        render();
      },
    },

    "sell-crypto": {
      active: "sell-crypto",
      title: "Sell Crypto",
      mobileTitle: "Sell Crypto",
      content() {
        return `
          <section class="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
            <div class="${cardClass}">
              ${pageIntro("Crypto Trade", "Sell crypto for naira", "Sample Rates")}
              <form id="cryptoForm" class="mt-6 grid gap-5 sm:grid-cols-2">
                <div><label for="cryptoAsset" class="${labelClass}">Crypto</label><select id="cryptoAsset" class="${inputClass}">${optionList(["USDT", "BTC", "ETH"], "Select crypto")}</select></div>
                <div><label for="cryptoNetwork" class="${labelClass}">Network</label><select id="cryptoNetwork" class="${inputClass}"><option value="">Select crypto first</option></select></div>
                <div><label for="cryptoAmount" class="${labelClass}">Amount</label><input id="cryptoAmount" type="number" min="0" step="0.0001" class="${inputClass}" placeholder="100" /></div>
                <div><label for="payoutAccount" class="${labelClass}">Bank or Wallet Note</label><input id="payoutAccount" class="${inputClass}" placeholder="Opay / GTBank / account note" /></div>
                <div id="cryptoMessage" class="hidden sm:col-span-2"></div>
                <button type="submit" class="${buttonClass} sm:col-span-2">Submit Trade</button>
              </form>
            </div>
            <aside class="space-y-5">
              <section class="${cardClass}">
                <p class="text-sm font-bold text-slate-500">Rate Preview</p>
                <h3 id="cryptoTotal" class="mt-3 text-4xl font-extrabold">&#8358;0</h3>
                <p id="cryptoRate" class="mt-2 text-sm font-bold text-slate-500">Select asset</p>
              </section>
              <section class="${cardClass}">
                <p class="text-sm font-bold text-slate-500">Deposit Address</p>
                <div class="mt-4 grid gap-4 sm:grid-cols-[140px_1fr]">
                  <div class="grid aspect-square place-items-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-xs font-extrabold text-slate-500">QR PLACEHOLDER</div>
                  <div class="rounded-xl border border-slate-200 bg-slate-50 p-4"><p id="cryptoAddress" class="break-all text-sm font-extrabold text-slate-800">Select crypto to show address</p><p class="mt-2 text-xs font-bold text-slate-500">Use this as a frontend placeholder only.</p></div>
                </div>
              </section>
            </aside>
          </section>
          <section class="mt-5 ${cardClass}">
            <div class="mb-5"><p class="text-sm font-bold text-slate-500">Trades</p><h3 class="mt-1 text-lg font-extrabold">Recent Crypto Trades</h3></div>
            ${historyTable(["Date", "Asset", "Network", "Amount", "Payout", "Status"], "cryptoHistory")}
          </section>
        `;
      },
      init() {
        const networks = { USDT: ["TRC20", "ERC20", "BEP20"], BTC: ["Bitcoin"], ETH: ["ERC20", "Arbitrum", "Base"] };
        const rates = { USDT: 1480, BTC: 93000000, ETH: 4500000 };
        const addresses = { USDT: "TRxReliablesocialsUSDTDepositOnly91", BTC: "bc1qreliablesocialssamplebtcaddress", ETH: "0xReliableSocialsSampleEthAddress" };
        const defaults = [];
        const asset = document.getElementById("cryptoAsset");
        const network = document.getElementById("cryptoNetwork");
        const amount = document.getElementById("cryptoAmount");
        const note = document.getElementById("payoutAccount");
        const total = document.getElementById("cryptoTotal");
        const rate = document.getElementById("cryptoRate");
        const address = document.getElementById("cryptoAddress");
        const msg = document.getElementById("cryptoMessage");
        const historyEl = document.getElementById("cryptoHistory");
        const update = () => {
          if (asset.value) {
            address.textContent = addresses[asset.value];
          }
          const payout = Number(amount.value || 0) * (rates[asset.value] || 0);
          total.textContent = D.money(payout);
          rate.textContent = asset.value ? `${asset.value} rate: ${D.money(rates[asset.value])}` : "Select asset";
          return payout;
        };
        const render = () => {
          renderGenericRows(historyEl, D.readJson("rs_crypto_history", defaults), [
            { render: (row) => row.date, className: "font-bold text-slate-700" },
            { render: (row) => row.asset, className: "font-extrabold text-slate-900" },
            { render: (row) => row.network },
            { render: (row) => Number(row.amount).toLocaleString("en-NG") },
            { render: (row) => D.money(row.payout), className: "font-extrabold text-slate-900" },
            { render: (row) => `<span class="${D.badge(row.status)}">${D.normalizeStatus(row.status)}</span>` },
          ]);
        };
        asset.addEventListener("change", () => {
          network.innerHTML = optionList(networks[asset.value] || [], "Select network");
          D.clearMessage(msg);
          update();
        });
        amount.addEventListener("input", update);
        network.addEventListener("change", () => D.clearMessage(msg));
        document.getElementById("cryptoForm").addEventListener("submit", (event) => {
          event.preventDefault();
          const payout = update();
          if (!asset.value || !network.value) return D.message(msg, "error", "Select crypto and network.");
          if (Number(amount.value) <= 0) return D.message(msg, "error", "Enter a crypto amount.");
          if (note.value.trim().length < 4) return D.message(msg, "error", "Enter payout account or wallet note.");
          const transaction = D.addTransaction({
            type: "Crypto Trade",
            description: `${asset.value} ${network.value} sell order`,
            amount: payout,
            status: "Pending",
          });
          const row = { date: D.nowStamp(), reference: transaction.reference, asset: asset.value, network: network.value, amount: Number(amount.value), payout, status: "Pending" };
          D.writeJson("rs_crypto_history", [row, ...D.readJson("rs_crypto_history", defaults)].slice(0, 10));
          D.message(msg, "success", "Trade submitted. Admin review is simulated for now.");
          document.getElementById("cryptoForm").reset();
          network.innerHTML = '<option value="">Select crypto first</option>';
          address.textContent = "Select crypto to show address";
          update();
          render();
        });
        update();
        render();
      },
    },

    "support-ticket": {
      active: "support-ticket",
      title: "Support Ticket",
      mobileTitle: "Support",
      content() {
        return `
          <section class="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
            <div class="${cardClass}">
              ${pageIntro("Help Desk", "Create a support ticket", "Average Reply: 12 min")}
              <form id="ticketForm" class="mt-6 grid gap-5 sm:grid-cols-2">
                <div class="sm:col-span-2"><label for="ticketSubject" class="${labelClass}">Subject</label><input id="ticketSubject" class="${inputClass}" placeholder="Order not delivered" /></div>
                <div><label for="ticketCategory" class="${labelClass}">Category</label><select id="ticketCategory" class="${inputClass}">${optionList(["Order Issue", "Payment", "Account", "Technical", "Other"], "Select category")}</select></div>
                <div><label for="ticketPriority" class="${labelClass}">Priority</label><select id="ticketPriority" class="${inputClass}">${optionList(["Low", "Medium", "High"], "Select priority")}</select></div>
                <div class="sm:col-span-2"><label for="ticketMessageText" class="${labelClass}">Message</label><textarea id="ticketMessageText" class="${areaClass}" placeholder="Explain what happened"></textarea></div>
                <div id="ticketMessage" class="hidden sm:col-span-2"></div>
                <button type="submit" class="${buttonClass} sm:col-span-2">Submit Ticket</button>
              </form>
            </div>
            <aside class="${cardClass}">
              <p class="text-sm font-bold text-slate-500">Support Channels</p>
              <div class="mt-4 grid gap-3">
                <div class="rounded-xl border border-slate-200 p-4"><p class="text-sm font-extrabold">Live Chat</p><p class="mt-1 text-xs font-bold text-slate-500">Simulated online status</p></div>
                <div class="rounded-xl border border-slate-200 p-4"><p class="text-sm font-extrabold">Email Support</p><p class="mt-1 text-xs font-bold text-slate-500">support@reliablesocials.local</p></div>
                <div class="rounded-xl border border-slate-200 p-4"><p class="text-sm font-extrabold">Ticket SLA</p><p class="mt-1 text-xs font-bold text-slate-500">High priority appears first</p></div>
              </div>
            </aside>
          </section>
          <section class="mt-5 ${cardClass}">
            <div class="mb-5"><p class="text-sm font-bold text-slate-500">Tickets</p><h3 class="mt-1 text-lg font-extrabold">Ticket History</h3></div>
            ${historyTable(["Date", "Subject", "Category", "Priority", "Status"], "ticketHistory")}
          </section>
        `;
      },
      init() {
        const defaults = [];
        const form = document.getElementById("ticketForm");
        const msg = document.getElementById("ticketMessage");
        const historyEl = document.getElementById("ticketHistory");
        const render = () => {
          renderGenericRows(historyEl, D.readJson("rs_ticket_history", defaults), [
            { render: (row) => row.date, className: "font-bold text-slate-700" },
            { render: (row) => row.subject, className: "font-extrabold text-slate-900" },
            { render: (row) => row.category },
            { render: (row) => `<span class="${D.badge(row.priority)}">${row.priority}</span>` },
            { render: (row) => `<span class="${D.badge(row.status)}">${D.normalizeStatus(row.status)}</span>` },
          ]);
        };
        form.addEventListener("submit", (event) => {
          event.preventDefault();
          const subject = document.getElementById("ticketSubject").value.trim();
          const category = document.getElementById("ticketCategory").value;
          const priority = document.getElementById("ticketPriority").value;
          const text = document.getElementById("ticketMessageText").value.trim();
          if (subject.length < 5) return D.message(msg, "error", "Enter a clear subject.");
          if (!category || !priority) return D.message(msg, "error", "Select category and priority.");
          if (text.length < 10) return D.message(msg, "error", "Message must be at least 10 characters.");
          const transaction = D.addTransaction({
            type: "Support Ticket",
            description: subject,
            amount: 0,
            status: "Pending",
          });
          const ticket = { date: D.nowStamp(), reference: transaction.reference, subject, category, priority, status: "Pending" };
          D.writeJson("rs_ticket_history", [ticket, ...D.readJson("rs_ticket_history", defaults)].slice(0, 10));
          D.message(msg, "success", "Support ticket submitted.");
          form.reset();
          render();
        });
        render();
      },
    },

    transactions: {
      active: "transactions",
      title: "Transaction History",
      mobileTitle: "Transactions",
      content() {
        return `
          <section class="${cardClass}">
            <div class="grid gap-3 lg:grid-cols-[1fr_180px_180px_180px]">
              <input id="txSearch" class="${inputClass}" placeholder="Search transactions" />
              <select id="txType" class="${inputClass}">${optionList(["Wallet Deposit", "Social Boost", "Data Bundle", "SMS Verification", "Bill Payment", "Crypto Trade", "Support Ticket"], "All types")}</select>
              <select id="txStatus" class="${inputClass}">${optionList(["Successful", "Pending", "Failed"], "All statuses")}</select>
              <input id="txDate" type="date" class="${inputClass}" />
            </div>
          </section>
          <section class="mt-5 ${cardClass}">
            <div class="mb-5 flex flex-wrap items-center justify-between gap-3"><div><p class="text-sm font-bold text-slate-500">Activity</p><h3 class="mt-1 text-lg font-extrabold">All Transactions</h3></div><button id="clearTxFilters" type="button" class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-extrabold hover:bg-slate-50">Clear Filters</button></div>
            ${historyTable(["Reference", "Date", "Type", "Description", "Amount", "Status"], "txRows")}
          </section>
        `;
      },
      init() {
        const rowsEl = document.getElementById("txRows");
        const filters = {
          search: document.getElementById("txSearch"),
          type: document.getElementById("txType"),
          status: document.getElementById("txStatus"),
          date: document.getElementById("txDate"),
        };
        const render = () => {
          const q = filters.search.value.toLowerCase();
          const rows = D.readTransactions().filter((row) => {
            const date = String(row.date || "").slice(0, 10);
            const text = `${row.reference} ${row.type} ${row.description} ${row.status}`.toLowerCase();
            return (!q || text.includes(q)) &&
              (!filters.type.value || row.type === filters.type.value) &&
              (!filters.status.value || row.status === filters.status.value) &&
              (!filters.date.value || date === filters.date.value);
          });
          renderGenericRows(rowsEl, rows, [
            { render: (row) => row.reference, className: "font-extrabold text-blue-700" },
            { render: (row) => String(row.date || "").slice(0, 10), className: "font-bold text-slate-700" },
            { render: (row) => row.type, className: "font-extrabold text-slate-900" },
            { render: (row) => row.description },
            { render: (row) => D.money(row.amount), className: "font-extrabold text-slate-900" },
            { render: (row) => `<span class="${D.badge(row.status)}">${D.normalizeStatus(row.status)}</span>` },
          ]);
        };
        Object.values(filters).forEach((el) => {
          el.addEventListener("input", render);
          el.addEventListener("change", render);
        });
        document.getElementById("clearTxFilters").addEventListener("click", () => {
          Object.values(filters).forEach((el) => { el.value = ""; });
          render();
        });
        render();
      },
    },

    profile: {
      active: "profile",
      title: "Profile",
      mobileTitle: "Profile",
      content() {
        return `
          <section class="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
            <aside class="${cardClass}">
              <p class="text-sm font-bold text-slate-500">Profile Photo</p>
              <div class="mt-5 grid aspect-square max-w-64 place-items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50">
                <div class="text-center"><div id="profileInitials" class="mx-auto grid h-20 w-20 place-items-center rounded-full bg-blue-600 text-2xl font-extrabold text-white">RS</div><p class="mt-3 text-sm font-bold text-slate-500">Photo placeholder</p></div>
              </div>
            </aside>
            <div class="${cardClass}">
              ${pageIntro("Account", "Edit profile details", "Saved Locally")}
              <form id="profileForm" class="mt-6 grid gap-5 sm:grid-cols-2">
                <div><label for="fullName" class="${labelClass}">Full Name</label><input id="fullName" class="${inputClass}" placeholder="Your full name" /></div>
                <div><label for="profileEmail" class="${labelClass}">Email</label><input id="profileEmail" type="email" class="${inputClass}" placeholder="you@example.com" /></div>
                <div><label for="profilePhone" class="${labelClass}">Phone</label><input id="profilePhone" class="${inputClass}" placeholder="08012345678" /></div>
                <div><label for="profileRole" class="${labelClass}">Account Type</label><input id="profileRole" class="${inputClass}" value="Customer" readonly /></div>
                <div id="profileMessage" class="hidden sm:col-span-2"></div>
                <button type="submit" class="${buttonClass} sm:col-span-2">Save Profile</button>
              </form>
            </div>
          </section>
        `;
      },
      init() {
        const savedUser = D.readJson("rs_user", {});
        const savedProfile = D.readJson("rs_profile", {});
        const profile = {
          fullName: savedProfile.fullName || `${savedUser.firstName || ""} ${savedUser.lastName || ""}`.trim() || "Reliable Socials User",
          email: savedProfile.email || savedUser.email || "",
          phone: savedProfile.phone || savedUser.phone || "",
        };
        const fullName = document.getElementById("fullName");
        const email = document.getElementById("profileEmail");
        const phone = document.getElementById("profilePhone");
        const initials = document.getElementById("profileInitials");
        const msg = document.getElementById("profileMessage");
        const updateInitials = () => {
          initials.textContent = fullName.value.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "RS";
        };
        fullName.value = profile.fullName;
        email.value = profile.email;
        phone.value = profile.phone;
        updateInitials();
        fullName.addEventListener("input", updateInitials);
        document.getElementById("profileForm").addEventListener("submit", (event) => {
          event.preventDefault();
          if (fullName.value.trim().length < 3) return D.message(msg, "error", "Enter your full name.");
          if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value.trim())) return D.message(msg, "error", "Enter a valid email.");
          if (phone.value.trim().length < 8) return D.message(msg, "error", "Enter a valid phone number.");
          D.writeJson("rs_profile", { fullName: fullName.value.trim(), email: email.value.trim(), phone: phone.value.trim() });
          D.message(msg, "success", "Profile saved successfully.");
        });
      },
    },

    settings: {
      active: "settings",
      title: "Settings",
      mobileTitle: "Settings",
      content() {
        return `
          <section class="grid gap-5 xl:grid-cols-2">
            <div id="password" class="${cardClass}">
              ${pageIntro("Security", "Change password", "")}
              <form id="passwordForm" class="mt-6 grid gap-5">
                <input id="currentPassword" type="password" class="${inputClass}" placeholder="Current password" />
                <input id="newPassword" type="password" class="${inputClass}" placeholder="New password" />
                <input id="confirmNewPassword" type="password" class="${inputClass}" placeholder="Confirm new password" />
                <div id="passwordMessage" class="hidden"></div>
                <button type="submit" class="${buttonClass}">Update Password</button>
              </form>
            </div>
            <div class="${cardClass}">
              ${pageIntro("Preferences", "Notification settings", "")}
              <div class="mt-6 grid gap-3">
                <label class="flex items-center justify-between rounded-xl border border-slate-200 p-4"><span class="font-bold">Email notifications</span><input id="prefEmail" type="checkbox" class="h-5 w-5 accent-blue-600" /></label>
                <label class="flex items-center justify-between rounded-xl border border-slate-200 p-4"><span class="font-bold">Order updates</span><input id="prefOrders" type="checkbox" class="h-5 w-5 accent-blue-600" /></label>
                <label class="flex items-center justify-between rounded-xl border border-slate-200 p-4"><span class="font-bold">Promotions</span><input id="prefPromos" type="checkbox" class="h-5 w-5 accent-blue-600" /></label>
              </div>
            </div>
          </section>
          <section id="security" class="mt-5 ${cardClass}">
            ${pageIntro("Account Protection", "Security settings", "")}
            <div class="mt-6 grid gap-3 sm:grid-cols-3">
              <label class="rounded-xl border border-slate-200 p-4"><span class="block text-sm font-extrabold">Two-factor login</span><span class="mt-1 block text-xs font-bold text-slate-500">Require OTP on login</span><input id="sec2fa" type="checkbox" class="mt-4 h-5 w-5 accent-blue-600" /></label>
              <label class="rounded-xl border border-slate-200 p-4"><span class="block text-sm font-extrabold">Login alerts</span><span class="mt-1 block text-xs font-bold text-slate-500">Notify new sessions</span><input id="secAlerts" type="checkbox" class="mt-4 h-5 w-5 accent-blue-600" /></label>
              <label class="rounded-xl border border-slate-200 p-4"><span class="block text-sm font-extrabold">Device approval</span><span class="mt-1 block text-xs font-bold text-slate-500">Review trusted devices</span><input id="secDevices" type="checkbox" class="mt-4 h-5 w-5 accent-blue-600" /></label>
            </div>
            <div id="settingsMessage" class="mt-5 hidden"></div>
          </section>
        `;
      },
      init() {
        const prefs = D.readJson("rs_settings", { prefEmail: true, prefOrders: true, prefPromos: false, sec2fa: false, secAlerts: true, secDevices: false });
        Object.keys(prefs).forEach((id) => {
          const el = document.getElementById(id);
          if (el) el.checked = !!prefs[id];
        });
        const save = () => {
          const next = {};
          ["prefEmail", "prefOrders", "prefPromos", "sec2fa", "secAlerts", "secDevices"].forEach((id) => {
            next[id] = !!document.getElementById(id)?.checked;
          });
          D.writeJson("rs_settings", next);
          D.message(document.getElementById("settingsMessage"), "success", "Settings saved.");
        };
        ["prefEmail", "prefOrders", "prefPromos", "sec2fa", "secAlerts", "secDevices"].forEach((id) => {
          document.getElementById(id)?.addEventListener("change", save);
        });
        document.getElementById("passwordForm").addEventListener("submit", (event) => {
          event.preventDefault();
          const current = document.getElementById("currentPassword").value;
          const next = document.getElementById("newPassword").value;
          const confirm = document.getElementById("confirmNewPassword").value;
          const msg = document.getElementById("passwordMessage");
          if (!current || next.length < 6) return D.message(msg, "error", "Enter current password and a new password of at least 6 characters.");
          if (next !== confirm) return D.message(msg, "error", "New passwords do not match.");
          D.message(msg, "success", "Password change saved locally for demo.");
          event.target.reset();
        });
      },
    },

    notifications: {
      active: "notifications",
      title: "Notifications",
      mobileTitle: "Notifications",
      content() {
        return `
          <section class="${cardClass}">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div><p class="text-sm font-bold text-slate-500">Inbox</p><h2 class="mt-1 text-2xl font-extrabold">Notification Center</h2></div>
              <button id="markRead" type="button" class="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-extrabold text-white hover:bg-blue-700">Mark All as Read</button>
            </div>
            <div id="notificationList" class="mt-5 grid gap-3"></div>
          </section>
        `;
      },
      init() {
        const defaults = [];
        const list = document.getElementById("notificationList");
        const render = () => {
          const rows = D.readJson("rs_notifications", defaults);
          if (!rows.length) {
            list.innerHTML = '<div class="rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm font-bold text-slate-500">No notifications yet.</div>';
            return;
          }
          list.innerHTML = rows.map((item, index) => `
            <article class="rounded-xl border ${item.read ? "border-slate-200 bg-white" : "border-blue-200 bg-blue-50/50"} p-4">
              <div class="flex flex-wrap items-start justify-between gap-3">
                <div><p class="text-sm font-extrabold text-slate-900">${item.title}</p><p class="mt-1 text-sm font-bold text-slate-500">${item.text}</p></div>
                <span class="${item.read ? "rounded-full bg-slate-100 px-3 py-1 text-xs font-extrabold text-slate-600" : "rounded-full bg-blue-600 px-3 py-1 text-xs font-extrabold text-white"}">${item.read ? "Read" : "New"}</span>
              </div>
              <div class="mt-3 flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500"><span>${item.type}</span><span>|</span><span>${item.time}</span><button type="button" data-read="${index}" class="ml-auto text-blue-600 hover:text-blue-700">${item.read ? "Keep read" : "Mark read"}</button></div>
            </article>
          `).join("");
          document.querySelectorAll("[data-read]").forEach((button) => {
            button.addEventListener("click", () => {
              const next = D.readJson("rs_notifications", defaults);
              next[Number(button.dataset.read)].read = true;
              D.writeJson("rs_notifications", next);
              render();
            });
          });
        };
        document.getElementById("markRead").addEventListener("click", () => {
          const next = D.readJson("rs_notifications", defaults).map((item) => ({ ...item, read: true }));
          D.writeJson("rs_notifications", next);
          render();
        });
        render();
      },
    },
  };

  const page = pages[pageId];
  if (!page) {
    document.getElementById("app").innerHTML = '<main class="p-6"><div class="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm font-bold text-rose-700">Page configuration not found.</div></main>';
    return;
  }

  D.render(page);
})();
