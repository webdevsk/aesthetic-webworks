# Server Setup

1. Install dependencies:

```bash
npm install
```

1. Set up your PostgreSQL database and update the .env file with your database credentials:

```env
DATABASE_URL=postgres://username:password@localhost:5432/database_name
PORT=3001
UPLOAD_DIR=uploads
```

1. Run database migrations:

```bash
npm run db:push
```

1. Start the development server:

```bash
npm run dev
```

## API Endpoints

### GET /api/projects

Get all projects with their categories

### GET /api/categories

Get all categories

### GET /api/testimonials

Get all testimonials

### POST /api/projects

Create a new project

- Form data:
  - title: string
  - image: file (optional)
  - categories: string (comma-separated category titles)
  - isLatest: boolean (optional)

### POST /api/categories

Create a new category

- JSON body:
  - title: string

### POST /api/testimonials

Create a new testimonials

- Form data:
  - authorName: string
  - authorCompany: string (optional)
  - authorImage: file (optional)
  - content: string

## File Upload Limits

- Maximum file size: 1MB
- Allowed file types: JPEG, PNG, WebP
