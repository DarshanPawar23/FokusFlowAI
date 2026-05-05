# 🚀 Fokus AI  
### AI-Powered Course Generation & Intelligent Certification

Fokus AI is an advanced learning platform that transforms static YouTube playlists into structured, interactive educational experiences. By leveraging the **Groq Cloud API** and **Llama 3**, it automates course curation, provides AI-driven assessments, and issues professional certificates directly to a user's inbox.

---

## 🧠 The Problem

Self-paced learning via YouTube often lacks:

- **Structure:** Playlists are often disorganized or overwhelming.  
- **Retention:** No built-in workspace to store and organize notes.  
- **Validation:** No formal way to test knowledge or receive proof of completion.  
- **Synthesis:** Users have to watch hours of content just to get a high-level overview.  

---

## ✅ Our Solution

Fokus AI automates the "Learner-to-Certified" pipeline through four core pillars:

1. **AI Course Structuring**  
   Converts any YouTube playlist URL into modular course sections using the Groq API.

2. **Smart Overviews**  
   Generates AI-driven summaries of course content for quick understanding.

3. **Dynamic Exam Engine**  
   Generates contextual MCQs based on the video content to validate learning.

4. **Automated Certification**  
   Upon passing an exam, a professional certificate is generated and sent via Nodemailer.

5. **Integrated Note-Taking**  
   A dedicated area to write and store study notes for every course.

---

## 🏗️ Tech Stack

- **Frontend:** React.js, Tailwind CSS  
- **Backend:** Node.js, Express.js  
- **Database:** MySQL  
- **AI Engine:** Groq Cloud API (Llama 3 Models)  
- **Mailing:** Nodemailer (SMTP)  
- **PDF Logic:** PDFKit for certificate generation  
- **APIs:** YouTube Data API v3  

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/fokus-ai.git
cd fokus-ai

## ⚙️ Setup & Run (All-in-One)

```bash
# ==============================
# 1️⃣ Install Dependencies
# ==============================

# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..

# ==============================
# 2️⃣ Environment Setup
# ==============================

# Create a .env file in root and add:

PORT=5000
JWT_SECRET=your_jwt_secret

DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=fokus_ai
DB_PORT=3306

YT_API_KEY=your_youtube_api_key
GROQ_API_KEY=your_groq_api_key

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# ==============================
# 3️⃣ Run Application
# ==============================

# Run backend (from root)
npm run dev

# Run frontend (open new terminal)
cd client
npm start
