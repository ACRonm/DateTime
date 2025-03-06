import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api-config";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`Fetching event with ID: ${params.id}`);
    
    const API_URL = `${API_BASE_URL}/api/events/share/${params.id}`;
    console.log(`API URL: ${API_URL}`);
    
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} - ${await response.text()}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error forwarding to API:", error);
    return NextResponse.json(
      { error: "Failed to retrieve event" },
      { status: 500 }
    );
  }
}
