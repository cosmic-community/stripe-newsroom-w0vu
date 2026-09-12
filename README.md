# Stripe Newsroom
![App Preview](https://imgix.cosmicjs.com/473c9a80-ae65-11f1-a73f-9d0b2ea70ade-generated-1789188543466.jpg?w=1200&h=630&fit=crop&auto=format,compress)

A Stripe-style corporate newsroom website built with Next.js and [Cosmic](https://www.cosmicjs.com). Powered entirely by your existing `newsroom` content — 98 articles with rich-text content, featured images, and SEO metadata.

## Features

- 🏠 Angled-hero homepage with featured article spotlight and latest articles grid
- 📰 Paginated newsroom index with year filtering for all articles
- 📄 Beautiful article detail pages with formatted dates and prose-styled rich text
- 🔗 "More from the newsroom" related articles grid
- 🔍 SEO metadata, Open Graph images, and sitemap.xml
- 🎨 Stripe-inspired design: indigo accents, navy dark sections, pill buttons, arrow-link CTAs
- 📱 Fully responsive and accessible

## Clone this Project

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Project](https://img.shields.io/badge/Clone%20this%20Project-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmicjs.com/projects/new?clone_bucket=6aa4d7aaa994e35dd25c853e&clone_repository=6aa4db40a994e35dd25c859d)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> No content model prompt provided - app built from existing content structure

### Code Generation Prompt

> Build a Next.js application for a company website called "Stripe Newsroom". The content is managed in Cosmic CMS with the following object types: newsroom. Create a beautiful, modern, responsive design with a homepage and pages for each content type.
>
> User instructions: A Stripe-style corporate newsroom website built on the existing "newsroom" object type (98 published articles with fields: content (rich-text), featured_image, published_at, seo_title, seo_description).
>
> DESIGN — closely emulate stripe.com:
> - Full-bleed home hero using this background image: https://imgix.cosmicjs.com/473c9a80-ae65-11f1-a73f-9d0b2ea70ade-generated-1789188543466.jpg — apply it as a cover-fitted background with a subtle dark overlay and an angled (skewed) bottom edge like Stripe's signature diagonal hero cut. Hero headline "Newsroom", subhead about Stripe's announcements, and a light/white nav bar floating over it.
> - Typography: Inter / system sans, tight tracking, large bold headlines, generous whitespace.
> - Palette: Stripe indigo (#635BFF) as primary accent, slate/navy (#0A2540) for dark text and dark sections, #F6F9FC for light section backgrounds, white cards.
> - Components: pill-shaped buttons with hover lift, arrow-link CTAs ("Read more →") that nudge on hover, subtle card shadows and rounded-xl corners, thin dividers, gradient accent underlines.
> - Fully responsive, accessible, fast.
>
> PAGES:
> 1. Home (/): angled gradient hero, featured/latest article spotlight with large image, then a responsive grid of recent newsroom articles (image, date, title, excerpt), a dark navy stats/CTA band, and footer.
> 2. Newsroom index (/newsroom): paginated grid of all 98 articles sorted by published_at descending, with year filtering.
> 3. Article detail (/newsroom/[slug]): large featured image, formatted date, article title, rendered rich-text content with proper prose styling, and a "More from the newsroom" related grid at the bottom. Use seo_title/seo_description for metadata.
> 4. 404 page styled to match.
>
> Include SEO metadata, Open Graph images from featured_image, and a sitemap.

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## Technologies

- [Next.js 16](https://nextjs.org/) — App Router, Server Components
- [Cosmic](https://www.cosmicjs.com) — Headless CMS
- TypeScript (strict mode)
- Tailwind CSS + `@tailwindcss/typography`
- Bun (package manager & runtime)

## Getting Started

### Prerequisites
- [Bun](https://bun.sh) installed
- A Cosmic account and bucket with a `newsroom` object type

### Installation

```bash
bun install
```

Set up your environment variables (see below), then run:

```bash
bun run dev
```

Visit `http://localhost:3000`.

## Cosmic SDK Examples

```typescript
import { cosmic } from '@/lib/cosmic'

// Fetch all newsroom articles
const response = await cosmic.objects
  .find({ type: 'newsroom' })
  .props(['id', 'slug', 'title', 'metadata'])
  .depth(1)

// Fetch a single article by slug
const { object: article } = await cosmic.objects
  .findOne({ type: 'newsroom', slug: 'my-article-slug' })
  .props(['id', 'slug', 'title', 'metadata'])
  .depth(1)
```

## Cosmic CMS Integration

This app reads from your Cosmic bucket's `newsroom` object type:

| Field | Type | Usage |
|---|---|---|
| `title` | text | Article headline |
| `content` | rich-text | Full article body (rendered with typography styling) |
| `featured_image` | file | Hero/card images, Open Graph images |
| `published_at` | date | Sorting, display date, year filtering |
| `seo_title` | text | Page `<title>` and Open Graph title |
| `seo_description` | text | Meta description and Open Graph description |

All read operations use draft-preview-aware fetching so edits in Cosmic can be previewed live from the dashboard.

## Deployment Options

### Vercel
1. Push this repository to GitHub
2. Import the project into [Vercel](https://vercel.com)
3. Add the environment variables below in the Vercel dashboard
4. Deploy

### Netlify
1. Push this repository to GitHub
2. Import the project into [Netlify](https://netlify.com)
3. Set build command to `bun run build` and publish directory to `.next`
4. Add the environment variables below in the Netlify dashboard
5. Deploy

### Environment Variables

Set these in your hosting provider's dashboard:

```
COSMIC_BUCKET_SLUG=your-bucket-slug
COSMIC_READ_KEY=your-read-key
COSMIC_WRITE_KEY=your-write-key
```
<!-- README_END -->