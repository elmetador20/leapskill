// app/api/webhooks/clerk/route.js
import { db } from '@/lib/prisma';
import { headers } from 'next/headers';

export async function POST(req) {
  try {
    const body = await req.json();
    const eventType = body?.type;

    console.log("Clerk webhook received:", eventType);

    if (eventType === 'user.created') {
      const {
        id,
        email_addresses,
        first_name,
        last_name,
        image_url
      } = body.data;

      console.log("Creating user:", { id, email: email_addresses?.[0]?.email_address });

      // Check if user already exists
      const existingUser = await db.user.findUnique({
        where: { clerkUserId: id }
      });

      if (!existingUser) {
        const newUser = await db.user.create({
          data: {
            clerkUserId: id,
            email: email_addresses?.[0]?.email_address || '',
            name: `${first_name || ''} ${last_name || ''}`.trim() || null,
            imageUrl: image_url || null
          }
        });
        
        console.log("User created successfully:", newUser.id);
      } else {
        console.log("User already exists:", existingUser.id);
      }
    }

    return new Response(JSON.stringify({ status: 'ok' }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}