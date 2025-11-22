# MMM2027 Frontend

Next.js (TypeScript) frontend application for the MMM2027 project.

## Setup

1. Install dependencies:

```bash
npm install
```

This will install Next.js, React, TypeScript, and **Tailwind CSS**.

2. Create `.env.local` file:

```env
NEXT_PUBLIC_API_BASE_URL=http://backend-nginx/api/v1
NODE_ENV=development
```

3. Run development server:

```bash
npm run dev
```

## Docker

This frontend is containerized and orchestrated via the root `docker-compose.yml`.

To run locally without Docker:

```bash
npm run dev
```

## Project Structure

- `app/` - Next.js 13+ App Router
- `components/` - React components
- `lib/` - Utility functions and API client
- `types/` - TypeScript type definitions

## Styling

This project uses **Tailwind CSS** for styling. Tailwind is configured in:

- `tailwind.config.js` - Tailwind configuration
- `postcss.config.js` - PostCSS configuration
- `app/globals.css` - Global styles with Tailwind directives

You can use Tailwind utility classes directly in your components:

```tsx
<div className="flex items-center justify-center bg-blue-500 text-white p-4 rounded-lg">
  Hello World
</div>
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
