import {Inotification} from '../store/notification/notification.slice';
import {SondageQuestionTypeEnum, TypeContentEnum} from './enum';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';

type Pays = {
  nom: string;
  code: string;
  flag: string;
};

export const paysDuMonde: Pays[] = [
  {nom: 'Afghanistan', code: 'AF', flag: '🇦🇫'},
  {nom: 'Afrique du Sud', code: 'ZA', flag: '🇿🇦'},
  {nom: 'Albanie', code: 'AL', flag: '🇦🇱'},
  {nom: 'Algérie', code: 'DZ', flag: '🇩🇿'},
  {nom: 'Allemagne', code: 'DE', flag: '🇩🇪'},
  {nom: 'Andorre', code: 'AD', flag: '🇦🇩'},
  {nom: 'Angola', code: 'AO', flag: '🇦🇴'},
  {nom: 'Antigua-et-Barbuda', code: 'AG', flag: '🇦🇬'},
  {nom: 'Arabie saoudite', code: 'SA', flag: '🇸🇦'},
  {nom: 'Argentine', code: 'AR', flag: '🇦🇷'},
  {nom: 'Arménie', code: 'AM', flag: '🇦🇲'},
  {nom: 'Australie', code: 'AU', flag: '🇦🇺'},
  {nom: 'Autriche', code: 'AT', flag: '🇦🇹'},
  {nom: 'Azerbaïdjan', code: 'AZ', flag: '🇦🇿'},
  {nom: 'Bahamas', code: 'BS', flag: '🇧🇸'},
  {nom: 'Bahreïn', code: 'BH', flag: '🇧🇭'},
  {nom: 'Bangladesh', code: 'BD', flag: '🇧🇩'},
  {nom: 'Barbade', code: 'BB', flag: '🇧🇧'},
  {nom: 'Belgique', code: 'BE', flag: '🇧🇪'},
  {nom: 'Belize', code: 'BZ', flag: '🇧🇿'},
  {nom: 'Bénin', code: 'BJ', flag: '🇧🇯'},
  {nom: 'Bhoutan', code: 'BT', flag: '🇧🇹'},
  {nom: 'Biélorussie', code: 'BY', flag: '🇧🇾'},
  {nom: 'Birmanie', code: 'MM', flag: '🇲🇲'},
  {nom: 'Bolivie', code: 'BO', flag: '🇧🇴'},
  {nom: 'Bosnie-Herzégovine', code: 'BA', flag: '🇧🇦'},
  {nom: 'Botswana', code: 'BW', flag: '🇧🇼'},
  {nom: 'Brésil', code: 'BR', flag: '🇧🇷'},
  {nom: 'Brunei', code: 'BN', flag: '🇧🇳'},
  {nom: 'Bulgarie', code: 'BG', flag: '🇧🇬'},
  {nom: 'Burkina Faso', code: 'BF', flag: '🇧🇫'},
  {nom: 'Burundi', code: 'BI', flag: '🇧🇮'},
  {nom: 'Cambodge', code: 'KH', flag: '🇰🇭'},
  {nom: 'Cameroun', code: 'CM', flag: '🇨🇲'},
  {nom: 'Canada', code: 'CA', flag: '🇨🇦'},
  {nom: 'Cap-Vert', code: 'CV', flag: '🇨🇻'},
  {nom: 'République centrafricaine', code: 'CF', flag: '🇨🇫'},
  {nom: 'Chili', code: 'CL', flag: '🇨🇱'},
  {nom: 'Chine', code: 'CN', flag: '🇨🇳'},
  {nom: 'Chypre', code: 'CY', flag: '🇨🇾'},
  {nom: 'Colombie', code: 'CO', flag: '🇨🇴'},
  {nom: 'Comores', code: 'KM', flag: '🇰🇲'},
  {nom: 'République du Congo', code: 'CG', flag: '🇨🇬'},
  {nom: 'République démocratique du Congo', code: 'CD', flag: '🇨🇩'},
  {nom: 'Îles Cook', code: 'CK', flag: '🇨🇰'},
  {nom: 'Corée du Nord', code: 'KP', flag: '🇰🇵'},
  {nom: 'Corée du Sud', code: 'KR', flag: '🇰🇷'},
  {nom: 'Costa Rica', code: 'CR', flag: '🇨🇷'},
  {nom: "Côte d'Ivoire", code: 'CI', flag: '🇨🇮'},
  {nom: 'Croatie', code: 'HR', flag: '🇭🇷'},
  {nom: 'Cuba', code: 'CU', flag: '🇨🇺'},
  {nom: 'Danemark', code: 'DK', flag: '🇩🇰'},
  {nom: 'Djibouti', code: 'DJ', flag: '🇩🇯'},
  {nom: 'République dominicaine', code: 'DO', flag: '🇩🇴'},
  {nom: 'Dominique', code: 'DM', flag: '🇩🇲'},
  {nom: 'Égypte', code: 'EG', flag: '🇪🇬'},
  {nom: 'Émirats arabes unis', code: 'AE', flag: '🇦🇪'},
  {nom: 'Équateur', code: 'EC', flag: '🇪🇨'},
  {nom: 'Érythrée', code: 'ER', flag: '🇪🇷'},
  {nom: 'Espagne', code: 'ES', flag: '🇪🇸'},
  {nom: 'Estonie', code: 'EE', flag: '🇪🇪'},
  {nom: 'États-Unis', code: 'US', flag: '🇺🇸'},
  {nom: 'Éthiopie', code: 'ET', flag: '🇪🇹'},
  {nom: 'Fidji', code: 'FJ', flag: '🇫🇯'},
  {nom: 'Finlande', code: 'FI', flag: '🇫🇮'},
  {nom: 'France', code: 'FR', flag: '🇫🇷'},
  {nom: 'Gabon', code: 'GA', flag: '🇬🇦'},
  {nom: 'Gambie', code: 'GM', flag: '🇬🇲'},
  {nom: 'Géorgie', code: 'GE', flag: '🇬🇪'},
  {nom: 'Ghana', code: 'GH', flag: '🇬🇭'},
  {nom: 'Grèce', code: 'GR', flag: '🇬🇷'},
  {nom: 'Grenade', code: 'GD', flag: '🇬🇩'},
  {nom: 'Guatemala', code: 'GT', flag: '🇬🇹'},
  {nom: 'Guinée', code: 'GN', flag: '🇬🇳'},
  {nom: 'Guinée-Bissau', code: 'GW', flag: '🇬🇼'},
  {nom: 'Guinée équatoriale', code: 'GQ', flag: '🇬🇶'},
  {nom: 'Guyana', code: 'GY', flag: '🇬🇾'},
  {nom: 'Haïti', code: 'HT', flag: '🇭🇹'},
  {nom: 'Honduras', code: 'HN', flag: '🇭🇳'},
  {nom: 'Hongrie', code: 'HU', flag: '🇭🇺'},
  {nom: 'Inde', code: 'IN', flag: '🇮🇳'},
  {nom: 'Indonésie', code: 'ID', flag: '🇮🇩'},
  {nom: 'Irak', code: 'IQ', flag: '🇮🇶'},
  {nom: 'Iran', code: 'IR', flag: '🇮🇷'},
  {nom: 'Irlande', code: 'IE', flag: '🇮🇪'},
  {nom: 'Islande', code: 'IS', flag: '🇮🇸'},
  {nom: 'Israël', code: 'IL', flag: '🇮🇱'},
  {nom: 'Italie', code: 'IT', flag: '🇮🇹'},
  {nom: 'Jamaïque', code: 'JM', flag: '🇯🇲'},
  {nom: 'Japon', code: 'JP', flag: '🇯🇵'},
  {nom: 'Jordanie', code: 'JO', flag: '🇯🇴'},
  {nom: 'Kazakhstan', code: 'KZ', flag: '🇰🇿'},
  {nom: 'Kenya', code: 'KE', flag: '🇰🇪'},
  {nom: 'Kirghizistan', code: 'KG', flag: '🇰🇬'},
  {nom: 'Kiribati', code: 'KI', flag: '🇰🇮'},
  {nom: 'Koweït', code: 'KW', flag: '🇰🇼'},
  {nom: 'Laos', code: 'LA', flag: '🇱🇦'},
  {nom: 'Lesotho', code: 'LS', flag: '🇱🇸'},
  {nom: 'Lettonie', code: 'LV', flag: '🇱🇻'},
  {nom: 'Liban', code: 'LB', flag: '🇱🇧'},
  {nom: 'Libéria', code: 'LR', flag: '🇱🇷'},
  {nom: 'Libye', code: 'LY', flag: '🇱🇾'},
  {nom: 'Liechtenstein', code: 'LI', flag: '🇱🇮'},
  {nom: 'Lituanie', code: 'LT', flag: '🇱🇹'},
  {nom: 'Luxembourg', code: 'LU', flag: '🇱🇺'},
  {nom: 'Macédoine du Nord', code: 'MK', flag: '🇲🇰'},
  {nom: 'Madagascar', code: 'MG', flag: '🇲🇬'},
  {nom: 'Malaisie', code: 'MY', flag: '🇲🇾'},
  {nom: 'Malawi', code: 'MW', flag: '🇲🇼'},
  {nom: 'Maldives', code: 'MV', flag: '🇲🇻'},
  {nom: 'Mali', code: 'ML', flag: '🇲🇱'},
  {nom: 'Malte', code: 'MT', flag: '🇲🇹'},
  {nom: 'Maroc', code: 'MA', flag: '🇲🇦'},
  {nom: 'Îles Marshall', code: 'MH', flag: '🇲🇭'},
  {nom: 'Maurice', code: 'MU', flag: '🇲🇺'},
  {nom: 'Mauritanie', code: 'MR', flag: '🇲🇷'},
  {nom: 'Mexique', code: 'MX', flag: '🇲🇽'},
  {nom: 'Micronésie', code: 'FM', flag: '🇫🇲'},
  {nom: 'Moldavie', code: 'MD', flag: '🇲🇩'},
  {nom: 'Monaco', code: 'MC', flag: '🇲🇨'},
  {nom: 'Mongolie', code: 'MN', flag: '🇲🇳'},
  {nom: 'Monténégro', code: 'ME', flag: '🇲🇪'},
  {nom: 'Mozambique', code: 'MZ', flag: '🇲🇿'},
  {nom: 'Namibie', code: 'NA', flag: '🇳🇦'},
  {nom: 'Nauru', code: 'NR', flag: '🇳🇷'},
  {nom: 'Népal', code: 'NP', flag: '🇳🇵'},
  {nom: 'Nicaragua', code: 'NI', flag: '🇳🇮'},
  {nom: 'Niger', code: 'NE', flag: '🇳🇪'},
  {nom: 'Nigeria', code: 'NG', flag: '🇳🇬'},
  {nom: 'Niue', code: 'NU', flag: '🇳🇺'},
  {nom: 'Norvège', code: 'NO', flag: '🇳🇴'},
  {nom: 'Nouvelle-Zélande', code: 'NZ', flag: '🇳🇿'},
  {nom: 'Oman', code: 'OM', flag: '🇴🇲'},
  {nom: 'Ouganda', code: 'UG', flag: '🇺🇬'},
  {nom: 'Ouzbékistan', code: 'UZ', flag: '🇺🇿'},
  {nom: 'Pakistan', code: 'PK', flag: '🇵🇰'},
  {nom: 'Palaos', code: 'PW', flag: '🇵🇼'},
  {nom: 'Palestine', code: 'PS', flag: '🇵🇸'},
  {nom: 'Panama', code: 'PA', flag: '🇵🇦'},
  {nom: 'Papouasie-Nouvelle-Guinée', code: 'PG', flag: '🇵🇬'},
  {nom: 'Paraguay', code: 'PY', flag: '🇵🇾'},
  {nom: 'Pays-Bas', code: 'NL', flag: '🇳🇱'},
  {nom: 'Pérou', code: 'PE', flag: '🇵🇪'},
  {nom: 'Philippines', code: 'PH', flag: '🇵🇭'},
  {nom: 'Pologne', code: 'PL', flag: '🇵🇱'},
  {nom: 'Portugal', code: 'PT', flag: '🇵🇹'},
  {nom: 'Qatar', code: 'QA', flag: '🇶🇦'},
  {nom: 'République tchèque', code: 'CZ', flag: '🇨🇿'},
  {nom: 'Roumanie', code: 'RO', flag: '🇷🇴'},
  {nom: 'Royaume-Uni', code: 'GB', flag: '🇬🇧'},
  {nom: 'Russie', code: 'RU', flag: '🇷🇺'},
  {nom: 'Rwanda', code: 'RW', flag: '🇷🇼'},
  {nom: 'Saint-Christophe-et-Niévès', code: 'KN', flag: '🇰🇳'},
  {nom: 'Saint-Marin', code: 'SM', flag: '🇸🇲'},
  {nom: 'Saint-Vincent-et-les-Grenadines', code: 'VC', flag: '🇻🇨'},
  {nom: 'Sainte-Lucie', code: 'LC', flag: '🇱🇨'},
  {nom: 'Salomon', code: 'SB', flag: '🇸🇧'},
  {nom: 'Salvador', code: 'SV', flag: '🇸🇻'},
  {nom: 'Samoa', code: 'WS', flag: '🇼🇸'},
  {nom: 'Sao Tomé-et-Principe', code: 'ST', flag: '🇸🇹'},
  {nom: 'Sénégal', code: 'SN', flag: '🇸🇳'},
  {nom: 'Serbie', code: 'RS', flag: '🇷🇸'},
  {nom: 'Seychelles', code: 'SC', flag: '🇸🇨'},
  {nom: 'Sierra Leone', code: 'SL', flag: '🇸🇱'},
  {nom: 'Singapour', code: 'SG', flag: '🇸🇬'},
  {nom: 'Slovaquie', code: 'SK', flag: '🇸🇰'},
  {nom: 'Slovénie', code: 'SI', flag: '🇸🇮'},
  {nom: 'Somalie', code: 'SO', flag: '🇸🇴'},
  {nom: 'Soudan', code: 'SD', flag: '🇸🇩'},
  {nom: 'Soudan du Sud', code: 'SS', flag: '🇸🇸'},
  {nom: 'Sri Lanka', code: 'LK', flag: '🇱🇰'},
  {nom: 'Suède', code: 'SE', flag: '🇸🇪'},
  {nom: 'Suisse', code: 'CH', flag: '🇨🇭'},
  {nom: 'Suriname', code: 'SR', flag: '🇸🇷'},
  {nom: 'Eswatini', code: 'SZ', flag: '🇸🇿'},
  {nom: 'Syrie', code: 'SY', flag: '🇸🇾'},
  {nom: 'Tadjikistan', code: 'TJ', flag: '🇹🇯'},
  {nom: 'Tanzanie', code: 'TZ', flag: '🇹🇿'},
  {nom: 'Tchad', code: 'TD', flag: '🇹🇩'},
  {nom: 'Thaïlande', code: 'TH', flag: '🇹🇭'},
  {nom: 'Timor oriental', code: 'TL', flag: '🇹🇱'},
  {nom: 'Togo', code: 'TG', flag: '🇹🇬'},
  {nom: 'Tonga', code: 'TO', flag: '🇹🇴'},
  {nom: 'Trinité-et-Tobago', code: 'TT', flag: '🇹🇹'},
  {nom: 'Tunisie', code: 'TN', flag: '🇹🇳'},
  {nom: 'Turkménistan', code: 'TM', flag: '🇹🇲'},
  {nom: 'Turquie', code: 'TR', flag: '🇹🇷'},
  {nom: 'Tuvalu', code: 'TV', flag: '🇹🇻'},
  {nom: 'Ukraine', code: 'UA', flag: '🇺🇦'},
  {nom: 'Uruguay', code: 'UY', flag: '🇺🇾'},
  {nom: 'Vanuatu', code: 'VU', flag: '🇻🇺'},
  {nom: 'Vatican', code: 'VA', flag: '🇻🇦'},
  {nom: 'Venezuela', code: 'VE', flag: '🇻🇪'},
  {nom: 'Viêt Nam', code: 'VN', flag: '🇻🇳'},
  {nom: 'Yémen', code: 'YE', flag: '🇾🇪'},
  {nom: 'Zambie', code: 'ZM', flag: '🇿🇲'},
  {nom: 'Zimbabwe', code: 'ZW', flag: '🇿🇼'},
];

