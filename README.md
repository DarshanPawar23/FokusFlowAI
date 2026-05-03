# 🚀 Fokus AI  
## Decentralized Skill Verification Infrastructure using Algorand

Fokus AI is an AI-powered learning and certification platform that combines  
**Generative AI + Algorand Blockchain** to create tamper-proof, verifiable digital certificates.

Instead of just issuing certificates, Fokus AI builds a **decentralized verification layer**  
that ensures authenticity, trust, and ownership of skills.

---

# 🧠 Problem

Traditional online certificates:
- Can be forged or edited
- Are stored in centralized systems
- Cannot be independently verified
- Lack trust and authenticity

---

# ✅ Our Solution

We store a **SHA256 certificate hash on Algorand blockchain**, making every certificate:

✔ Immutable  
✔ Publicly verifiable  
✔ Tamper-proof  
✔ Trustless  

Each certificate is generated as:

```
certificateHash = SHA256(userId + examId + score + certificateId)
```

On-chain mapping:

```
certificateId → certificateHash
```

---

# 🏗️ Architecture

Frontend (React)  
↓  
Backend (Node.js + MySQL)  
↓  
Algorand Smart Contract (Testnet)  
↓  
Public Verification Endpoint  

---

# 🔷 Blockchain Implementation

### Phase 1 — Smart Contract
- Installed AlgoKit
- Created stateful contract
- Implemented `issue_certificate`
- Stored certificateHash in global state
- Deployed to Algorand Testnet
- Obtained Application ID

### Phase 2 — Backend Integration
On exam pass (≥60%):
1. Generate certificateId (UUID)
2. Create SHA256 hash
3. Call smart contract:
   ```
   issue_certificate(certificateId, certificateHash)
   ```
4. Store blockchain transaction ID

### Verification Flow
```
recalculatedHash === storedHash === onChainHash
```
If true → Certificate is valid.

---

# 🤖 Generative AI Integration

### 1️⃣ AI Course Structuring
- Converts YouTube playlists into structured modules
- Generates learning roadmap & overview

### 2️⃣ AI Exam Generation
- Generates contextual MCQs
- Evaluates automatically
- Unlocks certificate on pass

AI ensures intelligent assessment before blockchain issuance.

---

# 🔐 Security Model

- Only certificate hash stored on-chain
- Immutable Algorand smart contract
- Backend-controlled wallet issuance
- Public verification endpoint

---

# 🌐 Why Algorand?

- Instant finality
- Low transaction fees
- Energy efficient
- Scalable smart contracts

Algorand enables real-world decentralized credential infrastructure.

---

# 🪪 Future Upgrade (Optional)

- Soulbound NFT Certificates
- Wallet-bound digital identity
- On-chain reputation layer

---

# 🧠 Tech Stack

Frontend: React, Tailwind  
Backend: Node.js, Express, MySQL  
Blockchain: Algorand Testnet, AlgoKit, Algorand JS SDK  
AI: Generative AI (Course structuring + Exam generation)

---

# 🏆 What This Is

Not a blockchain demo.

Fokus AI is:

> A Decentralized Skill Verification Engine

Building trust in digital education through AI + Blockchain.
