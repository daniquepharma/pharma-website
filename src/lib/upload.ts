import fs from 'fs';
import path from 'path';

export async function uploadFileToLocal(file: File, folder: string = 'uploads'): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create safe filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = uniqueSuffix + '-' + file.name.replace(/\s+/g, '-');

    // Determine path
    const publicDir = path.join(process.cwd(), 'public');
    const uploadDir = path.join(publicDir, folder);

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filepath = path.join(uploadDir, filename);
    await fs.promises.writeFile(filepath, buffer);

    return `/api/${folder}/${filename}`;
}

export async function deleteFileFromLocal(fileUrl: string): Promise<void> {
    try {
        if (!fileUrl.startsWith('/')) {
            return;
        }

        // Remove the /api prefix from the URL to map it back to the local file system
        const localPath = fileUrl.replace(/^\/api/, '');
        const filepath = path.join(process.cwd(), 'public', localPath);
        if (fs.existsSync(filepath)) {
            await fs.promises.unlink(filepath);
        }
    } catch (error) {
        console.error("Error deleting file locally:", error);
    }
}
