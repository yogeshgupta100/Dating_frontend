"use client";

import Link from "next/link";
import ProfileCard from "./ProfileCard";
import { generateProfileSlug } from "../utils/slug";

interface ProfileCardWrapperProps {
  profile: any;
  locationSlug: string;
  allProfiles: any[];
  locationName?: string;
}

export default function ProfileCardWrapper({
  profile,
  locationSlug,
  allProfiles,
  locationName,
}: ProfileCardWrapperProps) {
  const slug =
    profile.slug ||
    generateProfileSlug(
      profile.heading || profile.name,
      locationSlug || "location",
      allProfiles.map((p) => p.slug).filter(Boolean)
    );

  const targetUrl = `/${locationSlug}/${slug}`;

  console.log("ProfileCardWrapper rendered:", {
    profileId: profile.id,
    profileName: profile.name,
    slug,
    targetUrl,
  });

  return (
    <Link href={targetUrl} className="block">
      <ProfileCard
        img={profile.profile_img || ""}
        heading={profile.name || profile.heading}
        desc={profile.description}
        location={locationName}
        services={profile.services}
      />
    </Link>
  );
}
