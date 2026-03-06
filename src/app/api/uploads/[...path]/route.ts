import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ path: string[] }> }
) {
    const params = await props.params;
    const pathArray = params.path || [];

    // Security check: Prevent directory traversal
    if (pathArray.some(segment => segment.includes('..'))) {
        return new NextResponse("Invalid path", { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'public', 'uploads', ...pathArray);

    try {
        if (!fs.existsSync(filePath)) {
            return new NextResponse("File not found", { status: 404 });
        }

        const stat = fs.statSync(filePath);
        if (!stat.isFile()) {
            return new NextResponse("Not a file", { status: 400 });
        }

        const ext = path.extname(filePath).toLowerCase();
        let contentType = 'application/octet-stream';

        switch (ext) {
            case '.pdf': contentType = 'application/pdf'; break;
            case '.jpg':
            case '.jpeg': contentType = 'image/jpeg'; break;
            case '.png': contentType = 'image/png'; break;
            case '.gif': contentType = 'image/gif'; break;
            case '.webp': contentType = 'image/webp'; break;
            case '.svg': contentType = 'image/svg+xml'; break;
        }

        // Instead of loading the whole file into memory, stream it
        const fileStream = fs.createReadStream(filePath) as any;

        const response = new NextResponse(fileStream, {
            headers: {
                'Content-Type': contentType,
                'Content-Length': stat.size.toString(),
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });

        return response;
    } catch (error) {
        console.error("Error serving file:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
