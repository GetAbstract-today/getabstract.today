This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Prisma

This project uses [Prisma](https://www.prisma.io/) for the database. The schema defines `Url` (individual URLs with date and category) and `Newsletter` (full newsletter as Markdown with category).

### Setup

1. **Environment variable**  
   Create a `.env` file in the project root (or copy from `.env.example`) and set your PostgreSQL connection URL:

   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
   ```

2. **Generate the Prisma Client** (after cloning or changing the schema):

   ```bash
   npx prisma generate
   ```

3. **Create or update the database schema**  
   - First time or new migrations:
     ```bash
     npx prisma migrate dev --name <migration_name>
     ```
   - Sync schema without migration history (e.g. prototyping):
     ```bash
     npx prisma db push
     ```

### Commands

| Command | Description |
|--------|-------------|
| `npx prisma generate` | Generate Prisma Client from `prisma/schema.prisma` |
| `npx prisma migrate dev` | Create a new migration and apply it (development) |
| `npx prisma migrate deploy` | Apply pending migrations (production) |
| `npx prisma db push` | Push schema to the database without migrations |
| `npx prisma studio` | Open Prisma Studio to view and edit data |

### API endpoints

- **`GET /api/urls`** – List URLs (newest first).
- **`POST /api/urls`** – Create a URL. Body: `{ "url": "https://...", "date": "2025-02-21" (optional), "category": "ai" }`.
- **`GET /api/newsletters`** – List newsletters (newest first).
- **`POST /api/newsletters`** – Create a newsletter. Body: `{ "content": "# Title\n\nMarkdown...", "category": "ai" }`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
