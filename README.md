# Nyoraa — House of Brands (Static Website)

This is the production-ready static website for Nyoraa. It has been built to be highly performant, accessible, and easily deployable across any static hosting provider.

## Technology Stack

- **HTML5**: Semantic and accessible document structure.
- **Vanilla CSS**: Custom styling, responsive breakpoints, and animations defined in `globals.css`.
- **Vanilla JavaScript**: Handles component loading, scroll animations, and interactive elements.
- **GSAP (GreenSock)**: Used for smooth, high-performance scroll animations and timelines.
- **Tailwind CSS (CDN)**: Used for rapid utility-class styling on specific sections.

## Folder Structure

```
Nyoraa/
├── assets/             # Images, SVGs, and other media files
├── components/         # Reusable HTML components (Navbar, Footer)
├── globals.css         # Global styles, variables, and custom component CSS
├── index.html          # Homepage
├── about-us.html       # About Us page
├── coming-soon.html    # Coming Soon page
├── contacts-us.html    # Contact Us page
├── server.js           # Simple local development server
├── vercel.json         # Deployment configuration for Vercel
└── README.md           # This documentation
```

## Local Development & Testing

To test the website locally, you can use the provided Node.js server. This server is specifically designed to handle component fetching (`Navbar.html`, `Footer.html`) and local routing.

### Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.

### Setup Instructions

1. Open your terminal and navigate to the project directory.
2. Run the local development server:
   ```bash
   node server.js
   ```
   *Alternatively, if you use `npm`, you can run `npm run serve-html`.*
3. Open your browser and navigate to `http://localhost:3000`.

## Production Deployment

This project is fully optimized for deployment on Vercel, Netlify, GitHub Pages, or any standard web server (Apache/Nginx).

### Deploying to Vercel
The project includes a `vercel.json` file which automatically configures the correct URL rewrites (e.g., mapping `/about-us` to `/about-us.html`).
1. Connect your GitHub repository to Vercel or use the Vercel CLI.
2. Select the "Other" framework preset.
3. Deploy! Vercel will automatically detect the static files and serve them.

## Maintenance Notes

- **Component Loading**: The `Navbar` and `Footer` are injected dynamically using JavaScript (`fetch`). If you open the `.html` files directly in a browser (e.g., `file:///...`), CORS policies will block these components from loading. You **must** use a local server (`node server.js` or VS Code Live Server) to view the site locally.
- **CSS Modularity**: If you need to override Tailwind classes or add complex animations, refer to the custom CSS rules located at the bottom of `globals.css` (e.g., `.standards-section`).

## License
All rights reserved. Property of Nyoraa.
