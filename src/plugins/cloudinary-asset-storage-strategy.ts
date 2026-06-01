// src/plugins/cloudinary-asset-storage-strategy.ts


// import { AssetStorageStrategy } from '@vendure/core';
// import { Request } from 'express';
// import { v2 as cloudinary } from 'cloudinary';
// import { Stream } from 'stream';

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export class CloudinaryAssetStorageStrategy implements AssetStorageStrategy {
  
//   async writeFileFromBuffer(fileName: string, data: Buffer): Promise<string> {
//     return new Promise((resolve, reject) => {
//       const uploadStream = cloudinary.uploader.upload_stream(
//         { public_id: fileName, resource_type: 'auto' },
//         (error, result) => {
//           if (error) reject(error);
//           else resolve(result!.secure_url);
//         }
//       );
//       uploadStream.end(data);
//     });
//   }

//   async writeFileFromStream(fileName: string, data: Stream): Promise<string> {
//     return new Promise((resolve, reject) => {
//       const uploadStream = cloudinary.uploader.upload_stream(
//         { public_id: fileName, resource_type: 'auto' },
//         (error, result) => {
//           if (error) reject(error);
//           else resolve(result!.secure_url);
//         }
//       );
//       data.pipe(uploadStream);
//     });
//   }

//   async fileExists(fileName: string): Promise<boolean> {
//     try {
//       await cloudinary.api.resource(fileName);
//       return true;
//     } catch {
//       return false;
//     }
//   }

//   async readFileToBuffer(identifier: string): Promise<Buffer> {
//     const response = await fetch(identifier);
//     const arrayBuffer = await response.arrayBuffer();
//     return Buffer.from(arrayBuffer);
//   }

//   async readFileToStream(identifier: string): Promise<Stream> {
//     const response = await fetch(identifier);
//     const { Readable } = await import('stream');
//     return Readable.from(Buffer.from(await response.arrayBuffer()));
//   }

//   async deleteFile(identifier: string): Promise<void> {
//     await cloudinary.uploader.destroy(identifier);
//   }

//   toAbsoluteUrl(request: Request, identifier: string): string {
//     // identifier est déjà une URL Cloudinary complète
//     return identifier;
//   }
// }
import { AssetStorageStrategy } from '@vendure/core';
import { Request } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { Stream } from 'stream';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export class CloudinaryAssetStorageStrategy implements AssetStorageStrategy {
  
  async writeFileFromBuffer(fileName: string, data: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { public_id: fileName, resource_type: 'auto' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result!.secure_url);
        }
      );
      uploadStream.end(data);
    });
  }

  async writeFileFromStream(fileName: string, data: Stream): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { public_id: fileName, resource_type: 'auto' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result!.secure_url);
        }
      );
      data.pipe(uploadStream);
    });
  }

  async fileExists(fileName: string): Promise<boolean> {
    try {
      await cloudinary.api.resource(fileName);
      return true;
    } catch {
      return false;
    }
  }

  async readFileToBuffer(identifier: string): Promise<Buffer> {
    const response = await fetch(identifier);
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  async readFileToStream(identifier: string): Promise<Stream> {
    const response = await fetch(identifier);
    const { Readable } = await import('stream');
    return Readable.from(Buffer.from(await response.arrayBuffer()));
  }

  async deleteFile(identifier: string): Promise<void> {
    await cloudinary.uploader.destroy(identifier);
  }

  // ✅ Fix : retourne directement l'URL si c'est déjà une URL complète
  toAbsoluteUrl(request: Request, identifier: string): string {
    if (identifier.startsWith('http://') || identifier.startsWith('https://')) {
      return identifier; // ✅ URL Cloudinary complète → retourne directement
    }

    // Chemin relatif → construis l'URL Cloudinary
    const fileName = identifier.split('/').pop()?.replace(/\.[^/.]+$/, '');
    return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${fileName}`;
  }
}