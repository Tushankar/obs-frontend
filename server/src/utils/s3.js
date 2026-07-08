import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3 } from '../config/s3.js';
import { env } from '../config/env.js';

// Presigned PUT — client uploads directly to S3 (banners, ticket PDFs, avatars).
export function presignPut({ key, contentType, expiresIn = 300 }) {
  const cmd = new PutObjectCommand({ Bucket: env.S3_BUCKET, Key: key, ContentType: contentType });
  return getSignedUrl(s3, cmd, { expiresIn });
}

// Presigned GET — short-lived read URL for private objects (ticket/invoice PDFs).
export function presignGet({ key, expiresIn = 300 }) {
  const cmd = new GetObjectCommand({ Bucket: env.S3_BUCKET, Key: key });
  return getSignedUrl(s3, cmd, { expiresIn });
}

// Canonical public object URL for a key (used for banners, which are shown on
// public event pages). Serving these publicly is a bucket-policy / CloudFront
// concern handled in the Phase 4 hardening + deploy tasks.
export function objectUrl(key) {
  return `https://${env.S3_BUCKET}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;
}
