# Cade Ramsey Personal Website

A static portfolio for job applications and professional networking.

## Files

- `index.html`: welcome page, portrait, and profile and contact links.
- `experience.html`: filterable work and service experience with expandable details.
- `school-projects.html`: four placeholder cards for future coursework projects.
- `interests.html`: coding projects, ancient American civilizations, and running.
- `books.html`: a keyboard-accessible bookshelf and a placeholder for another book.
- `styles.css`: shared layout, typography, responsive styling, and interaction states.
- `site.js`: navigation, filters, disclosures, book selection, and email copying.
- `assets/`: original portrait and Handshake logo.

## Preview

Serve this folder with any static web server, or open `index.html` in a browser. No build step or package installation is needed. All five pages use relative links and work on GitHub Pages under the repository path.

## Interaction and accessibility

The mobile menu supports Escape and restores focus. Experience and project filters update their visible result counts. Experience details use native HTML disclosures. The bookshelf supports arrow keys, Home, and End. Contact information remains linked, with a separate email copy button. All content remains readable without JavaScript, and reduced-motion preferences are respected.

## Hosting

GitHub Pages serves the site from the root of `main`. Keep `.nojekyll` in the publishing root. Preserve any custom domain settings and `CNAME` file managed through GitHub Pages.
