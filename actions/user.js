// "use server"

// import { auth } from "@clerk/nextjs/server";
// import { db } from "@/lib/prisma";
// import { generateAIInsights } from "./dashboard";


// export async function updateUser(data) {
//   const {userId}=await auth();//to check wheater the user is looged in or not
//   if(!userId) throw new Error("Unauthorized")
//     //check if user exist inside our database or not

//     const user=await db.user.findUnique({
//       where:{
//         clerkUserId:userId,
//       },

//     });
//     if(!user) throw new Error("User not found");
//     try {

//       const result=await db.$transaction(
//         async(tx)=>{  //find if the industry exists

//           let industryInsight=await tx.industryInsight.findUnique({
//             where:{
//               industry:data.industry,
//             }

//           });
//       // if industry dosesnt exist,create it with default values- will replace it with ai later
//       if(!industryInsight){
//          const insights = await generateAIInsights(data.industry);
        
//              industryInsight = await db.industryInsight.create({
//               data: {
//                 industry: data.industry,
//                 ...insights,
//                 nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
//               },
//             });
        
//       }
//       //update the user
//       const updatedUser=await tx.user.update({
//         where:{
//           id:user.id,
//         },
//         data:{
//           industry:data.industry,
//           experience:data.experience,
//           bio:data.bio,
//           skills:data.skills,

//         }

//       })

//       return {updatedUser ,industryInsight}
//       },{
//           timeout:10000,//default 5000
//         }
//       );
//      //to avoid this much api calls we use prisma transaction feature
//       return {success:true,...result};
//     } catch (error) {
//       console.error("Error updating user and industry:",error.message);
//       throw new Error("failed to update profile"+error.message);
      
//     }
  
// }
// export async function getUserOnboardingStatus() {
//    const {userId}=await auth();//to check wheater the user is looged in or not
//   if(!userId) throw new Error("Unauthorized")
//     //check if user exist inside our database or not

//     const user=await db.user.findUnique({
//       where:{
//         clerkUserId:userId,
//       },

//     });
//     if(!user) throw new Error("User not found");
//     try {
//       const user=await db.user.findUnique({
//         where:{
//           clerkUserId:userId,
//         },
//         select:{
//           industry:true
//         }

//       })
//       return{
//         isOnboarded: !!user?.industry
//       };
      
//     } catch (error) {
//       console.error("Error checking onboarding status:",error.message);
//       throw new Error("Failed to check onboarding status");
//     }
// }

"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { generateAIInsights } from "./dashboard";

// ✅ 1. Update user and industry
export async function updateUser(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

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

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: { industry: true }, // directly select only what's needed
  });

  if (!user) throw new Error("User not found");

  return {
    isOnboarded: !!user.industry,
  };
}
