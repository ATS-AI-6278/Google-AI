import { NextResponse } from "next/server";

export async function GET() {
  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
  const GOOGLE_API_URL = "https://generativelanguage.googleapis.com/v1beta";

  try {
    const response = await fetch(`${GOOGLE_API_URL}/models?key=${GOOGLE_API_KEY}`);
    const data = await response.json();

    if (data.error) throw data.error;

    const models = (data.models || []).map((m: any) => ({
      id: m.name.split("/").pop(),
      object: "model",
      created: Date.now(),
      owned_by: "google",
    }));

    return NextResponse.json({ object: "list", data: models });
  } catch (error: any) {
    return NextResponse.json(
      { error: { message: error.message || "Internal Server Error", type: "api_error" } },
      { status: 500 }
    );
  }
}
