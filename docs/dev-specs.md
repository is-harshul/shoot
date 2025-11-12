# Shoot - Browser Extension Specification

## Overview
**Shoot** is a collaborative browser extension designed to make link sharing simple and instant.  
Users can share website links with their friends or groups directly from any webpage through a floating action button or a hotkey-triggered dropdown interface.

---

## 🧩 Core Features

### 1. Link Sharing
- Allow users to instantly share the current page URL with:
  - Individual friends
  - Multiple selected users
  - Groups
  - A special **"Saved"** contact (self-chat) to save links for later
- A **dropdown UI** (triggered via hotkey or extension icon) will contain:
  - **Tab 1: Friends** — list of connected users + “Saved”
  - **Send button** for one or multiple recipients
  - Optional text/note field before sending

---

### 2. Friends & Discovery
- **Tab 2: Add Friends**
  - Search for users by **User ID** or **Email**
  - Send **connection requests**
  - Approve/Reject incoming friend requests
- Each friend entry shows:
  - Display name
  - Avatar
  - Connection status (`Connected`, `Pending`, `Requested`)

---

### 3. Groups
- **Tab 3: Groups**
  - Create new groups
  - Invite friends to join
  - Send messages/links to group chat
  - Display messages from all members in chronological order
  - Option to rename or delete a group (owner-only)

---

### 4. Floating Action Button (FAB)
- A **translucent floating button** visible on all webpages
- Default position: bottom-right (configurable)
- Actions:
  - On click → opens dropdown menu (same as hotkey trigger)
- Visibility:
  - User setting to **show/hide FAB**
  - Option to **adjust opacity or position**

---

### 5. Authentication & User Management
- **Login Providers:**
  - GitHub
  - Google
- **No guest mode**
- On first signup:
  - Generate a random username suggestion (editable)
  - Validate username availability
- **Profile Management:**
  - Change name
  - Change/verify email
  - Choose/upload avatar

---

### 6. Notifications
- Show toast notifications or browser notifications for:
  - New link received
  - Friend request received/accepted
  - Group invites/messages

---

## ⚙️ Technical Specifications

### Frontend
- **Framework:** React (with Vite or CRA)
- **Languages:** JavaScript, HTML, CSS
- **UI Libraries:** Tailwind CSS or shadcn/ui (preferred)
- **State Management:** Zustand / Redux Toolkit (optional)
- **Routing:** React Router (for in-extension navigation)
- **Hotkey:** Configurable (default: `Ctrl+Shift+S` or `Cmd+Shift+S`)

### Backend
- **Framework:** Node.js with **Hono** or Express
- **Database:** Supabase / Firebase / MongoDB (open choice)
- **Authentication:** OAuth (Google, GitHub)
- **API Architecture:** REST (JSON-based)
- **Realtime updates:** WebSocket or Supabase Realtime for link delivery

### Browser Extension
- **Manifest Version:** v3
- **Content Scripts:**
  - For injecting the floating button
- **Background Service Worker:**
  - Handles auth sessions, notifications, and message polling
- **Permissions Needed:**
  - `activeTab`, `storage`, `identity`, `notifications`

---

## 🧠 Data Model Overview

### User
```json
{
  "id": "uuid",
  "username": "string",
  "email": "string",
  "avatar_url": "string",
  "friends": ["user_id"],
  "groups": ["group_id"]
}
```

### Friend Request
```json
{
  "from_user": "user_id",
  "to_user": "user_id",
  "status": "pending | accepted | rejected",
  "created_at": "timestamp"
}
```

### Group
```json
{
  "id": "uuid",
  "name": "string",
  "members": ["user_id"],
  "owner_id": "user_id",
  "created_at": "timestamp"
}
```

### Message / Link Share
```json
{
  "id": "uuid",
  "from_user": "user_id",
  "to_user": "user_id | group_id | saved",
  "type": "link | text",
  "content": "string",
  "timestamp": "timestamp"
}
```

---

### 🧭 UX Flow Summary

- User Login: via GitHub/Google → username auto-suggest → profile setup

- Add Friends: search → send/accept requests

- Share Link:
    - On any website → press hotkey or click floating button
    - Dropdown appears → choose Tab (Friends / Groups) → select recipients → click Send

- Received Links: appear in message list or notification

- Groups: create → share → chat-style feed

---

### 🔐 Security & Privacy

- OAuth-based authentication

- Store minimal data (no browsing history)

- Links/messages encrypted in transit (HTTPS + WebSocket over WSS)

- Option to delete account and data permanently

---

### 🧰 Developer Notes

- Follow modular structure for maintainability (/content, /popup, /background, /api)

- Use ESLint + Prettier for code formatting

- Implement unit tests for core utilities

- Keep bundle size optimized for extension store limits

---

### 🚀 Future Enhancements

- Link preview thumbnails

- Reactions / emoji support in chats

- Browser sync (share settings across devices)

- Dark/light mode toggle

- Chrome + Firefox support

---

### 🏁 Summary
Shoot streamlines the way users share links — instantly, socially, and natively within their browser.
With friend connections, groups, and a quick-access floating button, it blends productivity with simplicity.

---