export type ComponentNotificationProps = {
  notification: Inotification;
  notificationModule: boolean;
};

export const typeContentArray: {
  id: TypeContentEnum;
  title: string;
  icon: (size: number, color: string) => React.ReactNode;
}[] = [
  {
    id: TypeContentEnum.videos,
    title: 'Vidéos',
    icon: (size: number, color: string) => (
      <Feather name="video" size={size} color={color} />
    ),
  },
  {
    id: TypeContentEnum.audios,
    title: 'Audios',
    icon: (size: number, color: string) => (
      <Feather name="headphones" size={size} color={color} />
    ),
  },
  {
    id: TypeContentEnum.livres,
    title: 'Livres',
    icon: (size: number, color: string) => (
      <Feather name="book-open" size={size} color={color} />
    ),
  },
  // { id: TypeContentEnum.live, title: "Live", icon: (size: number, color: string) => <Feather name="radio" size={size} color={color} /> },
  // { id: TypeContentEnum.programme, title: "Programme", icon: (size: number, color: string) => <Feather name="calendar" size={size} color={color} /> },
  {
    id: TypeContentEnum.images,
    title: 'Images',
    icon: (size: number, color: string) => (
      <Feather name="image" size={size} color={color} />
    ),
  },
  // { id: TypeContentEnum.annonces, title: "Annonces", icon: (size: number, color: string) => <Feather name="bell" size={size} color={color} /> },
  // { id: TypeContentEnum.communiques, title: "Communiqués", icon: (size: number, color: string) => <Feather name="file-text" size={size} color={color} /> },
  {
    id: TypeContentEnum.eglises,
    title: 'Églises',
    icon: (size: number, color: string) => (
      <FontAwesome5 name="church" size={size} color={color} />
    ),
  },
  {
    id: TypeContentEnum.forum,
    title: 'Forum',
    icon: (size: number, color: string) => (
      <Feather name="message-square" size={size} color={color} />
    ),
  },
  // { id: TypeContentEnum.sujetForum, title: "Sujet du Forum", icon: (size: number, color: string) => <Ionicons name="chatbubble-ellipses-outline" size={size} color={color} /> },
  {
    id: TypeContentEnum.bibleStudy,
    title: 'Étude Biblique',
    icon: (size: number, color: string) => (
      <Feather name="book" size={size} color={color} />
    ),
  },
  // { id: TypeContentEnum.bibleStudyContent, title: "Contenu de l'Étude Biblique", icon: (size: number, color: string) => <Feather name="file-text" size={size} color={color} /> },
  {
    id: TypeContentEnum.testimonials,
    title: 'Témoignages',
    icon: (size: number, color: string) => (
      <Feather name="user-check" size={size} color={color} />
    ),
  },
];

