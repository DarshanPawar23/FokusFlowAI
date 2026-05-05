# 🚀 Fokus AI  
### AI-Powered Course Generation & Intelligent Certification

Fokus AI is an advanced AI-powered learning platform that transforms unstructured YouTube playlists into **structured, interactive courses**.

Powered by the **Groq Cloud API** and the **LLaMA 3.1 (8B Instant)** model, Fokus AI intelligently analyzes video content to:

- 📚 Generate structured course modules  
- 🧠 Create concise AI-driven summaries  
- 📝 Build dynamic assessments (MCQs)  
- 🎓 Automatically deliver professional certificates via email  

---

## 🧠 The Problem

Self-paced learning via YouTube often lacks:

- **Structure:** Playlists are disorganized or overwhelming  
- **Retention:** No workspace for notes or revision  
- **Validation:** No way to test knowledge or prove completion  
- **Efficiency:** Hours of content needed for basic understanding  

---

## ✅ Our Solution

Fokus AI automates the complete **"Learner → Certified" pipeline**:

### 🔹 1. AI Course Structuring  
Converts any YouTube playlist into well-organized modules using AI.

### 🔹 2. Smart Overviews  
Generates quick summaries so users understand content faster.

### 🔹 3. Dynamic Exam Engine  
Creates contextual MCQs to test real understanding.

### 🔹 4. Automated Certification  
Generates and emails professional certificates instantly after passing.

### 🔹 5. Integrated Notes System  
Allows users to write and store notes for every course.

---

## 🏗️ Tech Stack

- **Frontend:** React.js, Tailwind CSS  
- **Backend:** Node.js, Express.js  
- **Database:** MySQL  
- **AI Engine:** Groq Cloud API (LLaMA 3.1 - 8B Instant)  
- **Mailing:** Nodemailer (SMTP)  
- **PDF Generation:** PDFKit  
- **External APIs:** YouTube Data API v3  

---

## 🚀 Getting Started (All-in-One)

```bash
# ==============================
# 1️⃣ Clone the Repository
# ==============================

git clone https://github.com/your-username/fokus-ai.git
cd fokus-ai

# ==============================
# 2️⃣ Install Dependencies
# ==============================

npm install

cd client
npm install
cd ..

# ==============================
# 3️⃣ Environment Setup
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
# 4️⃣ Run Application
# ==============================

# Run backend
npm run dev

# Run frontend (open new terminal)
cd client
npm start
