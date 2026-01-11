import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = 'force-dynamic'; // Prevent static caching

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const image = formData.get("image") as File;
        const userEmail = formData.get("email") as string;

        if (!image || !userEmail) {
            return NextResponse.json(
                { error: "Image and email are required" },
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

        // Convert file to buffer for attachment
        const arrayBuffer = await image.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 1. Send Admin Notification (to Emanuel & Jack)
        // We send one email with the attachment to the admins
        const { error: adminError } = await resend.emails.send({
            from: 'Hunyuan3D <onboarding@resend.dev>', // Default resend dev email, or user's configured domain
            to: ['emanuelediluzio0@gmail.com', 'jackzep@gmail.com'],
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
            from: 'Hunyuan3D <onboarding@resend.dev>',
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
