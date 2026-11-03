export interface NavSubLink {
  href: string;
  label: string;
  hasDropdown?: boolean;
  subLinks?: NavSubLink[];
}

export interface NavLink {
  href: string;
  label: string;
  hasDropdown?: boolean;
  subLinks?: NavSubLink[];
}

/** Single source of truth for main navigation (Navbar + Footer). */
export const navLinks: NavLink[] = [
  { href: '/domov', label: 'Domov' },
  { href: '/o-mne', label: 'O mne' },
  {
    href: '/sluzby',
    label: 'Služby',
    hasDropdown: true,
    subLinks: [
      { href: '/sluzby/investovanie', label: 'Investovanie' },
      { href: '/sluzby/hypoteky', label: 'Hypotéky' },
      {
        href: '/sluzby/poistenia',
        label: 'Poistenia',
        hasDropdown: true,
        subLinks: [
          { href: '/sluzby/poistenia/zivotne', label: 'Životné poistenie' },
          { href: '/sluzby/poistenia/nezivotne', label: 'Neživotné poistenie' },
        ],
      },
      { href: '/sluzby/dochodok', label: 'Renta a dôchodok' },
    ],
  },
  { href: '/kalkulacky', label: 'Kalkulačky' },
  { href: '/spoluprace', label: 'Spolupráca' },
  { href: '/blog', label: 'Blog' },
  { href: '/kontakt', label: 'Kontakt' },
];
