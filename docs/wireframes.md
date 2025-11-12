# Shoot - Browser Extension Specification + UI Wireframes

## Overview
**Shoot** is a lightweight browser extension for quickly sharing the current page URL with friends or groups. It’s accessible via a translucent Floating Action Button (FAB) and a configurable hotkey. This doc contains implementation-ready specs and ASCII wireframes for the extension dropdown and three primary tabs.

---

## Table of Contents
1. Overview
2. Core Features
3. Technical Specifications
4. Data Model
5. UX Flow Summary
6. Security & Privacy
7. Developer Notes
8. Wireframes (ASCII) — Dropdown + Tabs

---

## Core Features (brief)
- Share current tab URL with single / multiple recipients or groups
- "Saved" contact for personal saves
- Friends discovery by User ID / Email; friend requests (approve/reject)
- Group creation and group chat-style link feed
- Translucent, positionable FAB + hotkey to open dropdown
- Profile management; authentication via GitHub & Google
- No guest mode — random username suggestions on signup

---

## Technical Specs (brief)
- Frontend: React + Tailwind or shadcn/ui; JS/HTML/CSS
- Backend: Node.js + Hono (or Express); REST + WebSocket/Supabase Realtime
- DB: Supabase/Firebase/MongoDB
- Auth: OAuth (Google, GitHub)
- Extension: Manifest v3; content script (inject FAB), service worker for background tasks
- Permissions: `activeTab`, `storage`, `identity`, `notifications`

---

## Data Model (summary)
See the message for sample JSON shapes (User, FriendRequest, Group, Message).

---

## Wireframes
Below are ASCII wireframes for the dropdown and the three tabs. Each wireframe includes key elements and notes for interactions and accessibility.

### Global UI Notes
- Dropdown width: ~420px (compact) — should be responsive to extension popup constraints
- Accessible via hotkey (default `Ctrl/Cmd + Shift + S`) or clicking FAB
- Keyboard navigation: Tab order, arrow keys for list selection, Enter to send
- FAB: small (~44px), translucent, draggable or repositionable via settings

---

### Dropdown - Default State (opened via FAB / hotkey)
```
+------------------------------------------------------------+
| Shoot  [Search 🔍]                      [Settings ⚙️] [X]   |
|------------------------------------------------------------|
| Tabs: [Friends]  [Add Friends]  [Groups]                   |
|------------------------------------------------------------|
|  << Tab content area (see respective tab wireframes) >>    |
|                                                            |
|  Message / Note: [____________________________________]     |
|                                                            |
|  Selected: [Alice] [Bob] [Saved]      [ Send ▶︎ ]           |
+------------------------------------------------------------+
```
Notes:
- Search box at top filters friends & groups by name/email
- Settings opens extension preferences (hotkey, FAB settings, notifications)
- A lightweight note field optional before sending a link

---

### Tab 1 — Friends (default)
```
+------------------------------------------------------------+
| Friends        (Sort: Recent / Alphabetical)               |
|------------------------------------------------------------|
| [Avatar] Alice        online        [checkbox]              |
| [Avatar] Bob          last seen 10m [checkbox]              |
| [Icon] Saved (you)    --            [checkbox]             |
| [Avatar] Devika       pending       [Request Pending]       |
| ...                                                        |
|------------------------------------------------------------|
| Footer: [Select All] [Clear]    [Create Group from selection]|
+------------------------------------------------------------+
```
Notes:
- "Saved" behaves as a special contact; messages to Saved store in personal history
- Checkboxes allow multi-select; keyboard-friendly row selection

---

### Tab 2 — Add Friends
```
+------------------------------------------------------------+
| Find users by User ID or Email                              |
| [Input: user@example.com or user-id] [Search 🔍]           |
|------------------------------------------------------------|
| Results:                                                   |
|  [Avatar] Harshul Kansal   harhsul#123    [Add / Request]   |
|  [Avatar] Priya Sharma     priya#456      [Add / Request]   |
|  No results? [Invite by email]                              |
|------------------------------------------------------------|
| Pending Requests (incoming):                               |
|  [Avatar] Raj         wants to connect      [Accept] [Reject]|
+------------------------------------------------------------+
```
Notes:
- Search must be resilient to capitalization and whitespace
- Show connection status badges: Connected / Pending / Requested

---

### Tab 3 — Groups
```
+------------------------------------------------------------+
| Groups                                                     |
| [Create Group +]                                           |
|------------------------------------------------------------|
| [Group Avatar] Team Links           (3 members)            |
|   latest: Harshul shared "article"  — 2m ago              |
| [Group Avatar] Design Crew          (8 members)            |
|   latest: Devika shared "figma"    — 30m ago              |
|------------------------------------------------------------|
| [Selected Group View — in-panel chat style]                 |
|  <Topbar: Group name | Members-count | Settings>            |
|  [ 10:12  ] Harshul: https://...                            |
|  [ 10:10  ] Priya: "Here's a screenshot"                   |
|------------------------------------------------------------|
| [Message field] [Attach screenshot/icon]   [Send ▶︎]        |
+------------------------------------------------------------+
```
Notes:
- Group creation flow: name → optional avatar → invite members → create
- Group messages are visible to all current members; owner can remove members

---

## Accessibility & Keyboard Shortcuts
- Hotkey: `Ctrl/Cmd + Shift + S` (configurable)
- Navigation: Arrow keys to move up/down lists, Space to toggle selection, Enter to send
- Screen-reader accessible labels for all interactive elements

---

## Settings Panel (quick)
```
+-----------------------------------+
| Settings                          |
| [ ] Show Floating Button (toggle) |
| FAB Opacity: [ 50% slider ]       |
| FAB Position: [ Bottom-right v]   |
| Hotkey: [ Ctrl+Shift+S ] (edit)   |
| Notifications: [On/Off toggle]    |
| Account: [Profile] [Log out]      |
+-----------------------------------+
```

---

## Developer Handoff Checklist
- Provide React component structure: PopupDropdown, TabFriends, TabAddFriends, TabGroups, FAB
- Content script for FAB injection and event handling
- Background worker for authentication/session and message delivery
- API endpoints: auth, user search, friend requests, message send, group management
- Provide Storybook stories for core components and interactions

---

## Next Steps (suggested)
1. Convert wireframes to simple Figma mockups or PNGs for visual reference
2. Break down features into issues (Auth, FAB, Friends, Groups, Messaging, Settings)
3. Prioritize an MVP: Share link to single friend + Saved contact + Auth

---

If you'd like, I can also:
- Produce pixel-perfect React component skeletons (single-file components) for each UI piece
- Create a prioritized backlog in markdown with tasks and estimated complexity

---

*End of document.*

