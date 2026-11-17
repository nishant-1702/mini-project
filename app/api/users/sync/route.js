
import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    // 1. Authenticate user through Clerk
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Get Clerk user details
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json(
        { success: false, message: "Clerk user not found" },
        { status: 404 }
      );
    }

    const email = clerkUser.emailAddresses.find(
      (item) => item.id === clerkUser.primaryEmailAddressId
    )?.emailAddress;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email not found" },
        { status: 400 }
      );
    }

    // 3. Get profile data from frontend
    const body = await request.json();

    const {
      dateOfBirth,
      fullAddress,
      houseNumber,
      street,
      locality,
      city,
      state,
      country,
      postalCode,
      latitude,
      longitude,
    } = body;

    // 4. Validate date
    let parsedDate = null;

    if (dateOfBirth) {
      parsedDate = new Date(dateOfBirth);

      if (Number.isNaN(parsedDate.getTime())) {
        return NextResponse.json(
          { success: false, message: "Invalid date of birth" },
          { status: 400 }
        );
      }

      if (parsedDate > new Date()) {
        return NextResponse.json(
          { success: false, message: "Date of birth cannot be in the future" },
          { status: 400 }
        );
      }
    }

    // 5. Prepare user data
    const name = [clerkUser.firstName, clerkUser.lastName]
      .filter(Boolean)
      .join(" ");

    const profileData = {
      email,
      name: name || null,
      imageUrl: clerkUser.imageUrl||clerkUser.imageUrl,
      dateOfBirth: parsedDate,
      fullAddress: fullAddress || null,
      houseNumber: houseNumber || null,
      street: street || null,
      locality: locality || null,
      city: city || null,
      state: state || null,
      country: country || null,
      postalCode: postalCode || null,
      latitude: latitude ?? null,
      longitude: longitude ?? null,
    };

    // 6. Create or update database user
    const user = await prisma.user.upsert({
      where: {
        clerkId: userId,
      },
      update: profileData,
      create: {
        clerkId: userId,
        ...profileData,
      },
      select: {
        id: true,
        clerkId: true,
        email: true,
        name: true,
        dateOfBirth: true,
        fullAddress: true,
        city: true,
        state: true,
        country: true,
        postalCode: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profile saved successfully",
      user,
    });

  } catch (error) {
    console.error("Profile sync error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to save profile",
      },
      { status: 500 }
    );
  }
}




export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        imageUrl: true,
        dateOfBirth: true,
        fullAddress: true,
        houseNumber: true,
        street: true,
        locality: true,
        city: true,
        state: true,
        country: true,
        postalCode: true,
        latitude: true,
        longitude: true,
      },
    });

    if (!user) {
      return NextResponse.json({
        success: true,
        user: null,
        message: "Profile not found",
      });
    }

    return NextResponse.json({
      success: true,
      user,
    });

  } catch (error) {
    console.error("Profile fetch error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
