ChainReport AI App is the **frontend interface** for generating and viewing AI-powered crypto token research reports. Users can search for tokens, request automated reports, and visualize key metrics and insights. It communicates with the ChainReport AI API to retrieve processed data.

**Key Features:**

* User-friendly dashboard for crypto token research.
* Search and filter tokens.
* Visualize on-chain metrics, social sentiment, and tokenomics.
* Download reports in PDF/CSV/JSON.
* Responsive design for desktop and mobile.

**Technology Stack:**

* **Framework:** React + TypeScript
* **State Management:** Redux / Zustand
* **Charts & Visualization:** Chart.js / Recharts
* **Styling:** Tailwind CSS
* **API Communication:** Axios / Fetch API
* **Deployment:** Vercel / Netlify

**Repository Structure:**

```
/chainreport-ai-app
├── /src
│   ├── /components      # React components
│   ├── /pages           # Page views
│   ├── /services        # API calls
│   ├── /store           # State management
│   └── /utils           # Helper functions
├── public               # Static assets
├── package.json
├── tsconfig.json
└── README.md
```

**Installation:**

```bash
git clone https://github.com/Lumintel/chainreport-ai-app.git
cd chainreport-ai-app
npm install
npm run dev
```

**Usage:**

* Open `http://localhost:3000` in your browser.
* Connect the frontend to a running instance of **ChainReport AI API** by setting the API base URL in `.env`.

**Environment Variables (`.env`):**

```
VITE_API_BASE_URL=http://localhost:8000
```

**Contribution Guidelines:**

* Use feature branches for new functionality.
* Follow ESLint / Prettier formatting rules.
* Write React component tests (Jest + React Testing Library).
* Submit pull requests with detailed descriptions.
