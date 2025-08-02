// actions/user.js
"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { generateAIInsights } from "./dashboard";

async function ensureUserExists(userId) {
  let user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    // Try to create the user if it doesn't exist
    try {
      user = await db.user.create({
        data: {
          clerkUserId: userId,
          email: '', // This will be updated by webhook
          name: null,
          imageUrl: null
        }
      });
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("User not found and could not be created. Please sign out and sign in again.");
    }
  }

  return user;
}

// ✅ 1. Update user and industry
export async function updateUser(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await ensureUserExists(userId);

  try {
    const result = await db.$transaction(async (tx) => {
      let industryInsight = await tx.industryInsight.findUnique({
        where: { industry: data.industry },
      });

      if (!industryInsight) {
        const insights = await generateAIInsights(data.industry);
        industryInsight = await tx.industryInsight.create({
          data: {
            industry: data.industry,
            ...insights,
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        });
      }

      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          industry: data.industry,
          experience: data.experience,
          bio: data.bio,
          skills: data.skills,
        },
      });

      return { updatedUser, industryInsight };
    }, {
      timeout: 10000,
    });

    return { success: true, ...result };
  } catch (error) {
    console.error("Error updating user and industry:", error.message);
    throw new Error("Failed to update profile: " + error.message);
  }
}

// ✅ 2. Onboarding check
export async function getUserOnboardingStatus() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await ensureUserExists(userId);

  return {
    isOnboarded: !!user.industry,
  };
}