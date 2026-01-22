import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = 'force-dynamic'; // Prevent static caching

// Simple in-memory rate limiting (for production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(identifier: string, maxRequests = 5, windowMs = 60000): boolean {
    const now = Date.now();
    const record = rateLimitMap.get(identifier);

    if (!record || now > record.resetTime) {
        rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
        return true;
    }

    if (record.count >= maxRequests) {
        return false;
    }

    record.count++;
    return true;
}

export async function POST(req: NextRequest) {
    // Rate limiting by IP address
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';

    if (!checkRateLimit(ip, 5, 60000)) { // 5 requests per minute
        return NextResponse.json(
            { error: "Too many requests. Please try again later." },
            { status: 429 }
        );
    }
    try {
        const formData = await req.formData();
        const image = formData.get("image");
        const userEmail = formData.get("email");

        // Type guards and validation
        if (!image || !(image instanceof File)) {
            return NextResponse.json(
                { error: "Valid image file is required" },
                { status: 400 }
            );
        }

        if (!userEmail || typeof userEmail !== "string") {
            return NextResponse.json(
                { error: "Valid email is required" },
                { status: 400 }
            );
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userEmail)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 }
            );
        }

        // File size validation (10MB max)
        const maxFileSize = 10 * 1024 * 1024; // 10MB in bytes
        if (image.size > maxFileSize) {
            return NextResponse.json(
                { error: "File size must be less than 10MB" },
                { status: 400 }
            );
        }

        // File type validation
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(image.type)) {
            return NextResponse.json(
                { error: "File must be a JPG, PNG, or WEBP image" },
                { status: 400 }
            );
        }

        // Initialize Resend
        // Check API Key
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            console.error("RESEND_API_KEY is missing");
            return NextResponse.json(
                { error: "Server misconfiguration: API Key missing" },
                { status: 500 }
            );
        }
        const resend = new Resend(apiKey);

        // Get admin emails and from address from environment
        const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) || [];
        const fromEmail = process.env.FROM_EMAIL || 'Hunyuan3D <onboarding@resend.dev>';

        if (adminEmails.length === 0) {
            console.error("ADMIN_EMAILS is missing or empty");
            return NextResponse.json(
                { error: "Server misconfiguration: Admin emails missing" },
                { status: 500 }
            );
        }

        // Convert file to buffer for attachment
        const arrayBuffer = await image.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 1. Send Admin Notification (to Emanuel & Jack)
        // We send one email with the attachment to the admins
        const { error: adminError } = await resend.emails.send({
            from: fromEmail,
            to: adminEmails,
            subject: `Nuova Richiesta 3D da ${userEmail}`,
            html: `
        <h1>Nuova richiesta ricevuta!</h1>
        <p><strong>Utente:</strong> ${userEmail}</p>
        <p>L'immagine da processare è in allegato.</p>
        <hr />
        <p>Genera il modello usando lo script locale e rispondi all'utente.</p>
      `,
            attachments: [
                {
                    filename: image.name,
                    content: buffer,
                },
            ],
        });

        if (adminError) {
            console.error("Resend Admin Error:", adminError);
            return NextResponse.json({ error: "Failed to send admin email" }, { status: 500 });
        }

        // 2. Send User Confirmation (Optional but good UX)
        // We don't necessarily need to attach the image back to them
        const { error: userError } = await resend.emails.send({
            from: fromEmail,
            to: [userEmail],
            subject: 'Abbiamo ricevuto la tua richiesta! 🦆',
            html: `
          <h1>Richiesta presa in carico</h1>
          <p>Ciao,</p>
          <p>Abbiamo ricevuto correttamente la tua immagine.</p>
          <p>Il nostro sistema AI sta analizzando la richiesta. Entro <strong>24 ore</strong> riceverai un'email con il risultato (video preview del modello 3D).</p>
          <br/>
          <p>A presto,<br/>Il team Hunyuan3D</p>
        `
        });

        // We log user error but don't fail the request if user email fails, as long as admin received it
        if (userError) console.warn("Resend User Error:", userError);

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Submission error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
