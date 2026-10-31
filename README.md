# DC Research: AI and data-centre risk dashboard

**Open the dashboard: https://cutout-z.github.io/DC-research/**

This repository holds the files of a published website, not code to run. The files above are the
site itself: one HTML page each, plus `fragments/`, the parts of a page that load when you change a
filter or sort a table. To read the research, open the link above.

## What it is

A risk-first view of the AI and data-centre build-out, built from public data. It was made to inform
credit decisions on Australian data-centre financings, so it sorts market evidence under the three
risks a financed data centre carries:

- **Tenant credit:** can the tenants keep paying? Hyperscalers, frontier AI labs, neoclouds and their
  guarantors, and Australian operators.
- **Renewal and obsolescence:** will the space and the hardware still be wanted when leases end? AI
  model economics, inference demand, whether hyperscaler AI spending earns a return, and the hardware
  and facility supply chain.
- **Supply, demand and power:** the Australian project pipeline, electricity demand and the grid,
  power prices, and regulation.

## Where to start

- [Cockpit](https://cutout-z.github.io/DC-research/home.html): what changed recently, then every signal under its risk.
- [Risk map](https://cutout-z.github.io/DC-research/map.html): the three risks and their parts, each linked to a page that gathers
  its signals, charts and news.
- [AI capex return model](https://cutout-z.github.io/DC-research/capex_return_model.html): whether the cloud businesses earn the
  return their capital requires, under the assumptions you pick.
- [News](https://cutout-z.github.io/DC-research/news.html), the [LLM leaderboard](https://cutout-z.github.io/DC-research/leaderboard.html) and the
  [glossary](https://cutout-z.github.io/DC-research/acronyms.html).

## Where the numbers come from

Public sources only: company filings, market and economic data, the Australian electricity market
operator, model leaderboards, OpenRouter token traffic and news feeds. Each chart and table names its
source, and [Source health](https://cutout-z.github.io/DC-research/source_health.html) shows when each source last updated. Where a
figure is an assumption or an estimate, the page says so.

Market-level observations about participants in the Australian data-centre market, built from public
data. Nothing here describes any lender's exposures or counterparties. It is research, not investment
advice.

## How it is updated

The site is rebuilt automatically twice a day. Each rebuild replaces this repository's single commit,
so its history is always one commit and changes made here are overwritten; pull requests can't be
merged. The signals the site tracks are also published as data: [signals.json](https://cutout-z.github.io/DC-research/signals.json).

This site used to be at https://cutout-z.github.io/. Old links still work: they forward here.
