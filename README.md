# Cade Ramsey Personal Website

A static portfolio for job applications and professional networking.

## Files

- `index.html`: welcome page, portrait, and profile and contact links.
- `experience.html`: filterable work and service experience with expandable details.
- `school-projects.html`: four placeholder cards for future coursework projects.
- `interests.html`: coding projects, ancient American civilizations, and running.
- `books.html`: a keyboard-accessible shelf of three favorites and a book suggestion form.
- `styles.css`: shared layout, typography, responsive styling, and interaction states.
- `site.js`: navigation, filters, disclosures, book selection, and suggestion email drafts and copying.
- `assets/`: original portrait and Handshake logo.

## Preview

Serve this folder with any static web server, or open `index.html` in a browser. No build step or package installation is needed. All five pages use relative links and work on GitHub Pages under the repository path.

## Interaction and accessibility

The mobile menu supports Escape and restores focus. Experience and project filters update their visible result counts. Experience details use native HTML disclosures. The bookshelf supports arrow keys, Home, and End. Contact information remains linked, with a separate email copy button. All content remains readable without JavaScript, and reduced-motion preferences are respected.

## Book suggestions

The form below the three favorite books asks for a book title, an optional author, and an optional recommendation note. It opens a prefilled email to `cramsey8@byu.edu`; the visitor must send that draft from their own email app. It does not send or store submissions on the website. A copy button supports visitors who prefer webmail, and the email link remains available without JavaScript.

For direct browser submissions, connect a form service such as Formspree after creating an account and verifying the destination email. Use the unique HTTPS endpoint from the form's Integration tab, replace the mailto action with it, and replace the email-draft submit handler with the service's POST flow and real success/error handling. Keep the current working email path until the endpoint is configured; never publish a placeholder endpoint or report a submission as sent before it is accepted.

## Hosting

GitHub Pages serves the site from the root of `main`. Keep `.nojekyll` in the publishing root. Preserve any custom domain settings and `CNAME` file managed through GitHub Pages.
