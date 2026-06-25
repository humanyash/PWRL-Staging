/**
 * One-shot helper: convert extracted legal markdown into HTML fixtures.
 * Run from frontend/: node scripts/build-legal-html.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "src/content/legal");

function inline(text) {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')
    .replace(/<(https?:\/\/[^>]+)>/g, '<a href="$1">$1</a>');
}

function shouldStop(line) {
  const t = line.trim();
  return (
    t.startsWith("© Powerlaw Corp.") ||
    t.startsWith("* Our Vision") ||
    t.startsWith("Powerlaw Fund Adviser") ||
    t.startsWith("**Investors are advised")
  );
}

function mdToHtml(md) {
  const lines = md.split("\n");
  const out = [];
  let inList = false;

  const closeList = () => {
    if (inList) {
      out.push("</ul>");
      inList = false;
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    const trimmed = line.trim();

    if (!trimmed) {
      closeList();
      continue;
    }
    if (trimmed.startsWith("Source URL:") || trimmed.startsWith("Title:")) {
      continue;
    }
    if (shouldStop(trimmed)) break;

    if (trimmed.startsWith("## ")) {
      closeList();
      out.push(`<h2>${inline(trimmed.slice(3))}</h2>`);
    } else if (trimmed.startsWith("### ")) {
      closeList();
      out.push(`<h3>${inline(trimmed.slice(4))}</h3>`);
    } else if (trimmed.startsWith("#### ")) {
      closeList();
      out.push(`<h4>${inline(trimmed.slice(5))}</h4>`);
    } else if (trimmed.startsWith("##### ")) {
      closeList();
      out.push(`<h5>${inline(trimmed.slice(6))}</h5>`);
    } else if (trimmed.startsWith("* ")) {
      if (!inList) {
        out.push("<ul>");
        inList = true;
      }
      out.push(`<li>${inline(trimmed.slice(2))}</li>`);
    } else {
      closeList();
      out.push(`<p>${inline(trimmed)}</p>`);
    }
  }

  closeList();
  return out.join("\n");
}

function buildTermsMarkdown() {
  return `## Terms & Conditions

These Terms and Conditions apply to your use of this website (the "Site"). The terms "Powerlaw", "we", "our" or "us" means Powerlaw Capital Group, LLC and its affiliates, and their officers, directors, managing directors, partners, and employees. Please read these Terms and Conditions carefully to understand the terms and conditions regarding your use of this Site. If you do not agree with our Terms and Conditions, you should not use this Site. By accessing or using this Site, you agree to these Terms and Conditions.

Your use of the Site is subject to these Terms and Conditions, which may be updated from time to time. Please review these Terms and Conditions periodically for updates. This Site and its content are neither an offer to sell, nor a solicitation of an offer to purchase, an interest in any Powerlaw product or fund. Offers can only be made where lawful under, and in compliance with, applicable law. Powerlaw makes no representations that transactions or products discussed are available or appropriate for sale or use in all jurisdictions or by all investors.

#### Content and Information Made Available Through this Service

All content and information, including all trademarks, logos, copyrights and other intellectual property therein, displayed on the Site are owned or licensed by Powerlaw and/or its third-party information providers and protected by applicable law. Unless expressly permitted by us in writing, you are only permitted to view, bookmark and print this content and information for your nonpublic and noncommercial use only. You are not permitted to publish, transmit, or otherwise reproduce this information, in whole or in part, in any format to any third party without the express written consent of Powerlaw. In addition, you are not permitted to alter, obscure, or remove any copyright, trademark or any other notices that are provided to you in connection with the information. Powerlaw reserves the right, at any time and from time to time, in the interests of its own editorial discretion and business judgment to add, modify, or remove any of the information. These Terms and Conditions are not intended to, and will not, transfer or grant any rights in or to the information other than those which are specifically described herein, and all rights not expressly granted herein are reserved by Powerlaw or the third party providers from whom Powerlaw has obtained the information. You are required to read and abide by any additional terms and conditions that may be posted on this service from time to time concerning information obtained from specific third party providers. Such third party providers shall have no liability to you for monetary damages on account of the information provided to you via this service.

#### No Warranties made as to Content and Security; No Responsibilities to Update

POWERLAW MAKES NO WARRANTY, EXPRESS OR IMPLIED, CONCERNING THIS SITE OR OUR SERVICES. THIS SITE AND THE SERVICES PROVIDED BY US AND OUR THIRD PARTY PROVIDERS ARE ON AN "AS IS" BASIS AT YOUR SOLE RISK. POWERLAW EXPRESSLY DISCLAIMS ANY IMPLIED WARRANTY OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE, INCLUDING ANY WARRANTY FOR THE USE OR THE RESULTS OF THE USE OF THE SERVICES WITH RESPECT TO THEIR CORRECTNESS, QUALITY, ACCURACY, COMPLETENESS, RELIABILITY, PERFORMANCE, TIMELINESS, OR CONTINUED AVAILABILITY. WITHOUT LIMITING THE FOREDOING, POWERLAW MAKES NO WARRANTY WHATSOEVER TO YOU, EXPRESS OR IMPLIED, REGARDING THE SECURITY OF THE SITE, INCLUDING WITH RESPECT TO THE ABILITY OF UNAUTHORIZED PERSONS TO INTERCEPT OR ACCESS INFORMATION TRANSMITTED BY YOU THROUGH THIS SERVICE.

NEITHER POWERLAW NOR ANY OF ITS THIRD PARTY PROVIDERS SHALL HAVE ANY RESPONSIBILITY TO MAINTAIN THE DATA AND SERVICES MADE AVAILABLE ON THIS SITE TO SUPPLY ANY CORRECTIONS, UPDATES, OR RELEASES IN CONNECTION THEREWITH. AVAILABILITY OF DATA AND SERVICES ARE SUBJECT TO CHANGE WITHOUT NOTICE.

#### No representations made as to other sites or links; No Links

This Site may provide links to certain Internet sites (the "Linked Sites") sponsored and maintained by third parties. Powerlaw is providing such links solely as a convenience to you. ACCORDINGLY, POWERLAW MAKES NO REPRESENTATIONS CONCERNING THE CONTENT OF THE LINKED SITES. The fact that Powerlaw has provided a link to the Linked Site does not constitute an endorsement, authorization, sponsorship, or affiliation by Powerlaw with respect to the Linked Site, its owners, or its providers. Powerlaw has no control over such Linked Sites and claims no responsibility with respect to such Linked Sites.

#### Forward Looking Statements

Statements included herein may constitute forward-looking statements, which relate to future events or our future performance or financial condition. These statements are not guarantees of future performance, condition or results and involve a number of risks and uncertainties. Actual results may differ materially from those in the forward-looking statements as a result of a number of factors. Powerlaw undertakes no duty to update any forward-looking statements made herein.

Although Powerlaw believes that the assumptions of forward-looking statements are reasonable, any of those assumptions could prove to be inaccurate, and as a result, the forward-looking statements based on those assumptions also could be inaccurate. In light of these and other uncertainties, the inclusion of a projection or forward-looking statement on this Site should not be regarded as a representation that the investment objectives herein will be achieved.

#### Termination

We reserve the right to terminate your rights to use the Site at any time and for any reason, without notice to you.

#### Governing Law and Forum

Use of this site shall be governed by all applicable Federal laws of the United States of America and the laws of the State of Colorado.

In the event that any provision of these terms is held unenforceable, the validity or enforceability of the remaining provisions will not be affected, and the unenforceable provision will be replaced with an enforceable provision that comes close to the intention underlying the unenforceable provision.`;
}

fs.mkdirSync(outDir, { recursive: true });

const privacyMd = fs.readFileSync(
  path.join(
    process.env.HOME ?? "",
    ".cursor/projects/Users-yash-Desktop-Human-Design-PWRL-pwrl-website-main/uploads/legal-0.md",
  ),
  "utf8",
);

fs.writeFileSync(path.join(outDir, "privacy.html"), mdToHtml(privacyMd));
fs.writeFileSync(path.join(outDir, "terms.html"), mdToHtml(buildTermsMarkdown()));

console.log("Wrote legal HTML fixtures to", outDir);
