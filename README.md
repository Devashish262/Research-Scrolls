# Research Scrolls

A modern application for browsing and discovering research papers from multiple academic sources.

![Research Scrolls](https://i.imgur.com/placeholder.png)

## Features

- **Multi-Source Search**: Search across multiple research paper repositories including arXiv, PubMed, Semantic Scholar, and more
- **Subject Filtering**: Filter papers by subject categories
- **Source Selection**: Choose which paper sources to include in your search
- **Infinite Scrolling**: Seamlessly browse through papers with TikTok/Reels-style navigation
- **Dark Theme**: Easy on the eyes for extended reading sessions
- **Abstract Preview**: Read paper abstracts before deciding to view the full paper
- **Mobile-Friendly**: Responsive design with touch gesture support

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- npm (included with Node.js)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/research-scrolls.git
   cd research-scrolls
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173/
   ```

### Running with Scripts

For Windows users, we provide several convenience scripts:

- **run-direct.bat**: Double-click to run the application directly
- **run-direct.ps1**: PowerShell script with robust error handling

## Project Structure

```
research-scrolls/
├── client/               # Frontend application
│   ├── src/              # Source code
│   │   ├── components/   # UI components
│   │   ├── lib/          # Utilities and API integrations
│   │   ├── pages/        # Application pages
│   │   └── ...
│   └── ...
├── shared/               # Shared code between client and server
│   └── schema.ts         # Database schema and types
└── ...
```

## Technologies Used

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS
- **State Management**: React Query
- **Routing**: Wouter
- **Animation**: Framer Motion
- **UI Components**: Radix UI

## API Integrations

Research Scrolls integrates with several academic paper repositories:

- **arXiv**: Physics, Mathematics, Computer Science, and more
- **PubMed**: Medical and biological research
- **Semantic Scholar**: AI-powered research paper search
- **bioRxiv**: Biology preprints
- **Nature**: Leading scientific journal
- **Science**: Peer-reviewed research

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Thanks to all the academic repositories that provide APIs for accessing research papers
- Inspired by the need for a unified research paper browsing experience 