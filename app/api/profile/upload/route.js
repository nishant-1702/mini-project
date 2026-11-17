import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { getProfilePhoto, uploadProfilePhoto } from "@/lib/uploadToStorj";

export async function POST(request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses.find(
      (item) => item.id === clerkUser.primaryEmailAddressId
    )?.emailAddress;

    if (!clerkUser || !email) {
      return Response.json(
        { message: "A Clerk account with a primary email is required" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file.arrayBuffer !== "function") {
      return Response.json(
        { message: "Please select an image" },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      return Response.json(
        { message: "Only JPG, PNG and WEBP images are allowed" },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return Response.json(
        { message: "Image size must be less than 5 MB" },
        { status: 400 }
      );
    }

    const result = await uploadProfilePhoto(file, userId);
    const name = [clerkUser.firstName, clerkUser.lastName]
      .filter(Boolean)
      .join(" ");

    await prisma.user.upsert({
      where: { clerkId: userId },
      update: { profileImageKey: result.key },
      create: {
        clerkId: userId,
        email,
        name: name || null,
        imageUrl: clerkUser.imageUrl,
        profileImageKey: result.key,
      },
    });

    return Response.json({
      success: true,
      message: "Profile photo uploaded successfully",
      imageUrl: result.imageUrl,
    });
  } catch (error) {
    console.error("Profile photo upload error:", error);

    return Response.json(
      { message: "Something went wrong while uploading" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { profileImageKey: true },
    });

    if (!user?.profileImageKey) {
      return Response.json(
        { imageUrl: null, message: "No Storj profile photo found" },
        { status: 404 }
      );
    }

    const imageUrl = await getProfilePhoto(user.profileImageKey);

    if (!imageUrl) {
      await prisma.user.updateMany({
        where: { clerkId: userId, profileImageKey: user.profileImageKey },
        data: { profileImageKey: null },
      });

      return Response.json(
        { imageUrl: null, message: "No Storj profile photo found" },
        { status: 404 }
      );
    }

    return Response.json({ imageUrl });
  } catch (error) {
    console.error("Profile photo fetch error:", error);

    return Response.json(
      { message: "Could not load the Storj profile photo" },
      { status: 500 }
    );
  }
}