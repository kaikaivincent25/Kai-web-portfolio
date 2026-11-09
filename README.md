# React + Vite

## Owner dashboard

Open `/me/` on the deployed portfolio to sign in, review contact messages,
update their status, and edit the public profile and social links. The
dashboard is not linked in public navigation; its data and update endpoints
remain protected by the backend.

Deploy the backend changes before using the dashboard. Keep `ADMIN_API_KEY`
and `SECRET_KEY` only in the backend's environment. The dashboard exchanges
the key you enter for a temporary eight-hour session; it does not put the
key in the frontend bundle. Ensure the backend CORS allowlist includes the
portfolio's exact origin and permits the `Authorization` header. Keep the
Vercel `VITE_API_BASE_URL` pointed at the deployed backend API root ending in
`/api` (set it in Vercel if it is not already configured); do not put the
admin key there. The `/me/` route itself is served by the existing SPA rewrite.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
