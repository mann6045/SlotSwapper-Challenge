# SlotSwapper - Full Stack Technical Challenge (ServiceHive)

SlotSwapper is a full-stack peer-to-peer time-slot scheduling application. The core concept allows users to post their busy calendar slots as "swappable," browse other users' swappable slots, and request to trade.

This project was built as a technical challenge using the **MERN** stack (MongoDB, Express, React, Node.js) with JWT for authentication.


---

## 🛠️ Tech Stack

* **Frontend:**
    * React.js
    * React Router
    * React Context API (for global auth state)
    * Axios (for API requests)
* **Backend:**
    * Node.js
    * Express.js
* **Database:**
    * MongoDB (using MongoDB Atlas)
    * Mongoose (as the ODM)
* **Authentication:**
    * JSON Web Tokens (JWT)

---

## ✨ Core Features

* **User Authentication:** Secure sign-up and login using JWT.
* **Event Management:** Users can perform full CRUD operations on their personal calendar events.
* **Swappable Status:** Users can toggle their events between "BUSY" and "SWAPPABLE."
* **Marketplace:** A "Marketplace" page that displays all `SWAPPABLE` slots from *other* users.
* **Peer-to-Peer Swap Logic:**
    * Users can request a swap by selecting another user's slot and offering one of their own.
    * A modal is used to fetch and display the user's *own* swappable slots to offer.
* **Notification/Request Management:**
    * A "My Requests" page shows both incoming (awaiting response) and outgoing (pending) requests.
    * Users can `Accept` or `Reject` incoming swap requests.
* **Transactional Swap:** On "Accept," the `owner` field of the two event documents is exchanged, and both slots are set back to "BUSY."

---

## 🚀 How to Run Locally

To get this project running on your local machine, follow these steps.

### Prerequisites

* Node.js (v18 or later recommended)
* npm
* A (free) MongoDB Atlas account to get a database connection string.

---

### 1. Clone the Repository

```bash
git clone [https://github.com/your-username/SlotSwapper-Challenge.git](https://github.com/your-username/SlotSwapper-Challenge.git)
cd SlotSwapper-Challenge
