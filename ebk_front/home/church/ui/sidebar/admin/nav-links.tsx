"use client";

import {
  PlayIcon,
  MusicalNoteIcon,
  PhotoIcon,
  BookOpenIcon,
  MegaphoneIcon,
  NewspaperIcon,
  Squares2X2Icon,
  CalendarIcon,
  PencilSquareIcon,
  WalletIcon,
  UserGroupIcon,
  MapIcon,
  QuestionMarkCircleIcon,
  ChartBarSquareIcon,
  FilmIcon,
  ArchiveBoxIcon,
  CalendarDaysIcon,
  HomeIcon,
  Bars4Icon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { VscLibrary } from "react-icons/vsc";
import { PiVideoLight } from "react-icons/pi";
import { GiTakeMyMoney } from "react-icons/gi";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { GiGlobe } from "react-icons/gi";
import { FaBalanceScaleLeft } from "react-icons/fa";
import { PiPiggyBankBold } from "react-icons/pi";
import { Accordion, AccordionItem } from "@heroui/accordion";
import Link from "next/link";

import { PrivilegesEnum } from "@/app/lib/config/enum";
const links = [
  // { name: "Eglise", href: "", icon: HomeIcon },
  {
    name: "Comment utiliser",
    href: "/first-step",
    icon: () => <PiVideoLight size={24} />,
  },
  {
    id: "biblio",
    name: "Bibliothèque",
    icon: () => <VscLibrary size={24} />,
    menu: true,
    option: [
      { name: "Vidéos", href: "/videos", icon: PlayIcon },
      { name: "Audios", href: "/audios", icon: MusicalNoteIcon },
      { name: "Images", href: "/pictures", icon: PhotoIcon },
      { name: "Livres", href: "/book", icon: BookOpenIcon },
      { name: "Témoignages", href: "/testimonials", icon: Bars4Icon },
    ],
  },
  {
    id: "culture",
    name: "Culture",
    icon: () => <GiGlobe size={24} />,
    menu: true,
    option: [
      {
        name: "Etude biblique",
        privilege: PrivilegesEnum.FIDELE,
        href: "/bible-study",
        icon: BookOpenIcon,
      },
      {
        name: "Plan de lecture",
        privilege: PrivilegesEnum.ADMIN_EGLISE,
        href: "/plan-lecture",
        icon: MapIcon,
      },
      {
        name: "Quiz biblique",
        privilege: PrivilegesEnum.ADMIN_EGLISE,
        href: "/bible-quiz",
        icon: QuestionMarkCircleIcon,
        menu: false,
      },
      {
        name: "Sondage & Question",
        privilege: PrivilegesEnum.FIDELE,
        href: "/sondage",
        icon: ChartBarSquareIcon,
      },
      {
        name: "Forum",
        privilege: PrivilegesEnum.FIDELE,
        href: "/forum",
        icon: PencilSquareIcon,
      },
      {
        name: "Témoignages",
        privilege: PrivilegesEnum.FIDELE,
        href: "/testimonials",
        icon: FilmIcon,
      },
    ],
  },

  // {
  //   name: 'Offrande & don',
  //   privilege: PrivilegesEnum.FIDELE,
  //   href: '/offering-donation',
  //   icon: BanknotesIcon
  // },
  {
    id: "administrative",
    name: "Administration",
    icon: () => <MdOutlineAdminPanelSettings size={24} />,
    menu: true,
    option: [
      {
        name: "Annonces",
        privilege: PrivilegesEnum.ADMIN_EGLISE,
        href: "/annonce",
        icon: MegaphoneIcon,
      },
      {
        name: "Événement",
        privilege: PrivilegesEnum.ADMIN_EGLISE,
        href: "/management/event",
        icon: CalendarDaysIcon,
      },
      {
        name: "Communiqués",
        privilege: PrivilegesEnum.ADMIN_EGLISE,
        href: "/communique",
        icon: NewspaperIcon,
      },
      {
        name: "Programmes",
        privilege: PrivilegesEnum.ADMIN_EGLISE,
        href: "/programme",
        icon: Squares2X2Icon,
      },
      {
        name: "Rendez-vous",
        privilege: PrivilegesEnum.ADMIN_EGLISE,
        href: "/appointment",
        icon: CalendarIcon,
      },
      {
        name: "Membres",
        privilege: PrivilegesEnum.ADMIN_EGLISE,
        href: "/membres",
        icon: UserGroupIcon,
      },
      {
        name: "Personnel",
        privilege: PrivilegesEnum.FIDELE,
        href: "/management/personnel",
        icon: UserGroupIcon,
      },
      {
        name: "Archivage",
        privilege: PrivilegesEnum.ADMIN_EGLISE,
        href: "/management/archive",
        icon: ArchiveBoxIcon,
      },
    ],
  },

  {
    id: "financial",
    name: "Finance",
    icon: () => <GiTakeMyMoney size={24} />,
    menu: true,
    option: [
      {
        name: "Prévision budgétaire",
        privilege: PrivilegesEnum.ADMIN_EGLISE,
        href: "/management/financial/budget",
        icon: FaBalanceScaleLeft,
      },
      {
        name: "Caisse",
        privilege: PrivilegesEnum.FIDELE,
        href: "/management/financial/income",
        icon: PiPiggyBankBold,
      },
      // { name: "Depense", privilege: PrivilegesEnum.ADMIN_EGLISE, href: "/management/financial/expense", icon: ArchiveBoxIcon },
      {
        name: "Abonnements",
        privilege: PrivilegesEnum.ADMIN_EGLISE,
        href: "/subscriptions",
        icon: WalletIcon,
      },
    ],
  },

  // { name: 'Notification', privilege: PrivilegesEnum.ADMIN_EGLISE , href: '/notification', icon: BellIcon },
];

const footer = [
  {
    name: "Mentions légales, ",
    privilege: PrivilegesEnum.ADMIN_EGLISE,
    href: "/legacy?v=mentions_legale",
    icon: HomeIcon,
  },
  {
    name: "Politique de rembousement, ",
    privilege: PrivilegesEnum.ADMIN_EGLISE,
    href: "/legacy?v=privacy",
    icon: HomeIcon,
  },
  {
    name: " Politique de confidentialité, ",
    privilege: PrivilegesEnum.ADMIN_EGLISE,
    href: "/legacy?v=privacy",
    icon: HomeIcon,
  },
  {
    name: " Termes et Conditions d'utilisation,",
    privilege: PrivilegesEnum.ADMIN_EGLISE,
    href: "/legacy?v=terms_of_use",
    icon: HomeIcon,
  },
  {
    name: " Droits d’auteur,",
    privilege: PrivilegesEnum.FIDELE,
    href: "/legacy?v=privacy",
    icon: HomeIcon,
  },
  {
    name: " Avis et Suggestions",
    privilege: PrivilegesEnum.FIDELE,
    href: "/suggestion",
    icon: HomeIcon,
  },
  // { name: 'Témoignages', privilege: PrivilegesEnum.FIDELE , href: '/testimonials', icon: LuClapperboard },
  // { name: 'Nous contacter', privilege: PrivilegesEnum.FIDELE , href: '/legacy', icon: HomeIcon },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link, i) => {
        const LinkIcon: any = link.icon;

        if (link.menu) {
          return (
            <div key={i}>
              <Accordion className="rounded-md" variant="light">
                <AccordionItem
                  aria-label={link.name}
                  startContent={<LinkIcon className="w-6" />}
                  title={<p className="text-sm">{link.name}</p>}
                >
                  <div style={{ paddingLeft: 20 }}>
                    {link.option?.map((item: any, e: number) => (
                      <Link
                        key={`${link.name}-${e}-${item.name}`}
                        className={clsx(
                          `flex h-48 grow gap-2 rounded-md p-3 mt-3 text-sm font-medium hover:bg-default-100`,
                          {
                            "bg-primary text-white": pathname === item.href,
                          },
                        )}
                        href={item.href}
                      >
                        <item.icon className="w-4" />
                        <p>{item.name}</p>
                      </Link>
                    ))}
                  </div>
                </AccordionItem>
              </Accordion>
            </div>
          );
        } else {
          return (
            <Link
              key={`${link.name}-${i}`}
              className={clsx(
                "flex grow gap-2 rounded-md p-3 mt-3 text-sm font-medium hover:bg-default-100 md:flex-none md:justify-start md:p-2 md:px-3",
                {
                  "bg-primary text-white": pathname === link.href,
                },
              )}
              href={`${link.href}`}
            >
              <LinkIcon className="w-6" />
              <p>{link.name}</p>
            </Link>
          );
        }
      })}
    </>
  );
}

export function NavFooterLinks() {
  const pathname = usePathname();

  return (
    <>
      {footer.map((link) => {
        return (
          <Link
            key={link.name}
            className={clsx(
              "text-justify text-sm font-medium text-neutral-50 hover:bg-sky-100 md:flex-none md:justify-start",
              {
                "bg-primary": pathname === link.href,
              },
            )}
            href={link.href}
          >
            {link.name}
          </Link>
        );
      })}
      <p>
        © 2025 Ecclesiabook <br /> Tous droits réservés
      </p>
    </>
  );
}
