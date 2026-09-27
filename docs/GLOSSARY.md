# Plain-language glossary

This glossary explains the terms used in the project without assuming prior technical knowledge.

| Term | Plain-language meaning |
|---|---|
| **Repository / repo** | The GitHub folder that contains the whole project and its history. |
| **Fork** | Your own GitHub copy of someone else's repository. |
| **Branch** | A safe parallel version of the project where changes can be made before affecting the main version. |
| **main** | The primary branch, normally treated as the current stable version. |
| **Commit** | A saved checkpoint describing a change made to the repository. |
| **Pull Request (PR)** | A proposal to merge changes from one branch into another after review. |
| **Merge** | Accepting a proposed change into another branch, usually `main`. |
| **GitHub Actions** | Automatic checks or jobs that run when code changes. |
| **GitHub Pages** | Free static website hosting built from a GitHub repository. |
| **JSON** | A structured text format used for configuration and menu data. |
| **Frontend** | What the customer sees and interacts with in the browser. |
| **Backend** | Server-side logic/data that customers do not directly control. |
| **API** | A defined way for two software systems to exchange information. |
| **Supabase** | Optional backend service used here for database, functions and secure administration. |
| **Database** | Structured storage for information. |
| **Edge Function** | Small server-side code that can safely access private credentials and talk to APIs. |
| **Secret** | A private credential such as a token, password or service-role key. Never publish it. |
| **Environment variable** | A way to give a server a secret/config value without writing it into public source code. |
| **Loyverse** | Optional POS/catalog source from which products and prices can be synchronized. |
| **POS** | Point of Sale system used to manage sales/products. |
| **Cache** | A fast saved copy of data, used here so the menu does not need to contact Loyverse on every visit. |
| **Cron / scheduled job** | A task configured to run automatically at chosen times. |
| **RLS** | Row Level Security: database rules that control who may read or modify rows. |
| **Schema.org** | Structured metadata that helps search engines understand a business/menu. |
| **SEO** | Work that helps search engines understand and discover a website. |
| **Runtime configuration** | Settings changed while the system is running instead of editing source files. |
| **Local storage** | Browser storage that can persist values on one device. |
| **Session storage** | Browser storage that normally lasts only for the current tab/session. |
| **Test mode** | Temporary mode that bypasses opening hours only for testing and marks the order as a test. |
| **Deployment** | Publishing a tested version so people can use it online. |
| **Open source** | Source code published under a license that allows others to inspect, use and improve it. |
| **MIT License** | A permissive open-source license used by this project. |

## One useful rule

If a term involves a **password, token, secret or service-role key**, it belongs on the server side — not in GitHub Pages.
