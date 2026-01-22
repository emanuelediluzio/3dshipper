# Hunyuan3D - Image to 3D Model Service

A Next.js web application that allows users to submit images for 3D model generation using AI. The service sends image submissions via email and provides users with 3D model previews within 24 hours.

## Features

- 📤 Drag-and-drop image upload interface
- ✉️ Automated email notifications to admins and users
- 🔒 Server-side validation and security measures
- 🚦 Rate limiting to prevent abuse
- 📱 Responsive design with modern UI/UX
- ⚡ Built with Next.js 15 and React 19

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Email Service**: Resend
- **Animations**: Framer Motion
- **File Upload**: react-dropzone

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A [Resend](https://resend.com) account and API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd 3dshipper
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Copy the `.env.example` file to `.env.local`:
```bash
cp .env.example .env.local
```

Then edit `.env.local` and add your configuration:
```env
RESEND_API_KEY=re_your_actual_api_key_here
ADMIN_EMAILS=admin1@example.com,admin2@example.com
FROM_EMAIL=Hunyuan3D <onboarding@resend.dev>
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `RESEND_API_KEY` | Your Resend API key for sending emails | Yes |
| `ADMIN_EMAILS` | Comma-separated list of admin emails to receive submissions | Yes |
| `FROM_EMAIL` | The "from" address for outgoing emails | No (defaults to Resend dev address) |

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Production Build

Build the application for production:

```bash
npm run build
npm start
```

## API Endpoints

### POST /api/submit

Submits an image for 3D model generation.

**Request:**
- Content-Type: `multipart/form-data`
- Fields:
  - `image`: Image file (JPG, PNG, or WEBP, max 10MB)
  - `email`: User's email address

**Validation:**
- File type: Only JPG, PNG, WEBP allowed
- File size: Maximum 10MB
- Email: Valid email format required
- Rate limit: 5 requests per minute per IP

**Response:**
```json
{
  "success": true
}
```

## Security Features

- ✅ Server-side type validation with type guards
- ✅ Email format validation
- ✅ File type and size validation
- ✅ Rate limiting (5 requests/minute per IP)
- ✅ Memory leak prevention (URL.revokeObjectURL cleanup)
- ✅ Secure external links (noopener noreferrer)

## Project Structure

```
3dshipper/
├── src/
│   ├── app/
│   │   ├── api/submit/      # API endpoint for submissions
│   │   ├── page.tsx         # Main landing page
│   │   └── layout.tsx       # Root layout
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   └── UploadSection.tsx # File upload component
│   └── lib/
│       └── utils.ts         # Utility functions
├── scripts/
│   └── generate_model.py    # Python script for local 3D generation
└── public/                  # Static assets
```

## Local 3D Model Generation

The project includes a Python script for generating 3D models locally:

```bash
# From the scripts directory
python generate_model.py <image_path> <output_dir>
```

**Requirements:**
- Python 3.10+
- Virtual environment (see `scripts/local_install.sh`)

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Railway
- Render
- AWS Amplify
- Docker containers

Make sure to set the required environment variables in your deployment platform.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[Add your license here]

## Support

For issues or questions, please open an issue on GitHub.