export const sondageQuestionType = [
  {key: SondageQuestionTypeEnum.LADDER, value: 'Échelle'},
  {key: SondageQuestionTypeEnum.TRICOLOR, value: 'Tricolore'},
  {
    key: SondageQuestionTypeEnum.MCO,
    value: 'Choix multiple avec réponse ouverte',
  },
  {
    key: SondageQuestionTypeEnum.MCC,
    value: 'Choix multiple avec réponses fermées',
  },
  {
    key: SondageQuestionTypeEnum.MCOT,
    value: 'Choix multiple avec autre option',
  },
];

export const MerchantID = '47fb1c1fcf734ae99c3c41cb902e8604';
export const MerchantPassword = '12b3ad17b499462292d064ef310ee178';
export const url_back = 'https://ecclesiabook.org/auth/payementResponse';
export const gatWay = 'https://api.maxicashapp.com/PayEntryPost'; // Live

{
  /* https://api.maxicashme.com/PayEntryPost Test */
}
// export const  MerchantID = "81a1c6e9175943d19a72250354871790";
// export const  MerchantPassword = "d8938074afca416398e5daca220e57d1";
// export const url_back = "http://localhost:3000/auth/payementResponse";
// export const gatWay = "https://api-testbed.maxicashapp.com/PayEntryPost" //Test
