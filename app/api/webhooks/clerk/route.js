import { db } from '@/lib/db'; // assuming you have lib/db.js or lib/db.ts

import { headers } from 'next/headers';

export async function POST(req) {
  const body = await req.json();
  const eventType = body?.type;

  if (eventType === 'user.created') {
    const {
      id,
      email_addresses,
      first_name,
      last_name,
      image_url
    } = body.data;

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { clerkUserId: id }
    });

    if (!existingUser) {
      await db.user.create({
        data: {
          clerkUserId: id,
          email: email_addresses?.[0]?.email_address || '',
          name: `${first_name || ''} ${last_name || ''}`.trim(),
          imageUrl: image_url
        }
      });
    }
  }

  return new Response(JSON.stringify({ status: 'ok' }), { status: 200 });
}
