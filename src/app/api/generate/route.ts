import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const image = formData.get("image");

        if (!image) {
            return NextResponse.json(
                { error: "No image provided" },
                { status: 400 }
            );
        }

        const externalApiUrl = process.env.HUNYUAN_API_URL;

        if (!externalApiUrl) {
            // If no external API is configured, return a mock response for testing
            console.warn("HUNYUAN_API_URL not set. Using mock response.");

            // Simulate delay
            await new Promise((resolve) => setTimeout(resolve, 3000));

            return NextResponse.json({
                modelUrl: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb",
                status: "success"
            });
        }

        // Forward the request to the external GPU server
        // Assuming the external server accepts multipart/form-data with 'image' field
        const backendResponse = await fetch(`${externalApiUrl}/generate`, {
            method: "POST",
            body: formData,
        });

        if (!backendResponse.ok) {
            const errorText = await backendResponse.text();
            return NextResponse.json(
                { error: `Backend error: ${errorText}` },
                { status: backendResponse.status }
            );
        }

        const data = await backendResponse.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error("Generation error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
