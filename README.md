# ShareNest — Community Item-Sharing Platform

ShareNest is a full-stack, real-time community resource-sharing platform designed for residential societies, apartment complexes, hostels, and local neighborhoods. Instead of everyone purchasing expensive tools, electronics, or event equipment that gets used once a year, ShareNest enables neighbors to lend and borrow items securely with an authorized two-way approval workflow, persistent MongoDB notifications, and live Socket.IO updates.

---

## 1. Technology Stack

### Frontend
- **Framework**: React 19 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (responsive, clean startup aesthetic)
- **Routing**: React Router DOM v7
- **Icons**: Lucide React
- **Real-Time WebSockets**: Socket.IO Client (`socket.io-client`)
- **State & Session**: React Context (`AuthContext` & `SocketContext`) with session restoration from `/api/auth/me`

### Backend
- **Runtime**: Node.js + Express.js
- **Language**: TypeScript (NodeNext ESM, executed with `tsx` / `tsc`)
- **Database**: MongoDB with Mongoose ODM (indexes, validation, relational references)
- **Authentication**: JWT authentication with secure HTTP-only cookies and Bearer token fallback
- **Password Security**: bcrypt password hashing
- **Real-Time Engine**: Socket.IO server with room-based user targeting (`user_<id>`)
- **File Uploads**: Multer image uploading for community items (`/uploads`)

---

## 2. Directory Structure

```
sharenest/
├── .env.example              # Frontend & full-stack environment variables template
├── package.json              # Client scripts & dependencies
├── tsconfig.json             # Root TypeScript config
├── vite.config.ts            # Vite config with /api and /socket.io reverse proxy
├── public/                   # Static assets
├── src/
│   ├── App.tsx               # App routing wrapped in AuthProvider & SocketProvider
│   ├── main.tsx              # React DOM entrypoint
│   ├── components/           # Reusable UI components
│   │   ├── Navbar.tsx        # Responsive navbar with notification center & badge counter
│   │   ├── Hero.tsx          # Landing hero section
│   │   ├── FeaturedItems.tsx # Showcase of nearby shared items
│   │   ├── HowItWorks.tsx    # 4-step borrower/lender guide
│   │   ├── WhyShareNest.tsx  # Benefits & safety features
│   │   └── Footer.tsx        # Footer navigation
│   ├── context/
│   │   ├── AuthContext.tsx   # Persistent user session, login, signup, logout
│   │   └── SocketContext.tsx # Socket.IO client, real-time push notifications & toast alerts
│   ├── lib/
│   │   └── api.ts            # Typed REST API client for backend communication
│   └── pages/
│       ├── Home.tsx          # Landing page
│       ├── Explore.tsx       # Live marketplace with search, category & availability filters
│       ├── ItemDetails.tsx   # Item view, dates selection, borrow request submission, reviews
│       ├── ShareItem.tsx     # Item creation with image upload or category presets
│       ├── Dashboard.tsx     # Full-featured Owner & Borrower dashboard with live DB metrics
│       ├── CommunitySetup.tsx# Join or create residential societies
│       ├── Login.tsx         # Login with 1-click verified demo accounts
│       └── Signup.tsx        # Registration with society selection
└── server/                   # Backend Express & MongoDB service
    ├── .env                  # Server environment configuration
    ├── .env.example          # Server environment placeholders
    ├── package.json          # Server dependencies & scripts
    ├── tsconfig.json         # Server TypeScript configuration
    ├── uploads/              # Local storage directory for user-uploaded item images
    └── src/
        ├── server.ts         # Express server, Socket.IO setup, route mounting, error handling
        ├── config/
        │   └── db.ts         # Mongoose MongoDB connection handler
        ├── models/           # Mongoose schemas & TypeScript interfaces
        │   ├── User.ts       # User model with bcrypt password hashing
        │   ├── Community.ts  # Residential communities
        │   ├── Item.ts       # Shared items with category, condition, location, availability
        │   ├── BorrowRequest.ts # Request lifecycle (Pending -> Approved -> Borrowed -> Returned)
        │   ├── Notification.ts  # Persistent MongoDB notification center
        │   ├── Review.ts     # User reviews & ratings
        │   └── Message.ts    # Internal request coordination chat
        ├── middleware/
        │   ├── authMiddleware.ts # JWT verification for cookies and Authorization header
        │   └── errorHandler.ts   # Centralized error handler
        ├── controllers/
        │   ├── authController.ts
        │   ├── itemController.ts
        │   ├── requestController.ts
        │   ├── notificationController.ts
        │   ├── communityController.ts
        │   └── reviewController.ts
        ├── routes/           # REST API routes
        ├── socket/
        │   └── index.ts      # Socket.IO connection and user room event emitters
        ├── seed.ts           # Database seeder with 4 verified demo users & rich sample items
        └── tests/
            └── workflow.test.ts # Automated end-to-end multi-user integration test suite
```

