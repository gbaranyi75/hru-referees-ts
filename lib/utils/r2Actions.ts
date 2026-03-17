import {
    PutObjectCommand,
    GetObjectCommand,
    ListObjectsV2Command,
    DeleteObjectCommand
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { r2Client } from './r2Client'

export interface FileObject {
    Key?: string
    LastModified?: Date
    ETag?: string
    Size?: number
    StorageClass?: string
}

export class BadRequestError extends Error {
    statusCode: number
    constructor(message: string) {
        super(message)
        this.name = "BadRequestError"
        this.statusCode = 400
    }
}

export async function uploadFile(file: Buffer, key: string) {
    const command = new PutObjectCommand({
        Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
        Key: key,
        Body: file
    })

    try {
        const response = await r2Client.send(command)
        return response
    } catch (error) {
        console.error('Error uploading file:', error)
        throw error
    }
}

export async function getSignedUrlForUpload(
    key: string,
    contentType: string
): Promise<string> {
    const command = new PutObjectCommand({
        Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
        Key: key,
        ContentType: contentType
    })

    try {
        const signedUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 })
        return signedUrl
    } catch (error) {
        console.error('Error generating signed URL:', error)
        throw error
    }
}

export async function getSignedUrlForDownload(key: string): Promise<string> {
    if (typeof key !== "string" || key.length === 0) {
        throw new BadRequestError('Invalid "key" parameter for download')
    }
    const filename = key.split("/").pop() || key
    const asciiFilename = filename.replace(/[^\x20-\x7E]+/g, "_")
    const encodedFilename = encodeURIComponent(filename)
    const command = new GetObjectCommand({
        Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
        Key: key,
        ResponseContentDisposition: `attachment; filename="${asciiFilename}"; filename*=UTF-8''${encodedFilename}`,
    })

    try {
        const signedUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 })
        return signedUrl
    } catch (error) {
        console.error('Error generating signed URL:', error)
        throw error
    }
}

export async function listFiles() {
    const command = new ListObjectsV2Command({
        Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    })

    try {
        const response = await r2Client.send(command)
        return response || []
    } catch (error) {
        console.error('Error listing files:', error)
        throw error
    }
}

export async function deleteFile(key: string) {
    const command = new DeleteObjectCommand({
        Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
        Key: key
    })

    try {
        const response = await r2Client.send(command)
        return response
    } catch (error) {
        console.error('Error deleting file:', error)
        throw error
    }
}