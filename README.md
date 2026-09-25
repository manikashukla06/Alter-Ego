# Alter-Ego
Create the version of your highest potential .
# 🛡️ ALTER — Identity Engineering Engine

> *"Who would you become if nobody was watching?"*

**ALTER** is a dark, cinematic identity engineering web application built for tech-team project selection. Rather than a standard habit tracker or SaaS dashboard, ALTER treats personal transformation as an identity dossier system—helping users define a disciplined alter ego, enforce non-negotiable rules, track daily execution, and conduct nightly reflections via **The Mirror**.

---

## 🌟 The 5 Core Views

1. **Cinematic Landing Page (`/`)**: Dark, minimal editorial design showcasing the 3-step paradigm: *Define Yourself*, *Build Your Identity*, *Become*.
2. **Create Alter Ego (`/create`)**: Interactive form capturing name, persona description, core traits selection, non-negotiable rules, and primary objectives.
3. **Alter Ego Dashboard (`/dashboard`)**: Dossier view with live consistency percentage calculation, interactive habit checklist, identity code rules, and cinematic **`[ ENTER MODE ]`** mode switcher animation.
4. **The Mirror (`/mirror`)**: Nightly reflection interface comparing *Intention* vs *Real Action* vs *Obstacle Gap*, maintaining a persistent reflection log.
5. **Profile / Identity Breakdown (`/identity`)**: Quantitative trait visualization (Discipline, Confidence, Curiosity, Focus), goal manager, and live Prisma Schema Inspector.

---

## 🏗️ Architecture & Database Blueprint

### Relational Schema (`schema.prisma`)
```text
User 1 ── 1 AlterEgo 1 ── 𝛴 Habits
                     1 ── 𝛴 Goals
                     1 ── 𝛴 Reflections
