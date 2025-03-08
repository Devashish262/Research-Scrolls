# Research Scrolls 📚🔍

<div align="center">

![Research Scrolls Logo](https://i.imgur.com/placeholder.png)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?logo=react)](https://reactjs.org/)
[![Powered by TypeScript](https://img.shields.io/badge/Powered%20by-TypeScript-3178C6?logo=typescript)](https://www.typescriptlang.org/)

**A modern application for browsing and discovering research papers from multiple academic sources.**

[Features](#features) • [Installation](#installation) • [Usage](#usage) • [Contributing](#contributing) • [License](#license)

</div>

<details open>
<summary><h2>✨ Features</h2></summary>

- **🔎 Multi-Source Search**: Search across multiple research paper repositories including arXiv, PubMed, Semantic Scholar, and more
- **🏷️ Subject Filtering**: Filter papers by subject categories
- **📚 Source Selection**: Choose which paper sources to include in your search
- **♾️ Infinite Scrolling**: Seamlessly browse through papers with TikTok/Reels-style navigation
- **🌙 Dark Theme**: Easy on the eyes for extended reading sessions
- **📝 Abstract Preview**: Read paper abstracts before deciding to view the full paper
- **📱 Mobile-Friendly**: Responsive design with touch gesture support
- **🔖 Bookmarking**: Save papers for later reading
- **📊 Citation Export**: Export citations in multiple formats



<details>
<summary><h2>🚀 Installation</h2></summary>

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- npm (included with Node.js)

### Step-by-Step Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/research-scrolls.git
   cd research-scrolls
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser and navigate to:**
   ```
   http://localhost:5173/
   ```

### Quick Start Scripts

For Windows users, we provide several convenience scripts:

- **run-direct.bat**: Double-click to run the application directly
- **run-direct.ps1**: PowerShell script with robust error handling

</details>

<details>
<summary><h2>🧰 Project Structure</h2></summary>

```
research-scrolls/
├── client/               # Frontend application
│   ├── src/              # Source code
│   │   ├── components/   # UI components
│   │   ├── lib/          # Utilities and API integrations
│   │   ├── pages/        # Application pages
│   │   └── ...
├── server/               # Backend server
│   ├── api/              # API routes
│   ├── services/         # Business logic
│   └── ...
├── shared/               # Shared code between client and server
│   └── schema.ts         # Database schema and types
└── ...
```

</details>

<details>
<summary><h2>🛠️ Technologies Used</h2></summary>

### Frontend
- **Framework**: [React](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [React Query](https://tanstack.com/query/latest)
- **Routing**: [Wouter](https://github.com/molefrog/wouter)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express](https://expressjs.com/)
- **Database ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Validation**: [Zod](https://zod.dev/)

</details>

<details>
<summary><h2>🔌 API Integrations</h2></summary>

Research Scrolls integrates with several academic paper repositories:

| Repository | Focus Area | API Documentation |
|------------|------------|-------------------|
| **arXiv** | Physics, Mathematics, Computer Science | [API Docs](https://arxiv.org/help/api/) |
| **PubMed** | Medical and biological research | [API Docs](https://www.ncbi.nlm.nih.gov/home/develop/api/) |
| **Semantic Scholar** | AI-powered research paper search | [API Docs](https://www.semanticscholar.org/product/api) |
| **bioRxiv** | Biology preprints | [API Docs](https://api.biorxiv.org/) |
| **Nature** | Leading scientific journal | [API Docs](https://dev.nature.com/) |
| **Science** | Peer-reviewed research | [API Docs](https://www.sciencemag.org/about/api) |

</details>

<details>
<summary><h2>📱 Usage</h2></summary>

### Basic Search
1. Enter your search terms in the search bar
2. Select the sources you want to include
3. Browse through the results with the infinite scroll interface

### Advanced Filtering
1. Click on the "Filters" button
2. Select subject categories, date ranges, and other criteria
3. Apply filters to refine your search results

### Saving Papers
1. Click the bookmark icon on any paper
2. Access your saved papers in the "Bookmarks" section
3. Export citations in your preferred format

![Usage Example](https://i.imgur.com/placeholder2.gif)

</details>

<details>
<summary><h2>🤝 Contributing</h2></summary>

We welcome contributions from the community! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting a pull request.

### Development Workflow
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code of Conduct
Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

</details>

<details>
<summary><h2>📄 License</h2></summary>

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

</details>

<details>
<summary><h2>🙏 Acknowledgments</h2></summary>

- Thanks to all the academic repositories that provide APIs for accessing research papers
- Inspired by the need for a unified research paper browsing experience
- Special thanks to all [contributors](https://github.com/yourusername/research-scrolls/graphs/contributors) who have helped improve this project

</details>

<details>
<summary><h2>📊 Project Status</h2></summary>

Research Scrolls is currently in active development. We are working on the following features:

- [ ] User accounts and personalized recommendations
- [ ] Citation management system
- [ ] PDF annotation tools
- [ ] Research collaboration features
- [ ] Mobile app versions

</details>

<details>
<summary><h2>📬 Contact</h2></summary>

- **Project Maintainer**: [Your Name](https://github.com/yourusername)
- **Email**: your.email@example.com
- **Twitter**: [@yourhandle](https://twitter.com/yourhandle)
- **Discord**: [Join our community](https://discord.gg/example)

</details>

---

<div align="center">

Made with ❤️ by the Research Scrolls Team

**[⬆ Back to Top](#research-scrolls-)**

</div> 
