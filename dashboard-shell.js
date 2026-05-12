(function () {
  const pageLinks = {
    dashboard: "dashboard.php",
    addFund: "add-fund.php",
    socialBoost: "social-boost.php",
    smsVerification: "sms-verification.php",
    payBills: "pay-bills.php",
    dataBundle: "data-bundle.php",
    sellCrypto: "sell-crypto.php",
    supportTicket: "support-ticket.php",
    transactions: "transactions.php",
    profile: "profile.php",
    settings: "settings.php",
    notifications: "notifications.php",
    reseller: "reseller.php",
  };
  const WALLET_KEY = "rs_wallet_balance";
  const TRANSACTIONS_KEY = "rs_transactions";
  const TX_COUNTER_KEY = "rs_transaction_counter";

  function money(amount) {
    return `\u20a6${Number(amount || 0).toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;
  }

  function readJson(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "null");
      return value || fallback;
    } catch {
      return fallback;
    }
  }

  function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function readWallet() {
    const saved = Number(localStorage.getItem(WALLET_KEY));
    if (Number.isFinite(saved) && saved >= 0) return saved;
    localStorage.setItem(WALLET_KEY, "12500");
    return 12500;
  }

  function writeWallet(amount) {
    localStorage.setItem(WALLET_KEY, String(Math.max(0, Number(amount || 0))));
    refreshWalletDisplays();
  }

  function normalizeStatus(status) {
    const value = String(status || "Successful").toLowerCase();
    if (value.includes("fail")) return "Failed";
    if (value.includes("pending") || value.includes("processing") || value.includes("waiting") || value.includes("open")) return "Pending";
    return "Successful";
  }

  function defaultTransactions() {
    return [
      { reference: "RS-2026-0006", date: "2026-05-08 12:20", type: "Support Ticket", description: "Data order delayed", amount: 0, status: "Pending" },
      { reference: "RS-2026-0005", date: "2026-05-08 10:05", type: "Crypto Trade", description: "USDT TRC20 sell order", amount: 222000, status: "Pending" },
      { reference: "RS-2026-0004", date: "2026-05-08 08:45", type: "Wallet Deposit", description: "Bank Transfer funding", amount: 10000, status: "Successful" },
      { reference: "RS-2026-0003", date: "2026-05-07 18:01", type: "Bill Payment", description: "IKEDC electricity payment", amount: 5000, status: "Successful" },
      { reference: "RS-2026-0002", date: "2026-05-07 10:42", type: "Data Bundle", description: "MTN SME 2GB", amount: 760, status: "Successful" },
      { reference: "RS-2026-0001", date: "2026-05-06 16:44", type: "Social Boost", description: "TikTok Views order", amount: 1440, status: "Pending" },
    ];
  }

  function readTransactions() {
    const rows = readJson(TRANSACTIONS_KEY, null);
    if (Array.isArray(rows) && rows.length) {
      return rows.map((row) => ({ ...row, status: normalizeStatus(row.status) }));
    }
    const defaults = defaultTransactions();
    writeJson(TRANSACTIONS_KEY, defaults);
    return defaults;
  }

  function maxTransactionNumber(transactions) {
    return transactions.reduce((max, item) => {
      const match = String(item.reference || "").match(/RS-\d{4}-(\d+)/);
      return match ? Math.max(max, Number(match[1])) : max;
    }, 0);
  }

  function nextTransactionRef() {
    const transactions = readTransactions();
    const savedCounter = Number(localStorage.getItem(TX_COUNTER_KEY) || 0);
    const next = Math.max(savedCounter, maxTransactionNumber(transactions)) + 1;
    localStorage.setItem(TX_COUNTER_KEY, String(next));
    return `RS-${new Date().getFullYear()}-${String(next).padStart(4, "0")}`;
  }

  function addTransaction({ type, description, amount = 0, status = "Successful" }) {
    const transaction = {
      reference: nextTransactionRef(),
      date: nowStamp(),
      type,
      description,
      amount: Number(amount || 0),
      status: normalizeStatus(status),
    };
    writeJson(TRANSACTIONS_KEY, [transaction, ...readTransactions()].slice(0, 80));
    return transaction;
  }

  function depositWallet(amount, details = {}) {
    const value = Number(amount || 0);
    writeWallet(readWallet() + value);
    return addTransaction({
      type: details.type || "Wallet Deposit",
      description: details.description || "Wallet funding",
      amount: value,
      status: "Successful",
    });
  }

  function spendWallet(amount, details = {}, successStatus = "Successful") {
    const value = Number(amount || 0);
    const balance = readWallet();
    if (balance < value) {
      return {
        ok: false,
        transaction: addTransaction({
          type: details.type || "Wallet Debit",
          description: details.description || "Insufficient balance",
          amount: value,
          status: "Failed",
        }),
      };
    }

    writeWallet(balance - value);
    return {
      ok: true,
      transaction: addTransaction({
        type: details.type || "Wallet Debit",
        description: details.description || "Wallet debit",
        amount: value,
        status: successStatus,
      }),
    };
  }

  function refreshWalletDisplays() {
    document.querySelectorAll("[data-wallet-balance]").forEach((el) => {
      el.textContent = money(readWallet());
    });
  }

  function nowStamp() {
    return new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date()).replace(",", "");
  }

  function message(el, type, text) {
    if (!el) return;
    el.textContent = text;
    el.className = type === "success"
      ? "rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700"
      : "rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700";
  }

  function clearMessage(el) {
    if (!el) return;
    el.textContent = "";
    el.className = "hidden";
  }

  function badge(status) {
    const normalized = String(status || "").toLowerCase();
    if (normalized.includes("successful") || normalized.includes("complete") || normalized.includes("active") || normalized.includes("paid")) {
      return "rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-700";
    }
    if (normalized.includes("pending") || normalized.includes("processing") || normalized.includes("waiting")) {
      return "rounded-full bg-amber-50 px-3 py-1 text-xs font-extrabold text-amber-700";
    }
    if (normalized.includes("failed") || normalized.includes("closed") || normalized.includes("high")) {
      return "rounded-full bg-rose-50 px-3 py-1 text-xs font-extrabold text-rose-700";
    }
    return "rounded-full bg-slate-100 px-3 py-1 text-xs font-extrabold text-slate-700";
  }

  function isActive(page, active) {
    return page.active === active;
  }

  function routeFromHref(href) {
    if (!href || href === "#") return "";
    const url = new URL(href, window.location.href);
    const file = url.pathname.split("/").filter(Boolean).pop() || "dashboard.php";
    return `${file}${url.hash}`;
  }

  function currentRoute() {
    const file = window.location.pathname.split("/").filter(Boolean).pop() || "dashboard.php";
    return `${file}${window.location.hash}`;
  }

  function isCurrentHref(href) {
    return routeFromHref(href) === currentRoute();
  }

  function navLink(page, active, href, label, extraClass = "") {
    const activeClass = isActive(page, active) ? "bg-blue-600 text-white" : "hover:bg-slate-800";
    return `<a href="${href}" class="block rounded-xl px-4 py-3 ${activeClass} ${extraClass}">${label}</a>`;
  }

  function childLink(page, active, href, label) {
    const activeClass = isCurrentHref(href) ? "bg-blue-600 text-white" : "hover:bg-slate-800/80 hover:text-white";
    return `<a href="${href}" data-nav-child class="block rounded-lg px-3 py-2 ${activeClass}">${label}</a>`;
  }

  function navGroup(page, id, label, children) {
    const open = children.some((child) => isActive(page, child.active));
    const buttonClass = open ? "bg-slate-800 text-white" : "hover:bg-slate-800";
    const caretClass = open ? "rotate-180" : "";
    const menuClass = open ? "" : "hidden";
    return `
      <button type="button" class="${id}-toggle flex w-full items-center justify-between rounded-xl px-4 py-3 text-left ${buttonClass}" aria-expanded="${open ? "true" : "false"}">
        <span>${label}</span>
        <span class="${id}-caret inline-flex text-slate-400 transition-transform duration-200 ${caretClass}"><svg viewBox="0 0 20 20" class="h-4 w-4" fill="none" aria-hidden="true"><path d="m5 7.5 5 5 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
      </button>
      <div class="${id}-menu ml-5 mt-1 ${menuClass} space-y-1 text-[13px] font-semibold text-slate-300">
        ${children.map((child) => childLink(page, child.active, child.href, child.label)).join("")}
      </div>
    `;
  }

  function sidebar(page) {
    return `
      <aside id="mobileSidebar" class="fixed left-0 top-0 z-40 h-screen w-[272px] -translate-x-full overflow-y-auto bg-slate-900 text-slate-200 transition-transform duration-300 ease-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0">
        <div class="border-b border-slate-800 px-6 py-6">
          <div class="flex items-center justify-between">
            <a href="${pageLinks.dashboard}" class="inline-flex items-center"><img src="https://res.cloudinary.com/dssaejqkg/image/upload/v1778001448/ChatGPT_Image_May_5_2026_06_14_51_PM_sa1bnv.png" alt="Reliable Socials" class="h-10 w-auto" /></a>
            <button id="closeSidebarBtn" type="button" class="grid h-9 w-9 place-items-center rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 lg:hidden" aria-label="Close menu"><svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg></button>
          </div>
        </div>
        <nav class="space-y-2 px-4 py-5 text-sm font-semibold">
          <p class="px-3 pb-1 pt-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-500">Menu</p>
          ${navLink(page, "dashboard", pageLinks.dashboard, "Dashboard")}
          ${navGroup(page, "add-fund", "Add Fund", [
            { active: "add-fund", href: pageLinks.addFund, label: "Deposit" },
            { active: "transactions", href: pageLinks.transactions, label: "Payment Transactions" },
          ])}
          ${navLink(page, "reseller", pageLinks.reseller, "Become a Reseller")}
          <p class="px-3 pb-1 pt-4 text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-500">Our Services</p>
          ${navGroup(page, "social-boost", "Social Boost", [
            { active: "social-boost", href: pageLinks.socialBoost, label: "New Order" },
            { active: "social-boost", href: `${pageLinks.socialBoost}#services`, label: "Social Boost Services" },
            { active: "transactions", href: pageLinks.transactions, label: "Transactions History" },
          ])}
          <a href="#" class="block rounded-xl px-4 py-3 hover:bg-slate-800">Reward Center</a>
          ${navGroup(page, "sms-verification", "SMS Verification", [
            { active: "sms-verification", href: pageLinks.smsVerification, label: "New Order" },
            { active: "sms-verification", href: `${pageLinks.smsVerification}#inbox`, label: "SMS Verification Inbox" },
          ])}
          ${navGroup(page, "pay-utilities", "Pay Utilities Bills", [
            { active: "data-bundle", href: pageLinks.dataBundle, label: "Data Bundle" },
            { active: "pay-bills", href: `${pageLinks.payBills}#cable-tv`, label: "Cable TV" },
            { active: "pay-bills", href: `${pageLinks.payBills}#streaming-tv`, label: "Streaming TV" },
            { active: "transactions", href: pageLinks.transactions, label: "Transactions History" },
          ])}
          <p class="px-3 pb-1 pt-4 text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-500">Cryptocurrency</p>
          ${navGroup(page, "sell-crypto", "Sell Crypto", [
            { active: "sell-crypto", href: pageLinks.sellCrypto, label: "Sell Crypto" },
            { active: "transactions", href: pageLinks.transactions, label: "Crypto Transactions" },
          ])}
          ${navLink(page, "support-ticket", pageLinks.supportTicket, "Support Ticket")}
          <a href="#" class="block rounded-xl px-4 py-3 hover:bg-slate-800">Knowledge Base</a>
          <p class="px-3 pb-1 pt-4 text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-500">Rewards</p>
          <a href="#" class="block rounded-xl px-4 py-3 hover:bg-slate-800">Referrals</a>
          <a href="#" class="block rounded-xl px-4 py-3 hover:bg-slate-800">Swap Points</a>
          <p class="px-3 pb-1 pt-4 text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-500">User App</p>
          ${navLink(page, "transactions", pageLinks.transactions, "Transactions")}
          ${navLink(page, "profile", pageLinks.profile, "Profile")}
          ${navLink(page, "settings", pageLinks.settings, "Settings")}
          ${navLink(page, "notifications", pageLinks.notifications, "Notifications")}
          <p class="px-3 pb-1 pt-4 text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-500">Account Settings</p>
          ${navGroup(page, "account-settings", "Account Settings", [
            { active: "settings", href: pageLinks.settings, label: "API Settings" },
            { active: "settings", href: pageLinks.settings, label: "Account Settings" },
            { active: "settings", href: `${pageLinks.settings}#security`, label: "Account Security" },
            { active: "settings", href: `${pageLinks.settings}#password`, label: "Change Password" },
          ])}
          <a href="logout.php" data-logout class="mt-2 block rounded-xl px-4 py-3 text-rose-300 hover:bg-slate-800">Logout</a>
        </nav>
      </aside>
    `;
  }

  function mobileQuickLinks(page) {
    const items = [
      ["social-boost", pageLinks.socialBoost, "Social Boost", "bg-blue-600 text-white", "bg-white text-blue-700"],
      ["data-bundle", pageLinks.dataBundle, "Data Bundle", "bg-cyan-600 text-white", "bg-white text-cyan-700"],
      ["sms-verification", pageLinks.smsVerification, "SMS Verification", "bg-violet-600 text-white", "bg-white text-violet-700"],
      ["pay-bills", pageLinks.payBills, "Pay Bills", "bg-amber-600 text-white", "bg-white text-amber-700"],
    ];
    return `
      <div class="-mx-1 mb-4 grid grid-cols-2 gap-2 px-1 lg:hidden">
        ${items.map(([active, href, label, selectedClass, defaultClass]) => {
          const selected = page.active === active;
          return `<a href="${href}" class="rounded-xl ${selected ? selectedClass : defaultClass} px-3 py-2.5 text-center text-xs font-extrabold shadow-sm">${label}</a>`;
        }).join("")}
      </div>
    `;
  }

  function header(page) {
    return `
      <header class="sticky top-0 z-20 -mx-4 mb-3 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:hidden">
        <button id="openSidebarBtn" type="button" class="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100" aria-label="Open menu" aria-expanded="false"><svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg></button>
        <p class="text-sm font-extrabold text-slate-700">${page.mobileTitle || page.title}</p>
        <a href="${pageLinks.notifications}" class="relative grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-600" aria-label="Notifications"><svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" aria-hidden="true"><path d="M15 17h5l-1.4-1.4a2 2 0 0 1-.6-1.4V11a6 6 0 1 0-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0a3 3 0 1 1-6 0m6 0H9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-rose-500"></span></a>
      </header>
      ${mobileQuickLinks(page)}
      <header class="mb-5 hidden items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-6 lg:flex">
        <div><p class="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Reliable Socials</p><h1 class="mt-1 text-xl font-extrabold sm:text-2xl">${page.title}</h1></div>
        <div class="flex items-center gap-3">
          <div class="relative">
            <button id="notifBtnDesktop" type="button" class="relative grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50" aria-label="Open notifications"><svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" aria-hidden="true"><path d="M15 17h5l-1.4-1.4a2 2 0 0 1-.6-1.4V11a6 6 0 1 0-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0a3 3 0 1 1-6 0m6 0H9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-rose-500"></span></button>
            <div id="notifPanelDesktop" class="absolute right-0 top-12 hidden w-72 rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_18px_45px_rgba(15,23,42,0.14)]">
              <p class="px-2 pb-2 text-xs font-black uppercase tracking-[0.14em] text-slate-500">Notifications</p>
              <a href="${pageLinks.notifications}" class="block rounded-xl px-2 py-2 text-sm hover:bg-slate-50"><span class="font-bold text-slate-800">Deposit Received</span><span class="mt-1 block text-xs text-slate-500">Your wallet was credited.</span></a>
              <a href="${pageLinks.notifications}" class="mt-1 block rounded-xl px-2 py-2 text-sm hover:bg-slate-50"><span class="font-bold text-slate-800">Order Completed</span><span class="mt-1 block text-xs text-slate-500">Latest order delivered.</span></a>
              <a href="${pageLinks.notifications}" class="mt-2 inline-flex text-xs font-bold text-blue-600">View all</a>
            </div>
          </div>
          <div class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-right">
            <p class="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Wallet</p>
            <p data-wallet-balance class="text-sm font-extrabold text-slate-900">${money(readWallet())}</p>
          </div>
          <a href="${pageLinks.addFund}" class="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-extrabold text-white hover:bg-blue-700">Deposit</a>
        </div>
      </header>
    `;
  }

  function setupShell() {
    const openSidebarBtn = document.getElementById("openSidebarBtn");
    const closeSidebarBtn = document.getElementById("closeSidebarBtn");
    const mobileSidebar = document.getElementById("mobileSidebar");
    const mobileBackdrop = document.getElementById("mobileBackdrop");
    const openMenu = () => {
      mobileBackdrop.classList.remove("hidden");
      requestAnimationFrame(() => {
        mobileBackdrop.classList.remove("opacity-0");
        mobileSidebar.classList.remove("-translate-x-full");
      });
      openSidebarBtn?.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    };
    const closeMenu = () => {
      mobileBackdrop.classList.add("opacity-0");
      mobileSidebar.classList.add("-translate-x-full");
      openSidebarBtn?.setAttribute("aria-expanded", "false");
      setTimeout(() => mobileBackdrop.classList.add("hidden"), 280);
      document.body.style.overflow = "";
    };
    openSidebarBtn?.addEventListener("click", openMenu);
    closeSidebarBtn?.addEventListener("click", closeMenu);
    mobileBackdrop?.addEventListener("click", closeMenu);
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 1024) {
        mobileBackdrop.classList.add("hidden", "opacity-0");
        mobileSidebar.classList.remove("-translate-x-full");
        document.body.style.overflow = "";
      } else {
        mobileSidebar.classList.add("-translate-x-full");
      }
    });

    document.querySelectorAll("[data-logout]").forEach((el) => {
      el.addEventListener("click", (event) => {
        event.preventDefault();
        if (window.ReliableAuth) window.ReliableAuth.logout("login.php");
      });
    });

    const groups = [
      "add-fund",
      "social-boost",
      "sms-verification",
      "pay-utilities",
      "sell-crypto",
      "account-settings",
    ];
    groups.forEach((id) => {
      const button = document.querySelector(`.${id}-toggle`);
      const panel = document.querySelector(`.${id}-menu`);
      const icon = document.querySelector(`.${id}-caret`);
      if (!button || !panel) return;
      button.addEventListener("click", () => {
        const isOpen = !panel.classList.contains("hidden");
        panel.classList.toggle("hidden", isOpen);
        button.setAttribute("aria-expanded", isOpen ? "false" : "true");
        icon?.classList.toggle("rotate-180", !isOpen);
      });
    });

    const notifBtnDesktop = document.getElementById("notifBtnDesktop");
    const notifPanelDesktop = document.getElementById("notifPanelDesktop");
    if (notifBtnDesktop && notifPanelDesktop) {
      notifBtnDesktop.addEventListener("click", () => notifPanelDesktop.classList.toggle("hidden"));
      document.addEventListener("click", (event) => {
        if (!notifBtnDesktop.contains(event.target) && !notifPanelDesktop.contains(event.target)) {
          notifPanelDesktop.classList.add("hidden");
        }
      });
    }

    const updateSidebarActiveLinks = () => {
      document.querySelectorAll("[data-nav-child]").forEach((link) => {
        const active = isCurrentHref(link.getAttribute("href"));
        link.classList.toggle("bg-blue-600", active);
        link.classList.toggle("text-white", active);
        link.classList.toggle("hover:bg-slate-800/80", !active);
        link.classList.toggle("hover:text-white", !active);
      });
    };
    window.addEventListener("hashchange", updateSidebarActiveLinks);
    updateSidebarActiveLinks();
  }

  function render(page) {
    if (window.ReliableAuth) window.ReliableAuth.requireAuth("login.php");
    document.title = `${page.title} | Reliable Socials`;
    const app = document.getElementById("app");
    app.innerHTML = `
      <div class="min-h-screen lg:grid lg:grid-cols-[270px_1fr]">
        <div id="mobileBackdrop" class="fixed inset-0 z-30 hidden bg-slate-950/45 opacity-0 transition-opacity duration-300 lg:hidden"></div>
        ${sidebar(page)}
        <main class="px-4 pb-4 pt-0 sm:px-6 sm:pb-6 lg:h-screen lg:overflow-y-auto lg:px-8 lg:pb-8">
          ${header(page)}
          ${typeof page.content === "function" ? page.content() : page.content}
        </main>
      </div>
    `;
    setupShell();
    refreshWalletDisplays();
    if (typeof page.init === "function") {
      page.init(window.ReliableDashboard);
    }
  }

  window.ReliableDashboard = {
    render,
    money,
    readJson,
    writeJson,
    readWallet,
    writeWallet,
    refreshWalletDisplays,
    readTransactions,
    addTransaction,
    depositWallet,
    spendWallet,
    normalizeStatus,
    nowStamp,
    message,
    clearMessage,
    badge,
    pageLinks,
  };
})();