---

## 3. Quick Start & Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- MongoDB running locally at `mongodb://127.0.0.1:27017` (or MongoDB Atlas connection string)

### Step 1: Install Dependencies
Run the following from the project root:

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### Step 2: Seed the Database
Populate MongoDB with verified test accounts, communities, items, and reviews:

```bash
npm run seed
```

This creates four ready-to-test accounts:
- **User A (Item Owner)**: `alex@example.com` | Password: `Password123!`
  - Owns: *Full HD 1080p Smart Projector*, *Yonex Pro Badminton Set*, *Folding Event Table*
- **User B (Borrower)**: `jordan@example.com` | Password: `Password123!`
  - Owns: *The Psychology of Money*
- **Siddharth**: `siddharth@example.com` | Password: `Password123!`
- **Rahul**: `rahul@example.com` | Password: `Password123!`

### Step 3: Run the Application
Open two terminal windows:

**Terminal 1 (Backend Server on Port 5000):**
```bash
npm run dev:server
# or from server directory: npm run dev
```

**Terminal 2 (Frontend Client on Port 5173):**
```bash
npm run dev:client
# or: npm run dev
```

Visit **http://localhost:5173** in your browser.

---

## 4. Testing the Two-Browser Workflow

To test real-time two-way borrowing between separate user sessions:

1. **Browser Window 1 (Normal)**:
   - Navigate to `http://localhost:5173/login`
   - Click the 1-click demo button **Alex (Owner)** (`alex@example.com` / `Password123!`)
   - Navigate to the **Dashboard** → **Requests Received** tab.
2. **Browser Window 2 (Incognito or Second Browser)**:
   - Navigate to `http://localhost:5173/login`
   - Click the 1-click demo button **Jordan (Borrower)** (`jordan@example.com` / `Password123!`)
   - Go to **Explore Items** and select **Full HD 1080p Smart Projector**.
   - Pick a Start Date (e.g. tomorrow) and Return Date (e.g. 3 days later), add a note, and click **Send Borrow Request**.
3. **Observe Real-Time & Persistent Notifications**:
   - In Browser 1 (Alex), notice the **Notification bell badge** update instantly via Socket.IO, accompanied by a toast alert.
   - Alex opens the notification or visits **Dashboard** → **Requests Received**.
4. **Owner Decision**:
   - Alex clicks **Approve Request**.
   - In Browser 2 (Jordan), the status instantly changes to **Approved** with an approval notification!
5. **Pickup, Handover & Return**:
   - Alex clicks **Mark Ready for Pickup**.
   - Either Alex or Jordan clicks **Confirm Handover** → Request status becomes **Borrowed**, and the projector is automatically marked unavailable in the public marketplace.
   - Jordan clicks **Initiate Return** → Status updates to **Return Requested**.
   - Alex clicks **Confirm Return & Complete** → Status becomes **Returned**, and the projector is automatically marked available again.
   - Jordan clicks **Leave Review** to rate the item and leave feedback.
6. **Persistence Check**:
   - Refresh both browsers. All requests, statuses, and notifications remain intact from MongoDB.

---

## 5. Automated Integration Tests

ShareNest includes a test suite that programmatically validates all 22 lifecycle steps, concurrency limits, and security constraints:

```bash
npm run test:workflow
```

### Verified Test Cases:
1. Health check returns status 200 and `ok`.
2. User A (Owner) authenticates and receives JWT token.
3. User B (Borrower) authenticates and receives JWT token.
4. `GET /api/auth/me` validates session persistence.
5. User B searches and finds User A's projector.
6. Server rejects owner borrowing their own item.
7. Server rejects borrow request with return date earlier than start date.
8. Valid borrow request is saved in MongoDB with status `Pending`.
9. Duplicate active request protection blocks redundant requests.
10. Owner receives persistent notification in MongoDB.
11. Unauthorized user blocked from approving request.
12. Owner approves request → status updated to `Approved`.
13. Concurrency protection blocks approving overlapping booking for the same item.
14. Borrower receives persistent approval notification.
15. Owner marks item `Ready for Pickup`.
16. Handover confirmed → status updated to `Borrowed`.
17. Item availability is set to `false` during active loan.
18. Borrower requests return → status updated to `Return Requested`.
19. Owner confirms return → status updated to `Returned`.
20. Item availability is restored to `true` after return.
21. Borrower posts review; item rating and review count recalculate.
22. Internal request coordination message saved and delivered.

