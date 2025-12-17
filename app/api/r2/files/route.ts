import { NextResponse, NextRequest } from "next/server";
import { listFiles, deleteFile, getSignedUrlForDownload } from "@/lib/utils/r2Actions";

// List all available files
export async function GET() {
  try {
    const files = await listFiles()
    return NextResponse.json(files)
  } catch {
    return NextResponse.json({ error: 'Error listing files' }, { status: 500 })
  }
}

// Remove deleted file
export async function DELETE(request: NextRequest) {
  try {
    const { key } = await request.json();

    if (!key) {
      return NextResponse.json(
        { error: "File key is required" },
        { status: 400 }
      );
    }
    await deleteFile(key);

    return NextResponse.json(
      { message: "File deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}

// Download file
export async function POST(request: NextRequest) {
  const { key } = await request.json()
  try {
    const signedUrl = await getSignedUrlForDownload(key)
    return NextResponse.json({ signedUrl })
  } catch {
    return NextResponse.json(
      { error: 'Error generating download URL' },
      { status: 500 }
    )
  }
}
