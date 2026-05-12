<?php
declare(strict_types=1);

require_once __DIR__ . '/includes/bootstrap.php';
require_login();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Data Bundle | Reliable Socials</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet" />
  <style>body{font-family:"Plus Jakarta Sans",sans-serif;}html,body{margin:0;padding:0;}</style>
</head>
<body class="bg-slate-100 text-slate-900">
  <div class="min-h-screen lg:grid lg:grid-cols-[270px_1fr]">
    <div id="mobileBackdrop" class="fixed inset-0 z-30 hidden bg-slate-950/45 opacity-0 transition-opacity duration-300 lg:hidden"></div>
    <aside id="mobileSidebar" class="fixed left-0 top-0 z-40 h-screen w-[272px] -translate-x-full overflow-y-auto bg-slate-900 text-slate-200 transition-transform duration-300 ease-out lg:static lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen">
      <div class="border-b border-slate-800 px-6 py-6">
        <div class="flex items-center justify-between">
          <a href="dashboard.php" class="inline-flex items-center"><img src="https://res.cloudinary.com/dssaejqkg/image/upload/v1778001448/ChatGPT_Image_May_5_2026_06_14_51_PM_sa1bnv.png" alt="Reliable Socials" class="h-10 w-auto" /></a>
          <button id="closeSidebarBtn" type="button" class="grid h-9 w-9 place-items-center rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 lg:hidden" aria-label="Close menu"><svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg></button>
        </div>
      </div>
      <nav class="space-y-2 px-4 py-5 text-sm font-semibold">
        <p class="px-3 pb-1 pt-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-500">Menu</p>
        <a href="dashboard.php" class="block rounded-xl px-4 py-3 hover:bg-slate-800">Dashboard</a>
        <button type="button" class="add-fund-toggle flex w-full items-center justify-between rounded-xl px-4 py-3 text-left hover:bg-slate-800" aria-expanded="false">
          <span>Add Fund</span>
          <span class="add-fund-caret inline-flex text-slate-400 transition-transform duration-200"><svg viewBox="0 0 20 20" class="h-4 w-4" fill="none" aria-hidden="true"><path d="m5 7.5 5 5 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
        </button>
        <div class="add-fund-menu ml-5 mt-1 hidden space-y-1 text-[13px] font-semibold text-slate-300">
          <a href="add-fund.php" class="block rounded-lg px-3 py-2 hover:bg-slate-800/80 hover:text-white">Deposit</a>
          <a href="transactions.php" class="block rounded-lg px-3 py-2 hover:bg-slate-800/80 hover:text-white">Payment Transactions</a>
        </div>
        <a href="reseller.php" class="block rounded-xl px-4 py-3 hover:bg-slate-800">Become a Reseller</a>
        <p class="px-3 pb-1 pt-4 text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-500">Our Services</p>
        <button type="button" class="social-boost-toggle flex w-full items-center justify-between rounded-xl px-4 py-3 text-left hover:bg-slate-800" aria-expanded="false">
          <span>Social Boost</span>
          <span class="social-boost-caret inline-flex text-slate-400 transition-transform duration-200"><svg viewBox="0 0 20 20" class="h-4 w-4" fill="none" aria-hidden="true"><path d="m5 7.5 5 5 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
        </button>
        <div class="social-boost-menu ml-5 mt-1 hidden space-y-1 text-[13px] font-semibold text-slate-300">
          <a href="social-boost.php" class="block rounded-lg px-3 py-2 hover:bg-slate-800/80 hover:text-white">New Order</a>
          <a href="social-boost.php" class="block rounded-lg px-3 py-2 hover:bg-slate-800/80 hover:text-white">Social Boost Services</a>
          <a href="transactions.php" class="block rounded-lg px-3 py-2 hover:bg-slate-800/80 hover:text-white">Transactions History</a>
        </div>
        <a href="#" class="block rounded-xl px-4 py-3 hover:bg-slate-800">Reward Center</a>
        <button type="button" class="sms-verification-toggle flex w-full items-center justify-between rounded-xl px-4 py-3 text-left hover:bg-slate-800" aria-expanded="false">
          <span>SMS Verification</span>
          <span class="sms-verification-caret inline-flex text-slate-400 transition-transform duration-200"><svg viewBox="0 0 20 20" class="h-4 w-4" fill="none" aria-hidden="true"><path d="m5 7.5 5 5 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
        </button>
        <div class="sms-verification-menu ml-5 mt-1 hidden space-y-1 text-[13px] font-semibold text-slate-300">
          <a href="sms-verification.php" class="block rounded-lg px-3 py-2 hover:bg-slate-800/80 hover:text-white">New Order</a>
          <a href="sms-verification.php#inbox" class="block rounded-lg px-3 py-2 hover:bg-slate-800/80 hover:text-white">SMS Verification Inbox</a>
        </div>
        <button type="button" class="pay-utilities-toggle flex w-full items-center justify-between rounded-xl bg-slate-800 px-4 py-3 text-left text-white" aria-expanded="true">
          <span>Pay Utilities Bills</span>
          <span class="pay-utilities-caret inline-flex rotate-180 text-slate-400 transition-transform duration-200"><svg viewBox="0 0 20 20" class="h-4 w-4" fill="none" aria-hidden="true"><path d="m5 7.5 5 5 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
        </button>
        <div class="pay-utilities-menu ml-5 mt-1 space-y-1 text-[13px] font-semibold text-slate-300">
          <a href="data-bundle.php" class="block rounded-lg bg-blue-600 px-3 py-2 text-white">Data Bundle</a>
          <a href="pay-bills.php" class="block rounded-lg px-3 py-2 hover:bg-slate-800/80 hover:text-white">Cable TV</a>
          <a href="pay-bills.php" class="block rounded-lg px-3 py-2 hover:bg-slate-800/80 hover:text-white">Streaming TV</a>
          <a href="transactions.php" class="block rounded-lg px-3 py-2 hover:bg-slate-800/80 hover:text-white">Transactions History</a>
        </div>
        <p class="px-3 pb-1 pt-4 text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-500">Cryptocurrency</p>
        <button type="button" class="sell-crypto-toggle flex w-full items-center justify-between rounded-xl px-4 py-3 text-left hover:bg-slate-800" aria-expanded="false">
          <span>Sell Crypto</span>
          <span class="sell-crypto-caret inline-flex text-slate-400 transition-transform duration-200"><svg viewBox="0 0 20 20" class="h-4 w-4" fill="none" aria-hidden="true"><path d="m5 7.5 5 5 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
        </button>
        <div class="sell-crypto-menu ml-5 mt-1 hidden space-y-1 text-[13px] font-semibold text-slate-300">
          <a href="sell-crypto.php" class="block rounded-lg px-3 py-2 hover:bg-slate-800/80 hover:text-white">Sell Crypto</a>
          <a href="transactions.php" class="block rounded-lg px-3 py-2 hover:bg-slate-800/80 hover:text-white">Crypto Transactions</a>
        </div>
        <a href="support-ticket.php" class="block rounded-xl px-4 py-3 hover:bg-slate-800">Support Ticket</a>
        <a href="#" class="block rounded-xl px-4 py-3 hover:bg-slate-800">Knowledge Base</a>
        <p class="px-3 pb-1 pt-4 text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-500">Rewards</p>
        <a href="#" class="block rounded-xl px-4 py-3 hover:bg-slate-800">Referrals</a>
        <a href="#" class="block rounded-xl px-4 py-3 hover:bg-slate-800">Swap Points</a>
        <p class="px-3 pb-1 pt-4 text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-500">User App</p>
        <a href="transactions.php" class="block rounded-xl px-4 py-3 hover:bg-slate-800">Transactions</a>
        <a href="profile.php" class="block rounded-xl px-4 py-3 hover:bg-slate-800">Profile</a>
        <a href="settings.php" class="block rounded-xl px-4 py-3 hover:bg-slate-800">Settings</a>
        <a href="notifications.php" class="block rounded-xl px-4 py-3 hover:bg-slate-800">Notifications</a>
        <p class="px-3 pb-1 pt-4 text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-500">Account Settings</p>
        <button type="button" class="account-settings-toggle flex w-full items-center justify-between rounded-xl px-4 py-3 text-left hover:bg-slate-800" aria-expanded="false">
          <span>Account Settings</span>
          <span class="account-settings-caret inline-flex text-slate-400 transition-transform duration-200"><svg viewBox="0 0 20 20" class="h-4 w-4" fill="none" aria-hidden="true"><path d="m5 7.5 5 5 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
        </button>
        <div class="account-settings-menu ml-5 mt-1 hidden space-y-1 text-[13px] font-semibold text-slate-300">
          <a href="settings.php" class="block rounded-lg px-3 py-2 hover:bg-slate-800/80 hover:text-white">API Settings</a>
          <a href="settings.php" class="block rounded-lg px-3 py-2 hover:bg-slate-800/80 hover:text-white">Account Settings</a>
          <a href="settings.php#security" class="block rounded-lg px-3 py-2 hover:bg-slate-800/80 hover:text-white">Account Security</a>
          <a href="settings.php#password" class="block rounded-lg px-3 py-2 hover:bg-slate-800/80 hover:text-white">Change Password</a>
          <a href="#" class="block rounded-lg px-3 py-2 hover:bg-slate-800/80 hover:text-white">Delete Account</a>
        </div>
        <a href="logout.php" data-logout class="mt-2 block rounded-xl px-4 py-3 text-rose-300 hover:bg-slate-800">Logout</a>
      </nav>
    </aside>

    <main class="px-4 pb-4 pt-0 sm:px-6 sm:pb-6 lg:h-screen lg:overflow-y-auto lg:px-8 lg:pb-8">
      <header class="sticky top-0 z-20 -mx-4 mb-3 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:hidden">
        <button id="openSidebarBtn" type="button" class="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100" aria-label="Open menu" aria-expanded="false"><svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg></button>
        <p class="text-sm font-extrabold text-slate-700">Data Bundle</p>
        <button type="button" class="relative grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-600" aria-label="Notifications"><svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" aria-hidden="true"><path d="M15 17h5l-1.4-1.4a2 2 0 0 1-.6-1.4V11a6 6 0 1 0-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0a3 3 0 1 1-6 0m6 0H9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-rose-500"></span></button>
      </header>

      <div class="-mx-1 mb-4 grid grid-cols-2 gap-2 px-1 lg:hidden">
        <a href="social-boost.php" class="rounded-xl bg-white px-3 py-2.5 text-center text-xs font-extrabold text-blue-700 shadow-sm">Social Boost</a>
        <a href="data-bundle.php" class="rounded-xl bg-cyan-600 px-3 py-2.5 text-center text-xs font-extrabold text-white shadow-sm">Data Bundle</a>
        <a href="sms-verification.php" class="rounded-xl bg-white px-3 py-2.5 text-center text-xs font-extrabold text-violet-700 shadow-sm">SMS Verification</a>
        <a href="pay-bills.php" class="rounded-xl bg-white px-3 py-2.5 text-center text-xs font-extrabold text-amber-700 shadow-sm">Pay Bills</a>
      </div>

      <header class="mb-5 hidden items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-6 lg:flex">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Reliable Socials</p>
          <h1 class="mt-1 text-xl font-extrabold sm:text-2xl">Buy Data Bundle</h1>
        </div>
        <div class="flex items-center gap-3">
          <div class="relative">
            <button id="notifBtnDesktop" type="button" class="relative grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50" aria-label="Open notifications"><svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" aria-hidden="true"><path d="M15 17h5l-1.4-1.4a2 2 0 0 1-.6-1.4V11a6 6 0 1 0-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0a3 3 0 1 1-6 0m6 0H9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-rose-500"></span></button>
            <div id="notifPanelDesktop" class="absolute right-0 top-12 hidden w-72 rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_18px_45px_rgba(15,23,42,0.14)]">
              <p class="px-2 pb-2 text-xs font-black uppercase tracking-[0.14em] text-slate-500">Notifications</p>
              <a href="notifications.php" class="block rounded-xl px-2 py-2 text-sm hover:bg-slate-50"><span class="font-bold text-slate-800">Deposit Received</span><span class="mt-1 block text-xs text-slate-500">Your wallet was credited.</span></a>
              <a href="notifications.php" class="mt-1 block rounded-xl px-2 py-2 text-sm hover:bg-slate-50"><span class="font-bold text-slate-800">Order Completed</span><span class="mt-1 block text-xs text-slate-500">MTN data delivered.</span></a>
              <a href="notifications.php" class="mt-2 inline-flex text-xs font-bold text-blue-600">View all</a>
            </div>
          </div>
          <a href="add-fund.php" class="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-extrabold text-white hover:bg-blue-700">Deposit</a>
        </div>
      </header>

      <section class="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p class="text-sm font-bold text-slate-500">Data Purchase</p>
              <h2 class="mt-1 text-2xl font-extrabold text-slate-900">Choose a bundle</h2>
            </div>
            <span class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-700">Instant Delivery</span>
          </div>

          <form id="dataForm" class="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label for="network" class="mb-2 block text-sm font-bold text-slate-700">Network</label>
              <select id="network" class="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
                <option value="">Select network</option>
                <option value="MTN">MTN</option>
                <option value="Airtel">Airtel</option>
                <option value="Glo">Glo</option>
                <option value="9mobile">9mobile</option>
              </select>
            </div>
            <div>
              <label for="dataType" class="mb-2 block text-sm font-bold text-slate-700">Data Type</label>
              <select id="dataType" class="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
                <option value="">Select data type</option>
                <option value="SME">SME</option>
                <option value="Gifting">Gifting</option>
                <option value="Corporate">Corporate</option>
              </select>
            </div>
            <div class="sm:col-span-2">
              <label for="dataPlan" class="mb-2 block text-sm font-bold text-slate-700">Data Plan</label>
              <select id="dataPlan" disabled class="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-800 outline-none transition disabled:cursor-not-allowed disabled:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
                <option value="">Select network and data type first</option>
              </select>
            </div>
            <div class="sm:col-span-2">
              <label for="phoneNumber" class="mb-2 block text-sm font-bold text-slate-700">Phone Number</label>
              <input id="phoneNumber" type="tel" inputmode="tel" placeholder="08012345678" class="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
            </div>
            <div id="formMessage" class="hidden rounded-xl px-4 py-3 text-sm font-bold sm:col-span-2" aria-live="polite"></div>
            <button id="buyDataBtn" type="submit" class="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-extrabold text-white transition hover:bg-blue-700 sm:col-span-2">
              <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" aria-hidden="true"><path d="M6 8h12M8 12h8M10 16h4M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <span id="buyDataText">Buy Data</span>
            </button>
          </form>
        </div>

        <div class="space-y-5">
          <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <p class="text-sm font-bold text-slate-500">Wallet Balance</p>
            <div class="mt-3 flex items-end justify-between gap-3">
              <h2 id="walletBalance" data-wallet-balance class="text-4xl font-extrabold text-slate-900">&#8358;0</h2>
              <span class="mb-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-extrabold text-blue-700">Available</span>
            </div>
            <div class="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div class="flex items-center justify-between gap-4 text-sm">
                <span class="font-bold text-slate-500">Network</span>
                <span id="summaryNetwork" class="font-extrabold text-slate-900">Not selected</span>
              </div>
              <div class="mt-3 flex items-center justify-between gap-4 text-sm">
                <span class="font-bold text-slate-500">Type</span>
                <span id="summaryType" class="font-extrabold text-slate-900">Not selected</span>
              </div>
              <div class="mt-3 flex items-center justify-between gap-4 text-sm">
                <span class="font-bold text-slate-500">Plan</span>
                <span id="summaryPlan" class="font-extrabold text-slate-900">Choose plan</span>
              </div>
              <div class="mt-4 border-t border-slate-200 pt-4">
                <div class="flex items-center justify-between gap-4">
                  <span class="text-sm font-bold text-slate-500">Total</span>
                  <span id="summaryAmount" class="text-xl font-extrabold text-slate-900">&#8358;0</span>
                </div>
              </div>
            </div>
          </section>

          <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <p class="text-sm font-bold text-slate-500">Popular Plans</p>
            <div class="mt-4 grid gap-3">
              <button type="button" data-quick-network="MTN" data-quick-type="SME" data-quick-plan="mtn-sme-2gb" class="quick-plan rounded-xl border border-slate-200 px-4 py-3 text-left hover:border-blue-300 hover:bg-blue-50/50">
                <span class="block text-sm font-extrabold text-slate-900">MTN SME 2GB</span>
                <span class="mt-1 block text-xs font-bold text-slate-500">30 Days - &#8358;760</span>
              </button>
              <button type="button" data-quick-network="Airtel" data-quick-type="Gifting" data-quick-plan="airtel-gifting-5gb" class="quick-plan rounded-xl border border-slate-200 px-4 py-3 text-left hover:border-blue-300 hover:bg-blue-50/50">
                <span class="block text-sm font-extrabold text-slate-900">Airtel Gifting 5GB</span>
                <span class="mt-1 block text-xs font-bold text-slate-500">30 Days - &#8358;2,150</span>
              </button>
              <button type="button" data-quick-network="Glo" data-quick-type="Corporate" data-quick-plan="glo-corporate-10gb" class="quick-plan rounded-xl border border-slate-200 px-4 py-3 text-left hover:border-blue-300 hover:bg-blue-50/50">
                <span class="block text-sm font-extrabold text-slate-900">Glo Corporate 10GB</span>
                <span class="mt-1 block text-xs font-bold text-slate-500">30 Days - &#8358;3,900</span>
              </button>
            </div>
          </section>
        </div>
      </section>

      <section class="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p class="text-sm font-bold text-slate-500">Data History</p>
            <h3 class="mt-1 text-lg font-extrabold text-slate-900">Recent Data Purchases</h3>
          </div>
          <a href="transactions.php" class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-extrabold text-slate-700 hover:bg-slate-50">View Transactions</a>
        </div>
        <div class="mt-5 overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="border-b text-left text-slate-500">
                <th class="whitespace-nowrap px-3 py-3">Date</th>
                <th class="whitespace-nowrap px-3 py-3">Network</th>
                <th class="whitespace-nowrap px-3 py-3">Plan</th>
                <th class="whitespace-nowrap px-3 py-3">Phone</th>
                <th class="whitespace-nowrap px-3 py-3">Amount</th>
                <th class="whitespace-nowrap px-3 py-3">Status</th>
              </tr>
            </thead>
            <tbody id="historyBody"></tbody>
          </table>
        </div>
      </section>
    </main>
  </div>

  <?= reliable_client_config_script() ?>
  <script src="./auth.js"></script>
  <script src="./dashboard-shell.js"></script>
  <script>
    const ReliableAuth = window.ReliableAuth;
    ReliableAuth.requireAuth("login.php");

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
    ReliableAuth.bindLogout("[data-logout]", "login.php");
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 1024) {
        mobileBackdrop.classList.add("hidden", "opacity-0");
        mobileSidebar.classList.remove("-translate-x-full");
        document.body.style.overflow = "";
      } else {
        mobileSidebar.classList.add("-translate-x-full");
      }
    });
  </script>
  <script>
    const DATA_PLANS = {
      MTN: {
        SME: [
          { id: "mtn-sme-500mb", size: "500MB", validity: "30 Days", price: 220 },
          { id: "mtn-sme-1gb", size: "1GB", validity: "30 Days", price: 390 },
          { id: "mtn-sme-2gb", size: "2GB", validity: "30 Days", price: 760 },
          { id: "mtn-sme-5gb", size: "5GB", validity: "30 Days", price: 1850 },
        ],
        Gifting: [
          { id: "mtn-gifting-1gb", size: "1GB", validity: "7 Days", price: 520 },
          { id: "mtn-gifting-2gb", size: "2GB", validity: "30 Days", price: 980 },
          { id: "mtn-gifting-3gb", size: "3GB", validity: "30 Days", price: 1420 },
          { id: "mtn-gifting-10gb", size: "10GB", validity: "30 Days", price: 4300 },
        ],
        Corporate: [
          { id: "mtn-corporate-1gb", size: "1GB", validity: "30 Days", price: 430 },
          { id: "mtn-corporate-3gb", size: "3GB", validity: "30 Days", price: 1260 },
          { id: "mtn-corporate-5gb", size: "5GB", validity: "30 Days", price: 2050 },
          { id: "mtn-corporate-10gb", size: "10GB", validity: "30 Days", price: 4050 },
        ],
      },
      Airtel: {
        SME: [
          { id: "airtel-sme-750mb", size: "750MB", validity: "14 Days", price: 330 },
          { id: "airtel-sme-1gb", size: "1GB", validity: "30 Days", price: 470 },
          { id: "airtel-sme-2gb", size: "2GB", validity: "30 Days", price: 900 },
          { id: "airtel-sme-5gb", size: "5GB", validity: "30 Days", price: 2100 },
        ],
        Gifting: [
          { id: "airtel-gifting-1gb", size: "1GB", validity: "30 Days", price: 500 },
          { id: "airtel-gifting-2gb", size: "2GB", validity: "30 Days", price: 950 },
          { id: "airtel-gifting-5gb", size: "5GB", validity: "30 Days", price: 2150 },
          { id: "airtel-gifting-10gb", size: "10GB", validity: "30 Days", price: 4150 },
        ],
        Corporate: [
          { id: "airtel-corporate-1gb", size: "1GB", validity: "30 Days", price: 460 },
          { id: "airtel-corporate-3gb", size: "3GB", validity: "30 Days", price: 1330 },
          { id: "airtel-corporate-5gb", size: "5GB", validity: "30 Days", price: 2200 },
          { id: "airtel-corporate-15gb", size: "15GB", validity: "30 Days", price: 6250 },
        ],
      },
      Glo: {
        SME: [
          { id: "glo-sme-1gb", size: "1GB", validity: "30 Days", price: 360 },
          { id: "glo-sme-2gb", size: "2GB", validity: "30 Days", price: 700 },
          { id: "glo-sme-5gb", size: "5GB", validity: "30 Days", price: 1700 },
          { id: "glo-sme-10gb", size: "10GB", validity: "30 Days", price: 3350 },
        ],
        Gifting: [
          { id: "glo-gifting-1gb", size: "1GB", validity: "14 Days", price: 430 },
          { id: "glo-gifting-2gb", size: "2GB", validity: "30 Days", price: 820 },
          { id: "glo-gifting-4gb", size: "4GB", validity: "30 Days", price: 1550 },
          { id: "glo-gifting-8gb", size: "8GB", validity: "30 Days", price: 3050 },
        ],
        Corporate: [
          { id: "glo-corporate-1gb", size: "1GB", validity: "30 Days", price: 410 },
          { id: "glo-corporate-3gb", size: "3GB", validity: "30 Days", price: 1180 },
          { id: "glo-corporate-5gb", size: "5GB", validity: "30 Days", price: 1950 },
          { id: "glo-corporate-10gb", size: "10GB", validity: "30 Days", price: 3900 },
        ],
      },
      "9mobile": {
        SME: [
          { id: "9mobile-sme-500mb", size: "500MB", validity: "14 Days", price: 250 },
          { id: "9mobile-sme-1gb", size: "1GB", validity: "30 Days", price: 470 },
          { id: "9mobile-sme-2gb", size: "2GB", validity: "30 Days", price: 910 },
          { id: "9mobile-sme-5gb", size: "5GB", validity: "30 Days", price: 2200 },
        ],
        Gifting: [
          { id: "9mobile-gifting-1gb", size: "1GB", validity: "30 Days", price: 520 },
          { id: "9mobile-gifting-2gb", size: "2GB", validity: "30 Days", price: 980 },
          { id: "9mobile-gifting-4gb", size: "4GB", validity: "30 Days", price: 1880 },
          { id: "9mobile-gifting-10gb", size: "10GB", validity: "30 Days", price: 4550 },
        ],
        Corporate: [
          { id: "9mobile-corporate-1gb", size: "1GB", validity: "30 Days", price: 500 },
          { id: "9mobile-corporate-3gb", size: "3GB", validity: "30 Days", price: 1430 },
          { id: "9mobile-corporate-5gb", size: "5GB", validity: "30 Days", price: 2320 },
          { id: "9mobile-corporate-12gb", size: "12GB", validity: "30 Days", price: 5350 },
        ],
      },
    };

    const HISTORY_KEY = "rs_data_history";
    const defaultHistory = [
      { date: "2026-05-07 10:42", network: "MTN", type: "SME", plan: "2GB - 30 Days", phone: "08031234567", amount: 760, status: "Successful" },
      { date: "2026-05-06 17:18", network: "Airtel", type: "Gifting", plan: "5GB - 30 Days", phone: "07081234567", amount: 2150, status: "Successful" },
      { date: "2026-05-05 09:26", network: "Glo", type: "Corporate", plan: "1GB - 30 Days", phone: "09151234567", amount: 410, status: "Successful" },
    ];

    const networkEl = document.getElementById("network");
    const dataTypeEl = document.getElementById("dataType");
    const planEl = document.getElementById("dataPlan");
    const phoneEl = document.getElementById("phoneNumber");
    const dataForm = document.getElementById("dataForm");
    const formMessage = document.getElementById("formMessage");
    const walletBalanceEl = document.getElementById("walletBalance");
    const summaryNetwork = document.getElementById("summaryNetwork");
    const summaryType = document.getElementById("summaryType");
    const summaryPlan = document.getElementById("summaryPlan");
    const summaryAmount = document.getElementById("summaryAmount");
    const buyDataText = document.getElementById("buyDataText");
    const historyBody = document.getElementById("historyBody");

    function formatMoney(amount) {
      return ReliableDashboard.money(amount);
    }

    function readWallet() {
      return ReliableDashboard.readWallet();
    }

    function writeWallet(amount) {
      ReliableDashboard.writeWallet(amount);
      walletBalanceEl.textContent = formatMoney(readWallet());
    }

    function readHistory() {
      try {
        return JSON.parse(localStorage.getItem(HISTORY_KEY) || "null") || defaultHistory;
      } catch {
        return defaultHistory;
      }
    }

    function writeHistory(history) {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 10)));
    }

    function getPlans() {
      return DATA_PLANS[networkEl.value]?.[dataTypeEl.value] || [];
    }

    function getSelectedPlan() {
      return getPlans().find((plan) => plan.id === planEl.value) || null;
    }

    function setMessage(type, text) {
      formMessage.textContent = text;
      formMessage.className = type === "success"
        ? "rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 sm:col-span-2"
        : "rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700 sm:col-span-2";
    }

    function clearMessage() {
      formMessage.textContent = "";
      formMessage.className = "hidden rounded-xl px-4 py-3 text-sm font-bold sm:col-span-2";
    }

    function normalizePhone(value) {
      const cleaned = value.replace(/[\s-]/g, "");
      if (cleaned.startsWith("+234")) return `0${cleaned.slice(4)}`;
      if (cleaned.startsWith("234")) return `0${cleaned.slice(3)}`;
      return cleaned;
    }

    function populatePlans() {
      const plans = getPlans();
      planEl.innerHTML = "";
      if (!plans.length) {
        planEl.disabled = true;
        planEl.innerHTML = '<option value="">Select network and data type first</option>';
        updateSummary();
        return;
      }

      planEl.disabled = false;
      planEl.insertAdjacentHTML("beforeend", '<option value="">Select data plan</option>');
      plans.forEach((plan) => {
        const option = document.createElement("option");
        option.value = plan.id;
        option.textContent = `${plan.size} - ${plan.validity} - ${formatMoney(plan.price)}`;
        planEl.appendChild(option);
      });
      updateSummary();
    }

    function updateSummary() {
      const selectedPlan = getSelectedPlan();
      summaryNetwork.textContent = networkEl.value || "Not selected";
      summaryType.textContent = dataTypeEl.value || "Not selected";
      summaryPlan.textContent = selectedPlan ? `${selectedPlan.size} - ${selectedPlan.validity}` : "Choose plan";
      summaryAmount.textContent = selectedPlan ? formatMoney(selectedPlan.price) : formatMoney(0);
      buyDataText.textContent = selectedPlan ? `Buy Data - ${formatMoney(selectedPlan.price)}` : "Buy Data";
    }

    function statusBadge(status) {
      return ReliableDashboard.badge(status);
    }

    function renderHistory() {
      const history = readHistory();
      historyBody.innerHTML = history.map((item) => `
        <tr class="border-b border-slate-100 last:border-0">
          <td class="whitespace-nowrap px-3 py-3 font-bold text-slate-700">${item.date}</td>
          <td class="whitespace-nowrap px-3 py-3 font-extrabold text-slate-900">${item.network}</td>
          <td class="whitespace-nowrap px-3 py-3 text-slate-600">${item.type} ${item.plan}</td>
          <td class="whitespace-nowrap px-3 py-3 text-slate-600">${item.phone}</td>
          <td class="whitespace-nowrap px-3 py-3 font-extrabold text-slate-900">${formatMoney(item.amount)}</td>
          <td class="whitespace-nowrap px-3 py-3"><span class="${statusBadge(item.status)}">${ReliableDashboard.normalizeStatus(item.status)}</span></td>
        </tr>
      `).join("");
    }

    function currentDateTime() {
      return new Intl.DateTimeFormat("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(new Date()).replace(",", "");
    }

    networkEl.addEventListener("change", () => {
      clearMessage();
      populatePlans();
    });
    dataTypeEl.addEventListener("change", () => {
      clearMessage();
      populatePlans();
    });
    planEl.addEventListener("change", () => {
      clearMessage();
      updateSummary();
    });

    document.querySelectorAll(".quick-plan").forEach((button) => {
      button.addEventListener("click", () => {
        networkEl.value = button.dataset.quickNetwork;
        dataTypeEl.value = button.dataset.quickType;
        populatePlans();
        planEl.value = button.dataset.quickPlan;
        updateSummary();
        clearMessage();
      });
    });

    dataForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const selectedPlan = getSelectedPlan();
      const phone = normalizePhone(phoneEl.value.trim());

      if (!networkEl.value) {
        setMessage("error", "Select a network.");
        return;
      }
      if (!dataTypeEl.value) {
        setMessage("error", "Select a data type.");
        return;
      }
      if (!selectedPlan) {
        setMessage("error", "Select a data plan.");
        return;
      }
      if (!/^0[789][01]\d{8}$/.test(phone)) {
        setMessage("error", "Enter a valid Nigerian phone number.");
        return;
      }
      const spend = ReliableDashboard.spendWallet(selectedPlan.price, {
        type: "Data Bundle",
        description: `${networkEl.value} ${dataTypeEl.value} ${selectedPlan.size}`,
      }, "Successful");
      if (!spend.ok) {
        walletBalanceEl.textContent = formatMoney(readWallet());
        setMessage("error", "Insufficient balance");
        return;
      }

      walletBalanceEl.textContent = formatMoney(readWallet());
      const purchase = {
        date: currentDateTime(),
        reference: spend.transaction.reference,
        network: networkEl.value,
        type: dataTypeEl.value,
        plan: `${selectedPlan.size} - ${selectedPlan.validity}`,
        phone,
        amount: selectedPlan.price,
        status: "Successful",
      };
      const nextHistory = [purchase, ...readHistory()].slice(0, 10);
      writeHistory(nextHistory);
      renderHistory();
      setMessage("success", `${selectedPlan.size} ${networkEl.value} data sent to ${phone}.`);
      phoneEl.value = "";
      planEl.value = "";
      updateSummary();
    });

    writeWallet(readWallet());
    populatePlans();
    renderHistory();
  </script>
  <script>
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
  </script>
  <script id="dashboard-dropdown-init">
    (function () {
      const groups = [
        { toggle: ".add-fund-toggle", menu: ".add-fund-menu", caret: ".add-fund-caret" },
        { toggle: ".social-boost-toggle", menu: ".social-boost-menu", caret: ".social-boost-caret" },
        { toggle: ".sms-verification-toggle", menu: ".sms-verification-menu", caret: ".sms-verification-caret" },
        { toggle: ".pay-utilities-toggle", menu: ".pay-utilities-menu", caret: ".pay-utilities-caret" },
        { toggle: ".sell-crypto-toggle", menu: ".sell-crypto-menu", caret: ".sell-crypto-caret" },
        { toggle: ".account-settings-toggle", menu: ".account-settings-menu", caret: ".account-settings-caret" },
      ];

      groups.forEach(({ toggle, menu, caret }) => {
        const button = document.querySelector(toggle);
        const panel = document.querySelector(menu);
        const icon = document.querySelector(caret);
        if (!button || !panel) return;

        button.addEventListener("click", () => {
          const isOpen = !panel.classList.contains("hidden");
          panel.classList.toggle("hidden", isOpen);
          button.setAttribute("aria-expanded", isOpen ? "false" : "true");
          if (icon) icon.classList.toggle("rotate-180", !isOpen);
        });
      });
    })();
  </script>
</body>
</html>