---

## 6. API Reference

All protected endpoints accept either a secure HTTP-only cookie (`token`) or an `Authorization: Bearer <token>` header.

### Health Check
- `GET /api/health` — Returns system status, uptime, and timestamp.

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new account (`name`, `email`, `password`, `community`).
- `POST /api/auth/login` — Log in with credentials and receive JWT.
- `POST /api/auth/logout` — Clear session cookie and invalidate client token.
- `GET /api/auth/me` — Retrieve currently authenticated user profile.
- `PATCH /api/auth/profile` — Update name, phone, bio, avatar, or community.

### Items (`/api/items`)
- `GET /api/items` — List items with filters (`search`, `category`, `community`, `available`, `sort`).
- `GET /api/items/:id` — Get item details populated with owner profile.
- `POST /api/items` — Add a new item (authenticated).
- `PATCH /api/items/:id` — Edit an item (owner only).
- `DELETE /api/items/:id` — Remove an item (owner only).
- `PATCH /api/items/:id/availability` — Toggle available/unavailable status.
- `POST /api/items/upload-image` — Upload an item photo via Multer.

### Borrow Requests (`/api/requests`)
- `POST /api/requests` — Submit a borrow request (`itemId`, `startDate`, `endDate`, `note`).
- `GET /api/requests/sent` — Get requests submitted by the logged-in user.
- `GET /api/requests/received` — Get requests received for the logged-in user's items.
- `GET /api/requests/:id` — View specific request details.
- `PATCH /api/requests/:id/approve` — Owner approves request (includes overlap check).
- `PATCH /api/requests/:id/reject` — Owner declines request with optional reason.
- `PATCH /api/requests/:id/cancel` — Borrower cancels request.
- `PATCH /api/requests/:id/ready-pickup` — Owner marks item ready for pickup.
- `PATCH /api/requests/:id/handover` — Confirm handover (marks status `Borrowed`, item `unavailable`).
- `PATCH /api/requests/:id/return-request` — Borrower requests return.
- `PATCH /api/requests/:id/confirm-return` — Owner confirms return (marks item `available`).
- `GET /api/requests/:id/messages` — Get internal coordination chat messages.
- `POST /api/requests/:id/messages` — Send coordination chat message.

### Notifications (`/api/notifications`)
- `GET /api/notifications` — Retrieve notifications with unread count.
- `PATCH /api/notifications/:id/read` — Mark single notification as read.
- `PATCH /api/notifications/read-all` — Mark all notifications as read.

### Communities (`/api/communities`)
- `GET /api/communities` — List societies and member/item counts.
- `POST /api/communities` — Create a new community.
- `POST /api/communities/join` — Join an existing community.

### Reviews (`/api/reviews`)
- `POST /api/reviews` — Submit review for an item (`itemId`, `rating`, `comment`).
- `GET /api/reviews/item/:itemId` — Get all reviews for an item.

---

## 7. Security & Concurrency Design

1. **Authentication Integrity**: Passwords hashed using bcrypt with salt rounds. Tokens signed using JSON Web Tokens (JWT) with 7-day expiration.
2. **Session Persistence**: Sessions survive page reloads and browser restarts through secure cookie/bearer token validation against `/api/auth/me`.
3. **Server-Side Authorization**: Sensitive actions (approving requests, marking handover, editing items) verify ownership on the server; client-provided IDs are never blindly trusted.
4. **Concurrency Safety**: When an owner approves a borrow request, the server executes a query check to ensure no overlapping booking is already `Approved` or `Borrowed` for those dates.
5. **Duplicate Request Prevention**: Users are prohibited from submitting multiple concurrent active requests for the exact same item.
6. **No Committed Secrets**: Database credentials and secrets are kept in `.env` (gitignored), with `.env.example` containing clean placeholders.

---

## 8. License

This project is built for community sharing and open collaboration.
