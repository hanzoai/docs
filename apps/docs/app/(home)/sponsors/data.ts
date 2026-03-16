export interface OrganizationAsUserSponsor {
  asUser: string;
  github: string;
  label: string;
  url: string;
  logo?: React.ReactNode;
}

export const organizationAsUserSponsors: OrganizationAsUserSponsor[] = [];
