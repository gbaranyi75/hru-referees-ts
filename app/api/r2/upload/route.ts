// app/api/r2/upload/route.ts
import { NextResponse, NextRequest } from "next/server";
import { ListBucketsCommand, ListObjectsV2Command, PutObjectCommand, S3 } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2Client } from "@/lib/utils/r2Client";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

const uploadRequestSchema = z.object({
    filename: z.string(),
    contentType: z.string(),
    size: z.number(),
});
function constructCloudflareR2Url(
    key: string,
    bucketName: string,
    customDomain?: string
): string {
    if (customDomain) {
        return `${customDomain}/${encodeURIComponent(key)}`;
    }
    // R2 public URL format (requires public access setup)
    return `https://pub-${bucketName}.r2.dev/${encodeURIComponent(key)}`;
}
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validation = uploadRequestSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: "Invalid request body" },
                { status: 400 }
            );
        }

        const { filename, contentType, size } = validation.data;
        const uniqueKey = filename;

        const command = new PutObjectCommand({
            Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
            Key: uniqueKey,
            ContentType: contentType,
            ContentLength: size,
        });

        const presignedUrl = await getSignedUrl(r2Client, command, {
            expiresIn: 3600, // URL expires in 1 hour
        });

        const key = uniqueKey;
        const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME!;

        const publicUrl = constructCloudflareR2Url(key, bucketName);

        return NextResponse.json({
            presignedUrl,
            key: uniqueKey,
            publicUrl,
        });
    } catch (error) {
        console.error("Error generating presigned URL:", error);
        return NextResponse.json(
            { error: "Failed to generate upload URL" },
            { status: 500 }
        );
    }
}
