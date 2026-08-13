import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ochrana osobných údajov | Michal Kurka",
  description:
    "Informácie o spracúvaní osobných údajov podľa GDPR pre webovú stránku finančného poradcu Michala Kurku.",
};

export default function OchranaUdajovLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
