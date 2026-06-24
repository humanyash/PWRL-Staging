/* PWRL prototype — shared page behaviors for /vision, /trade,
   /investor-relations, /contact. (Mirrors the repo's client components:
   PersonCardItem dialog, PlatformTabs, NewsList chevrons, FilingsTable
   filters, FAQBlock accordion, FormBlock submit states.) */
(function () {
  "use strict";

  /* ---------------- Person bios (from lib/fixtures.ts) ---------------- */
  var BIOS = {
    "Michael Dinsdale": { img: "assets/team/michael_dinsdale.webp", prose: ["Mike Dinsdale is a Managing Director at Akkadian. For over 20 years, Mr. Dinsdale has embodied the \u201cmodern unicorn\u201d CFO, with strategic expertise in building high-growth international companies that consistently exceed growth targets.", "Prior to Akkadian, Mr. Dinsdale was the Chief Financial Officer of three market-leading software companies that generated an aggregate of over $80 billion in value and for which he successfully secured an aggregate of over $2 billion in financing. He previously served on the Board of Directors for WildAid (non-profit).", "Mr. Dinsdale holds a BS in engineering from the University of Western Ontario, an MBA from McMaster University, and the CFA designation. He competed on the Canadian National Sailing Team in the 1996 Olympic trials.", "Mr. Dinsdale\u2019s finance expertise and his experience as a CFO of multiple companies makes him qualified to serve on the Board."] },
    "Benjamin Black": { img: "assets/team/ben_black.webp", prose: ["Benjamin Black is the Co-Founder and Managing Director of Akkadian and a 20-year private equity veteran.", "In addition, Mr. Black is the Co-Founder of the RAISE Global Summit, which has grown into a premier launchpad for emerging venture capital funds.", "Prior to Akkadian, Mr. Black co-founded New Cycle Capital to bring socially responsible investing to sectors like clean energy and social finance. He started his private equity career on the investment teams at Maveron and Rosewood Capital, where he focused on branded consumer products and services. Prior to his private equity career, Mr. Black was a member of the founding team of Harris Interactive.", "Mr. Black holds a BA and JD from Cornell University.", "Mr. Black\u2019s extensive experience in venture capital and private equity, including as a managing director and founder of various firms, makes him qualified to serve on the Board."] },
    "Peter Smith": { img: "assets/team/peter_smith.webp", bullets: ["Co-founded Akkadian in 2010", "20+ years of legal experience", "Associate at Cooley, Morrison & Foerster, and Bryan Cave", "Real estate investor and developer", "BA (Cum Laude) from Cornell University and JD from UC Berkeley", "Inactive member of the State Bar of California and the State Bar of Colorado"] },
    "Angela Stanley": { img: "assets/team/angela_stanley.webp", bullets: ["Joined Akkadian in 2024 after supporting the firm with two prior fundraises in 2016 and 2019", "20+ years of IR & fundraising experience", "Head of IR & Fundraising at Delta-v Capital", "Co-founder and Managing Director of Harpeth Fund Advisors", "Vice President and Head of the San Francisco office at BerchWood Partners", "BS in International Finance from University of North Carolina-Wilmington"] },
    "Tracy Hogan": { img: "assets/team/tracy_hogan.webp", bullets: ["Joined Akkadian in 2025", "20+ years of experience in venture capital / private equity finance and operations", "Partner and CFO at IVP", "CFO and CCO at Elevation Partners", "Vice President of Finance at Code, Hennessy & Simmons", "BBA (Magna Cum Laude) from Saint Mary's College (Notre Dame, Indiana)"] },
    "Benjamin Hadary": { img: "assets/team/ben_hadary.png", bullets: ["20+ years of experience representing technology and energy companies in commercial, M&A, finance, public reporting, securities, and governance matters", "Vice President and General Counsel at ANM", "Experience as a strategy executive and real estate entrepreneur", "JD from Stanford Law School, with distinction; MSc Management, Stanford Business School", "BS from Penn State University", "Active member of the State Bar of Colorado", "RPCV, United States Peace Corps, The Gambia"] },
    "Vivian Chow": { img: "assets/team/vivian_chow.webp", prose: ["Vivian Chow spent eight years as SVP Chief Accounting Officer at DocuSign (NASDAQ: DOCU), a cloud-based platform for electronic signatures. While there, she was responsible for accounting, sales compensation, internal audit, tax and treasury.", "Prior to joining DocuSign in 2013, Ms. Chow served five years as VP of Finance Worldwide Controller at Electronic Arts Inc. (NASDAQ: EA), a leading publisher of video games. Prior to Electronic Arts, she held VP and Corporate Controller positions at companies in the retail, medical device and financial services industries.", "Ms. Chow started her career in public accounting at Arthur Andersen & Co., a public accounting partnership. She is an inactive Certified Public Accountant in the State of California.", "Ms. Chow holds a BS in Accounting from Lehigh University. She is a Board Member of LiveRamp (NYSE: RAMP), a data collaboration platform for consumer data.", "Ms. Chow\u2019s extensive accounting and financial background and her executive experience, including serving as a chief accounting officer and controller, make her qualified to serve on the Board."] },
    "Nicholas Earl": { img: "assets/team/nicholas_earl.webp", prose: ["Nicholas Earl is a 29-year game industry veteran. He served as Glu Mobile's President and CEO and held a seat on the company's Board of Directors. In 2021, Electronic Arts purchased Glu Mobile for $2.4 billion, the 7th largest acquisition in video gaming history.", "Prior to Glu, Mr. Earl was President of Worldwide Studios at Kabam, presiding over such games as Marvel: Contest of Champions. Mr. Earl served as SVP of EA Mobile at Electronic Arts, overseeing hits such as The Simpsons: Tapped Out, The Sims FreePlay and Real Racing 3. While there, he also led the company's transition from the premium to freemium model.", "Prior to EA Mobile, Mr. Earl was SVP of EA Games launching such console and PC franchises as Knockout Kings, James Bond, Tiger Woods PGA Tour, The Godfather, The Sims, The Simpsons, Lord of the Rings and Dead Space.", "Mr. Earl holds a BA in Economics from the University of California, Berkeley. He served as a Board Member and head of the Compensation Committee of SciPlay (SCPL), a leading developer and publisher of digital games, until its sale to Light & Wonder in 2023.", "Mr. Earl\u2019s service on multiple boards, and his extensive executive experience, including as a CEO make him qualified to serve on the Board."] },
    "Lars Leckie": { img: "assets/team/lars_leckie.webp", prose: ["Lars Leckie has a wealth of experience in technology investment as a former technology founder and twenty year career in venture capital. As a Co-founder of Aspenwood Ventures and a long-standing Managing Director at Hummer Winblad Venture Partners, Mr. Leckie has a track record of identifying and nurturing founders of disruptive software companies.", "Before his venture capital career, Mr. Leckie co-founded AutoFarm, a company focused on GPS and robotics. As a Managing Director at Aspenwood Ventures, Mr. Leckie continues to focus on early-stage B2B software companies. His firm's prior successes include exited category winning companies like Mulesoft and Five9, as well as emerging companies like Arkose Labs, Amberdata and Aria Systems.", "Mr. Leckie holds a MS (Engineering) from Stanford University and an MBA from the Stanford Graduate School of Business.", "Mr. Leckie\u2019s depth of experience in venture capital investing, and his experience as an executive make him qualified to serve on the Board."] }
  };

  /* ---------------- Person card dialog ---------------- */
  function bindPeople() {
    var overlay = document.getElementById("bio-overlay");
    if (!overlay) return;
    var dialog = overlay.querySelector(".bio-dialog");
    function close() { overlay.classList.remove("open"); }
    overlay.querySelector(".scrim").addEventListener("click", close);
    overlay.querySelector(".close").addEventListener("click", close);
    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
    var cards = document.querySelectorAll(".person-card[data-person]");
    for (var i = 0; i < cards.length; i++) {
      (function (card) {
        card.addEventListener("click", function () {
          var name = card.getAttribute("data-person");
          var role = card.getAttribute("data-role") || "";
          var bio = BIOS[name];
          if (!bio) return;
          var body = bio.bullets
            ? "<ul>" + bio.bullets.map(function (b) { return "<li>" + b + "</li>"; }).join("") + "</ul>"
            : bio.prose.map(function (p) { return "<p>" + p + "</p>"; }).join("");
          dialog.querySelector(".head img").src = bio.img;
          dialog.querySelector(".head img").alt = name;
          dialog.querySelector(".nm").textContent = name;
          dialog.querySelector(".rl").textContent = role;
          dialog.querySelector(".body").innerHTML = body;
          overlay.classList.add("open");
          dialog.scrollTop = 0;
        });
      })(cards[i]);
    }
  }

  /* ---------------- Platform tabs ---------------- */
  function bindTabs() {
    var shell = document.querySelector(".tab-shell");
    if (!shell) return;
    var btns = shell.querySelectorAll(".tab-btn");
    var tiles = shell.querySelectorAll(".platform-tile[data-group]");
    function select(group) {
      for (var i = 0; i < btns.length; i++) {
        btns[i].classList.toggle("active", btns[i].getAttribute("data-tab") === group);
        btns[i].setAttribute("aria-selected", btns[i].getAttribute("data-tab") === group ? "true" : "false");
      }
      for (var k = 0; k < tiles.length; k++) {
        tiles[k].style.display = tiles[k].getAttribute("data-group") === group ? "" : "none";
      }
      // Re-run reveal indexing so the newly shown tiles cascade.
      if (window.PWRLMotion) {
        var panel = shell.querySelector(".tab-grid");
        if (panel) {
          var vis = panel.querySelectorAll(".platform-tile[data-mo]");
          var n = 0;
          for (var j = 0; j < vis.length; j++) {
            if (vis[j].style.display !== "none") vis[j].style.setProperty("--mo-i", n++);
          }
        }
      }
    }
    for (var i = 0; i < btns.length; i++) {
      (function (btn) {
        btn.addEventListener("click", function () { select(btn.getAttribute("data-tab")); });
      })(btns[i]);
    }
    select("self-directed");
  }

  /* ---------------- News strip chevrons + edge affordance (E12) ------- */
  function bindNews() {
    var strip = document.querySelector(".news-strip");
    if (!strip) return;
    var prev = document.querySelector("[data-news-prev]");
    var next = document.querySelector("[data-news-next]");
    if (prev) prev.addEventListener("click", function () { strip.scrollBy({ left: -420, behavior: "smooth" }); });
    if (next) next.addEventListener("click", function () { strip.scrollBy({ left: 420, behavior: "smooth" }); });

    // Edge fade while more cards exist off-screen.
    function updateMore() {
      strip.classList.toggle("has-more",
        strip.scrollLeft + strip.clientWidth < strip.scrollWidth - 8);
    }
    strip.addEventListener("scroll", updateMore, { passive: true });
    window.addEventListener("resize", updateMore, { passive: true });
    updateMore();

    // One-time nudge on first view (skipped for reduced motion / touch).
    var nudged = false;
    function maybeNudge() {
      if (nudged) return;
      var html = document.documentElement;
      if (!html.hasAttribute("data-mo-on") ||
          html.hasAttribute("data-mo-reduced") ||
          html.hasAttribute("data-mo-touch") ||
          window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      var r = strip.getBoundingClientRect();
      if (r.top < (window.innerHeight || 800) * 0.8 && r.bottom > 0 &&
          strip.scrollWidth > strip.clientWidth && strip.scrollLeft === 0) {
        nudged = true;
        setTimeout(function () {
          strip.scrollTo({ left: 26, behavior: "smooth" });
          setTimeout(function () { strip.scrollTo({ left: 0, behavior: "smooth" }); }, 340);
        }, 650);
      }
    }
    window.addEventListener("scroll", maybeNudge, { passive: true });
    maybeNudge();
  }

  /* ---------------- Filings table filters ---------------- */
  function bindFilings() {
    var table = document.getElementById("filings-rows");
    if (!table) return;
    var yearSel = document.getElementById("year-selector");
    var typeSel = document.getElementById("type-selector");
    var rows = table.querySelectorAll(".filings-row");
    var empty = document.getElementById("filings-empty");
    function apply() {
      var y = yearSel.value, t = typeSel.value, shown = 0;
      for (var i = 0; i < rows.length; i++) {
        var ok = (y === "all" || rows[i].getAttribute("data-year") === y) &&
                 (t === "all" || rows[i].getAttribute("data-form") === t);
        rows[i].style.display = ok ? "" : "none";
        if (ok) shown++;
      }
      empty.style.display = shown === 0 ? "" : "none";
    }
    yearSel.addEventListener("change", apply);
    typeSel.addEventListener("change", apply);
    apply();
  }

  /* ---------------- FAQ accordion (matches Fund.html behavior) -------- */
  function bindFaq() {
    var rows = document.querySelectorAll(".faq-row");
    if (!rows.length) return;
    rows.forEach(function (row) {
      var q = row.querySelector(".faq-q");
      if (!q) return;
      q.addEventListener("click", function () {
        var was = row.classList.contains("open");
        rows.forEach(function (r) {
          r.classList.remove("open");
          r.querySelector(".faq-q").setAttribute("aria-expanded", "false");
          var vb = r.querySelector(".vbar");
          if (vb) vb.style.display = "";
        });
        if (!was) {
          row.classList.add("open");
          q.setAttribute("aria-expanded", "true");
          var vb = row.querySelector(".vbar");
          if (vb) vb.style.display = "none";
        }
      });
    });
    var openBar = document.querySelector(".faq-row.open .vbar");
    if (openBar) openBar.style.display = "none";
  }

  /* ---------------- Forms (prototype submit states, E13) ---------------- */
  function bindForms() {
    var forms = document.querySelectorAll("form[data-proto-form]");
    forms.forEach(function (f) {
      f.addEventListener("submit", function (e) {
        e.preventDefault();
        var btn = f.querySelector("button[type=submit]");
        if (btn) {
          btn.textContent = "Thanks!";
          btn.classList.add("mo-confirm"); // mint settle + one sheen sweep
        }
        var status = document.querySelector(f.getAttribute("data-status") || "");
        if (status) {
          status.textContent = "Thank you \u2014 your submission has been received.";
          status.classList.add("show"); // rises in
        }
      });
    });
  }

  /* ---------------- Utility hamburger ---------------- */
  function bindUtility() {
    var u = document.getElementById("utility");
    if (!u) return;
    u.querySelector("button").addEventListener("click", function () {
      u.classList.toggle("open");
    });
  }

  function init() {
    bindPeople();
    bindTabs();
    bindNews();
    bindFilings();
    bindFaq();
    bindForms();
    bindUtility();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
