# socket-io-chat-app
# Real-Time MERN Stack Chat Application

A full-stack real-time chat application built with MongoDB, Express, React, and Node.js. This project demonstrates deployment, CI/CD integration, environment configuration, and monitoring for production-ready MERN applications.

---

## Live URLs

- **Frontend (React):** https://real-time-communication-with-socket-io-oroyinloye-x8-832smlws7.vercel.app
- **Backend (Express API):** https://chat-server-hztf.onrender.com

---

## Tech Stack

- **Frontend:** React, Socket.IO Client
- **Backend:** Node.js, Express, Socket.IO Server
- **Database:** MongoDB Atlas
- **Deployment:** Render (Backend), Vercel (Frontend)
- **CI/CD:** GitHub Actions
- **Monitoring:** Logtail + UptimeRobot

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/oroyinloye/socket-io-chat-app.git
cd your-repo-name

## Install Dependencies
npm install
cd client
npm install

## Environment Variables
cp .env.example .env
cp client/.env.example client/.env

## Update with your credentials:
# .env
PORT=5000
MONGO_URI=http://10.62.37.55:3000/

## Deployment Guide
## Backend (Render)
Push your code to GitHub
Create a new Web Service on Render
Set:
Build Command: npm install && cd client && npm install && npm run build
Start Command: node server.js
Environment Variables: Add PORT, MONGO_URI

## Frontend (Vercel)
Go to Vercel
Import your GitHub repo
Set client/ as the root directory
Add environment variables if needed

CI/CD Pipeline
✅ GitHub Actions
CI/CD is configured using .github/workflows/deploy.yml. On every push to main, the pipeline:

Installs dependencies

Runs tests

Deploys to Vercel and Render

📸 Screenshots

## Monitoring & Logging
## Monitoring
UptimeRobot: Tracks availability of frontend and backend URLs
Status Page: https://localhost:5000/api/hello

## Logging
Logtail: Integrated with Express for structured logging
Logs include request metadata, errors, and performance metrics

## Project Structure
Code
├── client/              # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── models/              # Mongoose models
├── routes/              # Express routes
├── server.js            # Entry point for backend
├── .env.example         # Environment variable template
├── .github/workflows/   # CI/CD config
└── README.md

## Submission Checklist
[x] MERN stack application code
[x] CI/CD configuration files
[x] .env.example templates
[x] Deployment scripts and configuration
[x] Screenshots of CI/CD pipeline
[x] Monitoring documentation
[x] URLs to deployed frontend and backend
[x] Regular commits pushed to GitHub

## Maintenance Procedures
Weekly health checks via UptimeRobot
Log review every 48 hours via Logtail dashboard
Auto-deploy on push to main via GitHub Actions
Manual rollback via Render/Vercel dashboard if needed

## Instructor Notes
This project was submitted via GitHub Classroom. All required components are included and documented. Please refer to the autograding configuration for automated checks.
