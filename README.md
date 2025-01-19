# Aesthetic Webworks - A Web Design and Development agency landing page

A modern, full-stack web application showcasing a portfolio website with admin dashboard capabilities. This project demonstrates proficiency in both frontend and backend development using modern technologies and best practices.

## Tech Stack

### Frontend

- **Next.js 15** with TypeScript
- **React 19** for UI components
- **TailwindCSS** for styling
- **Shadcn UI** for accessible component primitives
- **Motion** for animations
- **TypeScript** for type safety
- **Zod** for api validation

### Backend

- **Express.js** with TypeScript
- **PostgreSQL** database
- **Drizzle ORM** for database operations
- **JWT** for authentication
- **Multer** for file uploads
- **TypeScript** for type safety

## Features

- ✨ Smooth animations and transitions
- 🛡️ Type-safe frontend and backend with TypeScript
- 📊 Database management with Drizzle ORM
- 📊 Admin dashboard for content management
- 💼 Project portfolio management
- 👥 Testimonials management
- 📤 File upload capabilities
- 🔐 Secure authentication system

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- pnpm (recommended) or npm

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd aesthetic-webworks
```

1. Install dependencies for both client and server:

```bash
# Install client dependencies
cd client
pnpm install

# Install server dependencies
cd ../server
pnpm install
```

1. Set up environment variables:

For server (.env):

```env
DATABASE_URL=postgresql://username:password@localhost:5432/your_database
JWT_SECRET=your_jwt_secret
PORT=8000
```

For client (.env.local):

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

1. Initialize the database:

```bash
cd server
pnpm db:push
pnpm db:populate  # Populates the database with initial data
```

### Running the Application

1. Start the server:

```bash
cd server
pnpm dev
```

1. In a new terminal, start the client:

```bash
cd client
pnpm dev
```

## Development Scripts

### Server

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm db:populate` - Populate database with initial data
- `pnpm db:studio` - Open Drizzle Studio for database management
- `pnpm lint` - Run linting
- `pnpm format` - Format code

### Client

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run linting

## Project Structure

```md
.
├── client/                 # Frontend Next.js application
│   ├── app/               # Next.js app directory
│   ├── components/        # Reusable components
│   ├── lib/              # Utility functions and hooks
│   └── public/           # Static assets
│
└── server/                # Backend Express application
    ├── src/
    │   ├── routes/       # API routes
    │   ├── controllers/  # Route controllers
    │   ├── middleware/   # Custom middleware
    │   └── db/          # Database configuration and schemas
    └── dist/            # Compiled TypeScript
```

## Contributing

This is an interview project, but contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
