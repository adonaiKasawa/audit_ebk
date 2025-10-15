"use client";
import React, { useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Link } from "@heroui/link";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";
import { Image } from "@heroui/image";

import { ThemeSwitch } from "@/ui/theme-switch";

export default function Helpview() {
  const searchParams = useSearchParams();
  const v = searchParams.get("v");

  const check_params = useCallback(() => {
    if (
      v === null ||
      (v !== "mentions_legale" && v !== "privacy" && v !== "terms_of_use")
    ) {
      document.location = "/legacy?v=privacy";
    }
  }, [v]);

  useEffect(() => {
    check_params();
  }, [check_params]);

  const NoticesComponent = () => {
    return (
      <div>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl mb-4">
          1. Editeur
        </h1>
        <p>Linked-solution</p>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl mb-4 mt-4">
          2. Direction et publication de la redaction
        </h1>
        <p>
          Email :{" "}
          <Link
            color="foreground"
            href="mailto:contact@linked-solution.com"
            underline="always"
          >
            contact@linked-solution.com
          </Link>
        </p>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl mb-4 mt-4">
          3. Hebergement
        </h1>
        <p>
          Le site www.ecclesiabook.org est hébergé par la société : Hostinger
          International Ltd. <br />
          61 Lordou Vironos, Larnaca, CY, 6023 <br />
          Tél. +62 81533832199{" "}
        </p>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl mb-4 mt-4">
          4. proprieté intelectuelle
        </h1>
        <p>
          LinkEd Solution DRC est propriétaire de la plateforme “EcclesiaBooK”.
          Dans ce sens, il en détient des droits de propriété intellectuelle. A
          ce titre, LinkEd Solution DRC est propriétaire du nom de domaine
          www.ecclesiabook.org. L&apos;accès à la plateforme ainsi qu’à tous les
          services qu’elle fournit est exclusivement limité à l&apos;usage de
          l&apos;Utilisateur dans les conditions et limites définies dans les
          Termeset consultables dans la plateforme EcclesiaBook.
        </p>
      </div>
    );
  };

  const TermsComponent = () => {
    return (
      <div>
        <section className="section">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl mb-4 mt-4">
            1. Votre relation avec nous
          </h1>
          <p className="mb-4">
            Bienvenue sur EcclesiaBook (la « Plateforme »), qui est un produit
            de l’entreprise LinkEd Solution DRC.
          </p>
          <p className="mb-4">
            Vous lisez les conditions de service qui régissent la relation et
            servent d&apos;accord entre vous et nous et définissent les termes
            et conditions par lesquels vous pouvez accéder et utiliser la
            Plateforme et notre site Web, services, applications, produits et
            contenus (collectivement, les « Services »). Aux fins des présentes
            Conditions, « vous » et « votre » désignent vous en tant
            qu&apos;utilisateur des Services.
          </p>
          <p className="mb-4">
            Les Conditions constituent un accord juridiquement contraignant
            entre vous et nous. Merci de prendre le temps de les lire
            attentivement.
          </p>
        </section>
        <section className="section">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl mb-4 mt-4">
            2. Acceptation des conditions
          </h1>
          <p className="mb-4">
            En accédant ou en utilisant nos Services, vous confirmez que vous
            pouvez conclure un contrat contraignant avec LinkEd Solution DRC,
            que vous acceptez ces Conditions et que vous acceptez de les
            respecter. Votre accès et votre utilisation de nos Services sont
            également soumis à nos politiques de confidentialité et Règles de la
            communauté, dont les conditions peuvent être consultées directement
            sur la Plateforme, ou lorsque la Plateforme est disponible en
            téléchargement, sur la boutique d&apos;applications applicable de
            votre appareil mobile, et sont incorporées aux présentes par
            référence. En utilisant les Services, vous acceptez les termes de la
            Politique de confidentialité.
          </p>
          <p className="mb-4">
            Si vous accédez ou utilisez les Services au nom d&apos;une église ou
            d&apos;une entité, alors (a) « vous » et « votre » incluent vous et
            cette église ou entité, (b) vous déclarez et garantissez que vous
            êtes un représentant autorisé de l&apos;église ou de l&apos;entité.
            Église ou entité ayant le pouvoir de lier l&apos;entité à ces
            Conditions, et que vous acceptez ces Conditions au nom de
            l&apos;entité, et (c) votre église ou entité est légalement et
            financièrement responsable de votre accès ou de votre utilisation
            des Services ainsi que pour l&apos;accès ou l&apos;utilisation de
            votre compte par d&apos;autres personnes affiliées à votre entité, y
            compris des employés, agents ou sous-traitants.
          </p>
          <p className="mb-4">
            Vous pouvez accepter les Conditions en accédant ou en utilisant nos
            Services. Vous comprenez et acceptez que nous traiterons votre accès
            ou votre utilisation des Services comme une acceptation des
            Conditions à partir de ce moment.
          </p>
          <p className="mb-4">
            Vous devez imprimer ou enregistrer une copie locale des Conditions
            pour vos dossiers.
          </p>
        </section>
        <section className="section">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl mb-4 mt-4">
            3. Changements des Conditions
          </h1>
          <p className="mb-4">
            Nous pouvons modifier ces Conditions de temps en temps, par exemple
            lors de la mise à jour des fonctionnalités de nos Services, lors de
            la fusion de plusieurs applications ou services exploités par nous
            en un seul service ou application, ou en réponse à des changements
            réglementaires. Nous ferons des efforts raisonnables sur le plan
            commercial pour informer généralement tous les utilisateurs de toute
            modification significative apportée à ces Conditions, notamment par
            le biais d&apos;un avis sur notre Plateforme. Cependant, vous devez
            consulter régulièrement les Conditions pour prendre connaissance de
            ces modifications. La date de « Dernière mise à jour » en haut de
            ces Conditions sera également mise à jour pour refléter la date
            d&apos;entrée en vigueur des nouvelles Conditions.
          </p>
          <p className="mb-4">
            Votre accès continu ou votre utilisation des Services après la date
            des nouvelles Conditions constitue votre acceptation de ces
            Conditions révisées. Si vous n&apos;acceptez pas les nouvelles
            Conditions, vous devez arrêter d&apos;accéder ou d&apos;utiliser les
            Services.
          </p>
        </section>
        <section className="section">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl mb-4 mt-4">
            4. Votre compte chez nous{" "}
          </h1>
          <p className="mb-4">
            Pour accéder ou utiliser certains de nos Services, vous devez créer
            un compte chez nous. Lors de la création de ce compte, vous devez
            fournir des informations exactes et à jour. Il est important que
            vous mainteniez et mettiez rapidement à jour vos coordonnées et
            toutes autres informations fournies, afin de les garder actuelles et
            complètes.
          </p>
          <p className="mb-4">
            Il est crucial que vous gardiez votre mot de passe confidentiel et
            que vous ne le partagiez avec personne. Si vous découvrez ou
            suspectez qu&apos;un tiers connaît votre mot de passe ou a accédé à
            votre compte, vous devez nous en informer immédiatement à
            l&apos;adresse suivante :{" "}
            <Link href="mail:info@linked-solution.com">
              info@linked-solution.com
            </Link>
            .
          </p>
          <p className="mb-4">
            Vous acceptez d&apos;être seul responsable de toutes les activités
            effectuées à partir de votre compte.
          </p>
          <p className="mb-4">
            Nous nous réservons le droit de désactiver votre compte utilisateur
            et/ou administrateur à tout moment, notamment si vous ne respectez
            pas une des dispositions des présentes Conditions, ou si des
            activités se déroulent sur votre compte qui, à notre seule
            discrétion, causeraient ou pourraient causer des dommages aux
            Services, violer les droits de tiers, ou enfreindre les lois ou
            réglementations applicables.
          </p>
          <p className="mb-4">
            Si vous souhaitez ne plus utiliser nos Services et demander la
            suppression de votre compte, contactez-nous à{" "}
            <Link href="mail:info@linked-solution.com">
              info@linked-solution.com
            </Link>
            . Nous vous fournirons une assistance supplémentaire et vous
            guiderons tout au long du processus. Une fois votre compte supprimé,
            vous ne pourrez plus le réactiver ni récupérer le contenu ou les
            informations que vous y avez ajoutés.
          </p>
        </section>
        <section className="section">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl mb-4 mt-4">
            5. Accès et utilisation de nos services{" "}
          </h1>
          <p className="mb-4">
            L&apos;accès et l&apos;utilisation de nos Services sont régis par
            ces Conditions ainsi que par toutes les lois et réglementations en
            vigueur. Vous n&apos;êtes pas autorisé à :
          </p>
          <p className="mb-4">
            - Utiliser ou accéder aux Services si vous n&apos;êtes pas
            entièrement apte et légalement capable d&apos;accepter ces
            Conditions ;
          </p>
          <p className="mb-4">
            - Faire des copies non autorisées, modifier, adapter, traduire,
            effectuer de l&apos;ingénierie inverse, désassembler, décompiler ou
            créer des œuvres dérivées des Services ou de tout contenu
            qu&apos;ils contiennent, y compris des fichiers, des tableaux ou de
            la documentation (en tout ou en partie) ou déterminer ou tenter de
            déterminer tout code source, algorithme, méthode ou technique
            intégrés dans les Services ou toute œuvre dérivée de ceux-ci ;
          </p>
          <p className="mb-4">
            - Distribuer, concéder sous licence, transférer ou vendre, en tout
            ou en partie, les Services ou toute œuvre dérivée de ceux-ci ;
          </p>
          <p className="mb-4">
            - Commercialiser, louer ou sous-louer les Services moyennant des
            frais, ou utiliser les Services pour faire de la publicité ou pour
            toute sollicitation commerciale ;
          </p>
          <p className="mb-4">
            - Utiliser les Services, sans notre consentement écrit explicite, à
            des fins commerciales ou non autorisées, y compris pour communiquer
            ou faciliter toute publicité commerciale, sollicitation ou spam ;
          </p>
          <p className="mb-4">
            - Interférer ou tenter d&apos;interférer avec le bon fonctionnement
            des Services, perturber notre site web ou tout réseau connecté aux
            Services, ou contourner toute mesure que nous pourrions utiliser
            pour empêcher ou restreindre l&apos;accès aux Services.
          </p>
          <p>
            - Intégrer les Services ou toute partie de ceux-ci dans tout autre
            programme ou produit. Dans ce cas, nous nous réservons le droit de
            refuser le service, de fermer des comptes ou de restreindre
            l&apos;accès aux services à notre seule discrétion ;
          </p>
          <p className="mb-4">
            - Utiliser des scripts automatisés pour récolter des informations ou
            interagir d&apos;une autre manière avec les Services ;
          </p>
          <p className="mb-4">
            - Usurper l&apos;identité d&apos;une personne ou d&apos;une entité,
            ou déclarer faussement ou déformer votre identité ou votre
            affiliation avec une personne ou une entité, y compris en donnant
            l&apos;impression que tout contenu que vous téléchargez, publiez,
            transmettez, distribuez ou rendez disponible provient des Services ;
          </p>
          <p className="mb-4">
            - Intimider ou harceler autrui, ou promouvoir du matériel à
            caractère sexuel explicite, la violence ou la discrimination basée
            sur la race, le sexe, la nationalité ou le handicap ;
          </p>
          <p className="mb-4">
            - Utiliser les Services d&apos;une manière susceptible de créer un
            conflit d&apos;intérêts ou de nuire aux objectifs des Services,
            comme échanger des avis avec d&apos;autres utilisateurs ou rédiger
            ou solliciter de faux avis ;
          </p>
          <p className="mb-4">
            - Utiliser les Services pour télécharger, transmettre, distribuer,
            stocker ou rendre disponible de quelque manière que ce soit des
            fichiers contenant des virus, des chevaux de Troie, des vers, des
            bombes logiques ou tout autre matériel malveillant ou
            technologiquement nuisible ;
          </p>
          <p className="mb-4">
            - Diffuser toute publicité, sollicitation, matériel promotionnel non
            sollicité ou non autorisé, « courrier indésirable », « spam », «
            chaîne de lettres », « systèmes pyramidaux » ou toute autre forme
            interdite de sollicitation ;
          </p>
          <p className="mb-4">
            - Partager toute information privée d&apos;un tiers, y compris les
            adresses, numéros de téléphone, adresses e-mail, numéros et
            caractéristiques des documents d&apos;identité personnels (comme les
            numéros de sécurité sociale, numéros de passeport) ou numéros de
            carte de crédit.
          </p>
          <p className="mb-4">
            - Tout contenu susceptible d&apos;enfreindre des droits
            d&apos;auteur, des marques déposées ou tout autre droit de propriété
            intellectuelle, ou qui porte atteinte à la vie privée d&apos;une
            personne.
          </p>
          <p className="mb-4">
            - Tout contenu encourageant ou fournissant des instructions pour une
            activité criminelle, dangereuse ou d&apos;automutilation.
          </p>
          <p className="mb-4">
            - Tout contenu intentionnellement destiné à provoquer ou contrarier,
            tel que le trolling et l&apos;intimidation, ou qui a pour but de
            harceler, nuire, effrayer, attrister, embarrasser ou contrarier des
            personnes.
          </p>
          <p className="mb-4">
            - Tout contenu contenant des menaces, y compris des menaces de
            violence physique.
          </p>
          <p className="mb-4">
            - Toute réponse, commentaire, opinion, analyse ou recommandation que
            vous n&apos;êtes pas autorisé ou qualifié à fournir ; ou tout
            contenu que, selon le jugement de Linked Solution DRC, est
            inacceptable ou qui entrave l&apos;utilisation des Services par
            d&apos;autres personnes, ou qui peut exposer EcclesiaBook, les
            Services ou ses utilisateurs à des préjudices ou responsabilités de
            quelque nature que ce soit.
          </p>
          <p className="mb-4">
            - En plus de ce qui précède, votre accès et utilisation des services
            doivent toujours être conformes à nos directives communautaires.
            Nous nous réservons le droit, à tout moment et sans préavis, de
            supprimer ou désactiver l&apos;accès à du contenu à notre
            discrétion, pour toute raison ou sans raison particulière. Les
            raisons pour lesquelles nous pourrions supprimer ou désactiver
            l&apos;accès au contenu incluent le fait que nous trouvons le
            contenu inacceptable, en violation des présentes Conditions ou de
            nos directives communautaires, ou préjudiciable aux Services ou à
            nos utilisateurs. Nos systèmes automatisés analysent votre contenu
            pour vous fournir des fonctionnalités de produit personnalisées,
            telles que des résultats de recherche personnalisés, des publicités
            ciblées et la détection de spam et de logiciels malveillants. Cette
            analyse se produit lorsque le contenu est envoyé, reçu et
            lorsqu&apos;il est stocké.
          </p>
        </section>
        <section className="section">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl mb-4 mt-4">
            6. Droits de propriété intellectuelle
          </h1>
          <p className="mb-4">
            Nous avons un profond respect pour les droits de propriété
            intellectuelle et demandons aux utilisateurs de faire de même. En
            accédant et en utilisant nos Services, vous acceptez de ne pas les
            utiliser d&apos;une manière qui violerait des droits de propriété
            intellectuelle. Nous nous réservons le droit, à tout moment et à
            notre entière discrétion, de restreindre l&apos;accès ou de
            désactiver les comptes de tout utilisateur qui violerait ou serait
            soupçonné de violer des droits d&apos;auteur ou d&apos;autres droits
            de propriété intellectuelle, et ce, avec ou sans préavis.
          </p>
          <p className="mb-4">
            Vous acceptez que nous puissions générer des revenus, accroître
            notre valeur ou obtenir d&apos;autres avantages grâce à votre
            utilisation des Services, notamment par la vente de publicités, de
            parrainages, de promotions, et de données d&apos;utilisation. Sauf
            mention contraire dans ces Conditions ou dans tout autre accord que
            vous passez avec nous, vous n&apos;avez aucun droit de partager ces
            revenus ou cette valeur. De plus, sauf accord exprès de notre part,
            vous (i) n&apos;avez aucun droit de percevoir des revenus ou une
            autre forme de compensation pour tout Contenu utilisateur (tel que
            défini ci-dessous) ou pour l&apos;utilisation de toute œuvre
            musicale, enregistrement sonore ou clip audiovisuel disponible sur
            ou via les Services, y compris le Contenu utilisateur que vous
            créez, et (ii) n&apos;êtes pas autorisé à monétiser ou à obtenir une
            compensation pour tout Contenu utilisateur sur les Services ou sur
            des services tiers (par exemple, vous ne pouvez pas revendiquer le
            Contenu utilisateur téléchargé sur une plateforme de médias sociaux
            comme YouTube à des fins de monétisation).
          </p>
          <p className="mb-4">
            Nous ne garantissons ni ne faisons de déclarations, expresses ou
            implicites, concernant l&apos;exactitude, la complétude ou
            l&apos;actualité de tout contenu sur EcclsiaBook (y compris le
            Contenu utilisateur). Lorsque nos Services contiennent des liens
            vers d&apos;autres sites et ressources fournis par des tiers, ces
            liens sont uniquement fournis à titre informatif. Nous n&apos;avons
            aucun contrôle sur le contenu de ces sites ou ressources et ces
            liens ne constituent pas une approbation de notre part des sites
            liés ou des informations qu&apos;ils contiennent.
          </p>
          <p className="mb-4">
            Vous reconnaissez que nous n&apos;avons aucune obligation de
            présélectionner, surveiller, examiner ou modifier tout contenu
            publié par vous ou d&apos;autres utilisateurs sur les Services (y
            compris le Contenu utilisateur).
          </p>
        </section>
        <section className="section">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl mb-4 mt-4">
            7. Contenu généré par l&apos;utilisateure
          </h1>
          <p className="mb-4">
            Les utilisateurs des Services peuvent avoir l&apos;autorisation de
            télécharger, publier, transmettre (par exemple, via un flux) ou
            rendre disponible de quelque manière que ce soit du contenu via les
            Services. Cela inclut, sans s&apos;y limiter, tout texte,
            photographie, vidéo de l&apos;utilisateur, enregistrement sonore et
            œuvre musicale intégrée, y compris des vidéos contenant des
            enregistrements sonores locaux de votre bibliothèque musicale
            personnelle et du bruit ambiant (« Contenu utilisateur »). Les
            utilisateurs des Services peuvent également extraire des parties ou
            la totalité du Contenu utilisateur créé par un autre utilisateur
            pour produire du nouveau Contenu utilisateur, incluant du Contenu
            utilisateur collaboratif avec d&apos;autres utilisateurs, qui
            combine et intègre le Contenu utilisateur généré par plusieurs
            utilisateurs. Les utilisateurs des Services peuvent aussi superposer
            de la musique, des graphismes, des autocollants, des éléments
            virtuels et d’autres éléments fournis par EcclesiaBook sur ce
            Contenu utilisateur et diffuser ce Contenu utilisateur via les
            Services. Les informations et éléments contenus dans le Contenu
            utilisateur, y compris celui contenant des éléments
            d&apos;EcclesiaBook, n&apos;ont pas été vérifiés ou approuvés par
            nous. Les opinions exprimées par d&apos;autres utilisateurs via les
            Services ne représentent pas nos opinions ou valeurs.
          </p>
        </section>
        <section className="section">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl mb-4 mt-4">
            8. Indemnisation{" "}
          </h1>
          <p className="mb-4">
            Vous acceptez de défendre, indemniser et dégager de toute
            responsabilité LinkEd Solution DRC, ainsi que chacun de leurs
            dirigeants, administrateurs, employés, agents et conseillers
            respectifs, en cas de réclamations, responsabilités, coûts et
            dépenses, y compris, mais sans s&apos;y limiter, les honoraires et
            frais d&apos;avocats, découlant d&apos;une violation de votre part
            ou de la part de tout utilisateur de votre compte des présentes
            Conditions, ou d&apos;une violation de vos obligations, déclarations
            et garanties en vertu des présentes Conditions.
          </p>
        </section>
        <section className="section">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl mb-4 mt-4">
            9. Exclusion de garanties
          </h1>
          <p className="mb-4">
            Aucune disposition de ces conditions n&apos;affectera les droits
            statutaires auxquels vous ne pouvez renoncer ou modifier
            contractuellement et que vous possédez légalement en tant que
            consommateur. Les Services sont fournis « en l&apos;état » et nous
            ne fournissons aucune garantie ni déclaration à leur sujet. En
            particulier, nous ne déclarons ni ne garantissons que :
          </p>
          <p className="mb-4">
            Votre utilisation des services sera conforme à vos attentes ; Votre
            utilisation des services sera sans interruption, effectuée en temps
            opportun, sécurisée et sans erreur ; Toute information obtenue par
            vous via les services sera précise et fiable ; Aucune condition,
            garantie ou autre (y compris toute condition implicite concernant la
            qualité satisfaisante, l&apos;adaptation à l&apos;usage ou la
            conformité à la description) ne s&apos;applique aux services, sauf
            si expressément indiquée dans les conditions. Nous pouvons modifier,
            suspendre, retirer ou restreindre la disponibilité de tout ou partie
            de notre plateforme pour des raisons commerciales et opérationnelles
            à tout moment, sans préavis.
          </p>
        </section>
        <section className="section">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl mb-4 mt-4">
            10. Limitation de responsabilité{" "}
          </h1>
          <p className="mb-4">
            Rien dans ces conditions ne peut exclure ou limiter notre
            responsabilité pour les pertes qui ne peuvent être légalement
            exclues ou limitées par la loi applicable. Cela inclut la
            responsabilité en cas de décès ou de blessures corporelles causées
            par notre négligence ou celle de nos employés, agents ou
            sous-traitants, ainsi qu&apos;en cas de fraude ou de fausse
            déclaration frauduleuse. Sous réserve de ce qui précède, nous ne
            serons pas responsables envers vous pour : (i) toute perte de profit
            (directe ou indirecte) ; (ii) toute perte d&apos;opportunité ; (iii)
            toute perte de données que vous pourriez subir ; ou (iv) toute perte
            indirecte ou consécutive que vous pourriez encourir. Toute autre
            perte sera limitée au montant que vous avez payé à Linked Solution
            DRC au cours des 12 derniers mois.
          </p>
          <p className="mb-4">
            Toute perte ou dommage que vous pourriez subir suite à :
            <br />
            Vous ne devez pas compter entièrement sur l&apos;exhaustivité, la
            précision ou la présence de toute publicité, ni sur les relations ou
            transactions que vous pourriez établir avec tout annonceur ou
            sponsor dont la publicité apparaît sur notre service. Nous ne sommes
            pas responsables des modifications que nous pourrions apporter aux
            services, ni de l&apos;arrêt temporaire ou permanent de la
            fourniture des services (ou de toute fonctionnalité des services).
            Nous ne sommes pas responsables de la suppression, de la corruption
            ou de la non-conservation de tout contenu et autres données de
            communication stockées ou transmises par le biais de votre
            utilisation des services. Il est de votre responsabilité de nous
            fournir des informations exactes concernant votre compte et de
            maintenir la sécurité et la confidentialité de votre mot de passe et
            des détails de votre compte. Notre plateforme est destinée
            uniquement à un usage domestique et privé. Vous acceptez de ne pas
            utiliser notre plateforme à des fins commerciales, et nous déclinons
            toute responsabilité en cas de perte de profits, de commerce, de
            réputation professionnelle, d&apos;interruption d&apos;activité ou
            de perte d&apos;opportunité commerciale. Si un contenu numérique
            défectueux que nous avons fourni endommage un appareil ou un contenu
            numérique vous appartenant en raison de notre manque de diligence et
            de compétences raisonnables, nous réparerons les dommages ou vous
            indemniserons. Cependant, nous ne serons pas responsables des
            dommages évitables en suivant nos conseils pour appliquer une mise à
            jour gratuite ou des dommages résultant de votre non-respect des
            instructions d&apos;installation ou de la configuration des
            exigences minimales recommandées par nous.
          </p>
          <p className="mb-4">
            Ces exclusions de responsabilité envers vous s&apos;appliqueront,
            que nous ayons été informés ou non, ou que nous aurions dû être au
            courant de la possibilité de telles pertes.
          </p>
          <p className="mb-4">
            Vous êtes responsable de tous les frais mobiles pouvant découler de
            votre utilisation de notre service, y compris les frais de messages
            texte et de données. Si vous n&apos;êtes pas certain de ces frais,
            vous devez consulter votre fournisseur de services avant
            d&apos;utiliser notre service. Dans toute la mesure permise par la
            loi, tout litige que vous avez avec un tiers résultant de votre
            utilisation des services, y compris, mais sans s&apos;y limiter,
            tout transporteur, titulaire de droits d&apos;auteur ou autre
            utilisateur, est strictement entre vous et le tiers. Vous libérez
            irrévocablement nous et nos affiliés de toutes réclamations,
            demandes et dommages (réels et indirects) de toute sorte et nature,
            connus et inconnus, découlant de ou liés de quelque manière que ce
            soit à de tels litiges.
          </p>
        </section>
      </div>
    );
  };

  const PrivacyComponent = () => {
    return (
      <div>
        <section className="section">
          <p className="mb-4">
            Bienvenue sur EcclesiaBooK. La présent Politique de confidentialité
            s’applique aux services EcclesiaBooK (la « plateforme »), qui
            comprennent l’application, le site Web et les services connexes
            d’EcclesiaBooK accessibles par l’entremise de toute plateforme ou de
            tout appareil lié à la présente Politique de confidentialité.
            <br />
            La Plateforme est fournie et contrôlée par LinkEd Solution DRC Sarl,
            dont le siège social est situé à 34, avenue : Oshwe dans la commune
            de Kasa-Vubu dans la ville de Kinshasa en République Démocratique du
            Congo.
            <br />
            Cette politique de confidentialité vous informe de nos politiques en
            matière de collecte, d&apos;utilisation et de divulgation des
            informations personnelles lorsque vous utilisez notre réseau social
            évangélique (EcclesiaBooK).
            <br />
            EcclesiaBooK est constituée de deux parties, dont une partie “web”,
            destinée aux responsables des “églises ou des groupes de prières” et
            une “application mobile”, destinée aux fidèles des églises ou des
            groupes de prières. Nous n&apos;utilisons ni ne partageons vos
            informations avec qui que ce soit, sauf dans les cas décrits dans la
            présente politique de confidentialité.
          </p>
          <p className="mb-4">
            Nous utilisons vos informations personnelles pour offrir et
            améliorer les services disponibles sur le réseau social évangélique.
            En utilisant ce réseau, vous acceptez la collecte et
            l&apos;utilisation de vos données conformément à cette politique.
            Sauf mention contraire dans cette politique de confidentialité, les
            termes employés ici ont la même signification que dans nos Termes et
            Conditions, accessibles sur le réseau social évangélique
            EcclesiaBooK.
          </p>
          <p className="mb-4">
            Nous nous engageons à protéger et respecter votre vie privée. Cette
            politique de confidentialité explique comment nous recueillons,
            utilisons, partageons et traitons les informations personnelles des
            utilisateurs et d&apos;autres personnes en lien avec notre
            plateforme. Si vous n&apos;êtes pas en accord avec cette politique,
            vous ne devez pas utiliser la plateforme..
          </p>
        </section>
        <section className="section">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl mb-4 mt-4">
            1. Vos Informations{" "}
          </h1>
          <p className="mb-4">
            En utilisant notre réseau social évangélique, nous pouvons vous
            demander de fournir certaines données personnelles permettant de
            vous contacter ou de vous identifier. Ces données personnelles
            (&quot;Informations personnelles&quot;) peuvent inclure, sans
            s&apos;y limiter :
          </p>
          <p className="mb-4">
            Lorsque vous vous inscrivez sur la Plateforme, vous fournissez des
            informations telles que :
            <ol className="ml-8">
              <li>1. Nom</li>
              <li>2. Prénom</li>
              <li>3. photo de profil</li>
              <li>4. Mot de passe</li>
              <li>5. Date de naissance</li>
              <li>6. Sexe</li>
              <li>
                7. Adresse de votre église (Lors de la création d’un compte
                église){" "}
              </li>
              <li>8. Adresse e-mail</li>
              <li>9. Numéro de téléphone</li>
            </ol>
          </p>
          <p className="mb-4">
            Lors de votre inscription sur le réseau social évangélique
            EcclesiaBooK, Vous fournissez ces informations en toute connaissance
            de cause, notamment en les saisissant vous-même. Il est précisé à
            l&apos;utilisateur du réseau social évangélique EcclesiaBooK
            l’obligation ou non de fournir ces informations.
          </p>
          <p className="mb-4">
            En plus des tous ce qui précèdent, En tant qu&apos;utilisateur de
            l&apos;application EcclesiaBooK, vous pouvez visiter une église.
            Lors de la visite d&apos;une église, un message vous indiquera que ”
            vous êtes sur le point de visiter cette église&quot;. Les données
            fournies sont enregistrées dans une base de données pour le compte
            de l’église à laquelle vous vous êtes affiliés.
          </p>
          <p className="mb-4">
            Pour son bon fonctionnement : <br />
            - EcclesiaBook collecte les images des utilisateurs pour permettre
            aux utilisateurs d’avoir des photos de profil et de leur permettre
            de se reconnaître les uns des autres dans les fils de discussions
            lorsque l’utilisateur publie l’image. <br />
            - EcclesiaBook collecte les vidéos des membres pour alimenter le
            module “Témoignage” et facilite les interactions lorsque
            l’utilisateur publie la vidéo. <br />
            - EcclesiaBook centraliser le contenu vidéo de ses membres pour
            favoriser l’engagement au sein des fils actualités <br />
          </p>
        </section>
        <section className="section">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl mb-4 mt-4">
            2. Contenu Utilisateur{" "}
          </h1>
          <p className="mb-4">
            Nous traitons les contenus que vous générez sur la Plateforme, y
            compris les photos, les contenus audio et vidéo que vous créez, les
            commentaires, les hashtags ainsi que les métadonnées associées,
            telles que le moment et l&apos;auteur du contenu (&quot;Contenu
            utilisateur&quot;). Nous collectons le contenu utilisateur dès son
            exportation, une fois que vous choisissiez de le publier. Si vous
            appliquez un effet à votre contenu utilisateur, nous pouvons
            collecter une version de ce contenu sans l’effet appliqué.
          </p>
        </section>
        <section className="section">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl mb-4 mt-4">
            3. Messages{" "}
          </h1>
          <p className="mb-4">
            Nous collectons les informations que vous fournissez lorsque vous
            rédigez, envoyez ou recevez des messages via les fonctionnalités de
            messagerie de la Plateforme. Cela inclut les messages échangés via
            notre chat lorsque vous communiquez avec des églises et des
            chanteurs pour l&apos;achat de billets d&apos;événements, ainsi que
            l&apos;utilisation d&apos;assistants virtuels pour l&apos;achat de
            billets sur la Plateforme. Ces informations incluent le contenu des
            messages, ainsi que des détails tels que l&apos;heure d&apos;envoi,
            de réception ou de lecture, et les participants aux conversations.
            Notez que les messages envoyés à d&apos;autres utilisateurs seront
            accessibles à ceux-ci, et nous ne sommes pas responsables de leur
            utilisation ou partage. Nous pouvons accéder au contenu de votre
            presse-papiers, y compris textes, images et vidéos, avec votre
            autorisation. Par exemple, si vous choisissez de partager du contenu
            avec une tierce plateforme ou de coller du contenu depuis le
            presse-papiers sur la Plateforme, nous accéderons à ces informations
            pour répondre à votre demande.
          </p>
        </section>
        {/* <section className="section">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl mb-4 mt-4">4. Informations d&apos;achat </h1>
          <p className="mb-4">
            Lorsque vous effectuez un achat ou un paiement via la Plateforme, nous collectons des informations relatives à l&apos;achat ou à la transaction, telles que les détails de la carte de paiement, la facturation, la livraison et les coordonnées, ainsi que les articles achetés. Nous pouvons recevoir des informations de la part des églises, des pasteurs et des prestataires de services de paiement et de traitement des transactions, telles que des confirmations de paiement et des informations sur la livraison des produits achetés via nos fonctionnalités d&apos;achat.
          </p>
        </section> */}
        <section className="section">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl mb-4 mt-4">
            5. Vos contacts téléphoniques et de réseaux sociaux{" "}
          </h1>
          <p className="mb-4">
            Si vous choisissez de synchroniser vos contacts téléphoniques, nous
            accéderons et recueillerons des renseignements tels que les noms,
            les numéros de téléphone et les adresses courriel, et nous
            comparerons ces renseignements aux utilisateurs actuels de la
            Plateforme. Si vous choisissez de partager vos contacts sur vos
            réseaux sociaux, nous recueillerons les renseignements de votre
            profil public ainsi que les noms et les profils de vos contacts sur
            vos réseaux sociaux.
          </p>
        </section>
        <section className="section">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl mb-4 mt-4">
            6. Renseignements techniques collectés à votre sujet{" "}
          </h1>
          <p className="mb-4">
            Lorsque vous visitez notre réseau social évangélique, nous
            collectons des données techniques que votre navigateur transmet. Ces
            informations de journal peuvent inclure votre adresse IP, le type et
            la version de votre navigateur, les pages visitées sur notre
            service, ainsi que l&apos;heure et la date de votre visite. Nous
            recueillons également le temps passé sur ces pages, votre agent
            utilisateur, votre opérateur mobile, le modèle et le système de
            votre appareil, le type de réseau, les identifiants de
            l&apos;appareil, la résolution de votre écran, votre système
            d&apos;exploitation, les paramètres audios et les appareils audio
            connectés. Si vous vous connectez depuis plusieurs appareils, nous
            pourrons utiliser les informations de votre profil pour suivre votre
            activité sur ces différents dispositifs. Nous pouvons également lier
            votre profil à des informations collectées sur des appareils autres
            que ceux que vous utilisez pour accéder à notre plateforme.
          </p>
        </section>
        {/* <section className="section">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl mb-4 mt-4">7. Fournisseurs de services</h1>
          <p className="mb-4">
            Nous faisons appel à des entreprises et des individus tiers pour faciliter notre service, exécuter le service en notre nom, fournir des services associés ou nous aider à analyser l&apos;utilisation de notre service. Ces tiers ont accès à vos informations personnelles uniquement pour réaliser ces tâches pour notre compte et sont tenus de ne pas les divulguer ou les utiliser à d&apos;autres fins.
          </p>
          <p className="mb-4">
            Nous pouvons recevoir des informations décrites dans cette Politique de confidentialité provenant d&apos;autres sources telles que :
          </p>
          <p className="mb-4">
            Si vous choisissez de vous inscrire ou d&apos;utiliser la Plateforme en utilisant les informations de votre compte de réseau social tiers (par exemple, Facebook, Twitter, Instagram, TikTok, Google) ou un service de connexion, vous nous fournirez ou nous permettrez de recevoir votre nom d&apos;utilisateur, les informations disponibles sur votre profil public et d&apos;autres informations liées à ce compte. Nous partagerons également certains renseignements avec votre réseau social, tels que votre identifiant d&apos;application, votre jeton d&apos;accès et l&apos;URL de référence. Si vous liez votre compte EcclesiaBooK à un autre service, nous pourrions recevoir des informations sur votre utilisation de ce service.
          </p>
        </section> */}
        <section className="section">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl mb-4 mt-4">
            8. Sécurité
          </h1>
          <p className="mb-4">
            Nous accordons une grande importance à la protection de vos
            informations personnelles. Toutefois, il est important de noter
            qu&apos;aucune méthode de transmission via Internet ou de stockage
            électronique n&apos;est entièrement sécurisée. Malgré nos efforts
            pour utiliser des moyens commercialement raisonnables afin de
            protéger vos informations personnelles, nous ne pouvons pas garantir
            leur sécurité absolue.
          </p>
          <p className="mb-4">
            Concernant la sécurité de vos informations de paiement, nous
            collaborons avec MaxiCash (https://maxicash.co/fr), une passerelle
            de paiement qui propose des services de transfert d&apos;argent et
            des cartes prépayées Visa. Lors de chaque transaction de paiement,
            LinkEd Solution DRC ne collecte aucune information de paiement de
            l&apos;utilisateur, telles que le numéro de carte, la date de
            validité ou toute autre donnée liée aux paiements.
          </p>
        </section>
        <section className="section">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl mb-4 mt-4">
            9. Liens vers d&apos;autres sites{" "}
          </h1>
          <p className="mb-4">
            Notre réseau social évangélique peut contenir des liens vers des
            sites externes que nous ne gérons pas. En cliquant sur un lien
            tiers, vous serez redirigé vers le site de ce tiers. Nous vous
            recommandons vivement de consulter la politique de confidentialité
            de chaque site que vous visitez. Nous n&apos;avons aucun contrôle
            sur le contenu, les politiques de confidentialité ou les pratiques
            des sites ou services tiers, et n&apos;assumons aucune
            responsabilité à leur égard.
          </p>
          <p className="mb-4" />
        </section>
        <section className="section">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl mb-4 mt-4">
            10. Utilisation de vos informations
          </h1>
          <p className="mb-4">
            Comme mentionné précédemment, nous utilisons vos informations pour
            améliorer, soutenir et administrer notre Plateforme afin de vous
            permettre de bénéficier de ses fonctionnalités, tout en respectant
            nos conditions d&apos;utilisation. Nous pouvons également utiliser
            vos informations pour personnaliser le contenu que vous voyez sur la
            Plateforme, promouvoir nos services, et adapter votre expérience
            publicitaire. En général, nous utilisons les informations collectées
            de la manière suivante :
          </p>
          <ul>
            <li>
              - EcclesiaBook collecte les images des utilisateurs Pour permettre
              aux utilisateurs d’avoir des photos de profil et de leur permettre
              de se Reconnaître les uns des autres dans les fils de discussions.{" "}
              <br />
              - EcclesiaBook Collecte les vidéos des membres pour alimenter le
              module “Témoignage” et facilités les interactions entre les
              utilisateurs. <br />
              - EcclesiaBook centralise le contenu vidéo de ses membres pour
              favoriser l’engagement au sein de discussion des fils de
              discussion et des groupes. <br />
            </li>
            <li>
              - Répondre à vos demandes concernant les produits, services et
              fonctionnalités de la Plateforme, ainsi que pour fournir un
              support technique et recueillir vos retours.
            </li>
            {/* <li>
              - Faciliter les achats et la livraison de produits, en partageant vos informations avec les commerçants, les services de paiement et d&apos;exécution des transactions, et d&apos;autres prestataires de services nécessaires au traitement de vos commandes.
            </li> */}
            <li>
              - Améliorer et développer notre Plateforme, ainsi que mener des
              activités de recherche et de développement de produits.
            </li>
            <li>
              - Évaluer l&apos;efficacité de la publicité et du contenu que nous
              vous présentons, y compris la publicité ciblée, et vous proposer
              des annonces pertinentes sur la Plateforme.
            </li>
            <li>
              - Soutenir les interactions sociales sur la Plateforme, vous
              permettant de communiquer avec d&apos;autres utilisateurs,
              partager des contenus, et utiliser notre service de messagerie.
            </li>
            <li>
              - Utiliser le contenu généré par les utilisateurs dans nos
              campagnes publicitaires pour promouvoir la Plateforme, inviter à
              des événements, et soutenir des sujets et campagnes populaires.
            </li>
            <li>
              - Analyser votre utilisation de la Plateforme, y compris sur
              différents appareils.
            </li>
            <li>
              - Contribuer à la détection et à la prévention des abus, activités
              nuisibles, fraudes, pourriels et activités illégales sur la
              Plateforme.
            </li>
            <li>
              - Nous veillons à optimiser la présentation du contenu de manière
              efficace pour vous et votre appareil.
            </li>
            {/* <li>
              - Nous sécurisons la Plateforme en scannant, analysant et examinant le contenu des utilisateurs, les messages et les métadonnées associées pour détecter les violations de nos conditions d’utilisation, lignes directrices communautaires ou autres politiques.
            </li> */}
            <li>- Nous vérifions votre identité ou votre âge.</li>
            <li>
              - Nous vous tenons informés des changements apportés à nos
              services.
            </li>
            <li>
              - Nous appliquons nos conditions d’utilisation, Directives
              communautaires et autres politiques.
            </li>
            {/* <li>
              - Avec votre consentement, nous utilisons vos informations pour vous fournir des services basés sur la localisation, comme des publicités et du contenu personnalisé.
            </li> */}
            {/* <li>
              - Nous facilitons les ventes, promotions, achats de biens et services, ainsi que le support aux utilisateurs.
            </li> */}
          </ul>
        </section>
        <section className="section">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl mb-4 mt-4">
            11. En ce qui concerne le partage d&apos;informations :
          </h1>
          <p className="mb-4">
            Nous partageons vos renseignements avec les tiers suivants :
          </p>
          <p className="mb-4">
            <b className="ml-4">a{`)`} Partenaires commerciaux </b>
            <br /> <br />
            Si vous choisissez de vous inscrire via votre compte de réseau
            social, vous nous fournissez ou autorisez votre réseau social à nous
            fournir des informations telles que votre numéro de téléphone,
            adresse email, nom d&apos;utilisateur et profil public. Nous
            partageons également certains renseignements avec le réseau social,
            comme votre identifiant d&apos;application, jeton d&apos;accès et
            URL de référence. Si vous autorisez un tiers à accéder à votre
            compte, nous partageons certaines informations avec ce tiers. Selon
            vos autorisations, le tiers peut accéder aux informations de votre
            compte et à d&apos;autres données que vous choisissez de fournir.
            <br />
            Lorsque vous partagez du contenu sur les réseaux sociaux, la vidéo,
            le nom d&apos;utilisateur et le texte associé seront publiés sur la
            plateforme respective. Pour les partages via des applications de
            messagerie instantanée comme WhatsApp, YouTube, Facebook, Instagram
            et TikTok, un lien vers le contenu sera partagé.
          </p>
          <p className="mb-4">
            <b className="ml-4">b{`)`} Fournisseurs de services </b>
            <br /> <br />
            Nous fournissons des informations et du contenu à des tiers qui
            soutiennent notre entreprise, tels que les prestataires de services
            cloud et les fournisseurs de modération de contenu. Cela contribue à
            maintenir la Plateforme sécurisée et agréable, ainsi qu&apos;à
            promouvoir nos services.
            <br />
            Fournisseurs de services de traitement des paiements et
            d&apos;exécution des transactions : Lorsque vous effectuez des
            transactions telles que l&apos;achat de billets, nous partageons des
            données avec les fournisseurs de paiement pour faciliter ces
            transactions. Pour les transactions effectuées avec des Pièces, nous
            partageons un identifiant de transaction afin de vous identifier et
            de créditer votre compte en conséquence.
            <br />
            Fournisseurs d&apos;analyse : Nous collaborons avec des tiers pour
            analyser et améliorer la Plateforme, ainsi que pour diffuser des
            publicités ciblées.
          </p>
          <p className="mb-4">
            <b className="ml-4">
              c{`)`} Vente, fusion ou autres transactions commerciales{" "}
            </b>
            <br /> <br />
            Nous pouvons divulguer vos informations à des tiers dans les
            situations suivantes :
            <br />
            En cas de vente ou d&apos;achat d&apos;entreprise ou d&apos;actifs,
            tel qu&apos;à la suite d&apos;une liquidation ou d&apos;une
            faillite, où vos données seront partagées avec les acheteurs
            potentiels.
            <br />
            En cas de fusion, acquisition ou partenariat avec d&apos;autres
            sociétés, ou si une partie ou la totalité de nos actifs sont vendus,
            où les informations des utilisateurs peuvent être transférées en
            tant qu&apos;actifs.
            <br />
            Commerçants, prestataires de services de paiement et
            d&apos;exécution des transactions, ainsi que d&apos;autres
            fournisseurs de services : Lorsque vous utilisez nos fonctionnalités
            d&apos;achat, nous partageons les détails de votre transaction avec
            le commerçant, les prestataires de paiement et d&apos;exécution des
            transactions, et d&apos;autres fournisseurs de services. Cela inclut
            les détails de la commande, les coordonnées et les informations de
            livraison nécessaires pour traiter votre commande. Ces entités
            utiliseront ces informations conformément à leurs propres politiques
            de confidentialité.
          </p>
          <p className="mb-4">
            <b className="ml-4">d{`)`} Lieu de stockage de vos informations </b>
            <br /> <br />
            Vos informations peuvent être conservées sur des serveurs situés à
            l’étranger par rapport à votre lieu de résidence.
          </p>
        </section>
        <section className="section">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl mb-4 mt-4">
            12. Vos droits et options:
          </h1>
          <p className="mb-4">
            Vous disposez de droits et d&apos;options concernant vos
            informations. Selon les lois en vigueur, vous pourriez avoir le
            droit d&apos;accéder à vos données, de les supprimer, de les mettre
            à jour ou de les corriger, d&apos;être informé sur leur traitement,
            de déposer des plaintes auprès des autorités, ainsi que
            d&apos;autres droits potentiels.
            <br />
            Vous pouvez accéder à la plupart des informations de votre profil et
            les modifier en vous connectant à EcclesiaBooK. Vous pouvez
            supprimer le contenu que vous avez téléchargé. Nous offrons
            également plusieurs outils dans les paramètres pour contrôler, par
            exemple, qui peut voir vos vidéos, vous envoyer des messages ou
            commenter vos vidéos. Si vous le souhaitez, vous pouvez supprimer
            votre compte entier dans les Paramètres.
          </p>
        </section>
        <section className="section">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl mb-4 mt-4">
            13. Sécurité de vos informations
          </h1>
          <p className="mb-4">
            Nous prenons des mesures pour assurer un traitement sécurisé de vos
            informations conformément à cette Politique. Cependant, la
            transmission d&apos;informations via Internet n&apos;est pas
            totalement sécurisée. Bien que nous utilisions des méthodes
            raisonnables telles que le chiffrement pour protéger vos
            informations personnelles, nous ne pouvons garantir la sécurité des
            informations transmises via la Plateforme. Toute transmission se
            fait à vos propres risques.
            <br />
            Nous mettons en place des évaluations techniques et
            organisationnelles adaptées pour garantir un niveau de sécurité
            approprié, tenant compte du risque potentiel pour les droits et
            libertés, tant pour vous que pour les autres utilisateurs. Nous
            maintenons et révisons régulièrement ces évaluations pour améliorer
            la sécurité globale de nos systèmes.
            <br />
            De temps à autre, nous pouvons inclure des liens vers et depuis les
            sites Web de nos partenaires, annonceurs et affiliés. Veuillez noter
            que ces sites ont leurs propres politiques de confidentialité et que
            nous déclinons toute responsabilité quant à ces politiques. Avant de
            soumettre des informations sur ces sites, veuillez consulter leurs
            politiques de confidentialité.
          </p>
          <p className="mb-4">
            <b className="ml-4">
              a{`)`} Durée de conservation de vos données personnelles :{" "}
            </b>
            <br /> <br />
            Nous conservons vos données aussi longtemps que nécessaire pour
            maintenir la Plateforme en fonctionnement et pour remplir les
            objectifs énoncés dans cette Politique de confidentialité. La
            conservation peut également être requise pour respecter nos
            obligations contractuelles et légales, pour poursuivre nos intérêts
            légitimes commerciaux tels que l&apos;amélioration continue de la
            Plateforme, sa sécurité et sa stabilité, ainsi que pour défendre nos
            intérêts légaux.
          </p>
          <p className="mb-4">
            Les périodes de conservation varient selon le type de données et les
            objectifs de leur utilisation. Par exemple, les informations de
            profil nécessaires pour l&apos;utilisation de la Plateforme sont
            conservées tant que votre compte est actif. En cas de non-respect de
            nos conditions d&apos;utilisation ou autres politiques, nous pouvons
            supprimer votre profil et votre contenu immédiatement, tout en
            conservant d&apos;autres informations pour traiter la violation.
          </p>
        </section>
        <section className="section">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl mb-4 mt-4">
            14. Modifications de cette Politique de confidentialité :{" "}
          </h1>
          <p className="mb-4">
            Nous nous réservons le droit de mettre à jour cette Politique de
            confidentialité de temps à autre. Toute modification sera publiée
            sur cette page. Il est recommandé de consulter régulièrement cette
            Politique de confidentialité pour être informé des changements. Les
            modifications prennent effet dès leur publication sur cette page.
          </p>
        </section>
        <section className="section">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl mb-4 mt-4">
            14. Contactez-nous{" "}
          </h1>
          <p className="mb-4">
            Si vous avez des questions sur cette politique de confidentialité,
            veuillez nous contacter.
          </p>
          <p className="mb-4">
            - Email :{" "}
            <Link
              className="text-blue-500"
              href="mail:info@linked-solution.com"
            >
              info@linked-solution.com
            </Link>{" "}
            <br />- Téléphone :{" "}
            <Link className="text-blue-500" href="tel:+243 851945396">
              +243 851945396
            </Link>{" "}
            <br />- Site web :{" "}
            <Link className="text-blue-500" href="www.linked-solution.com">
              www.linked-solution.com
            </Link>{" "}
            <br />
          </p>
        </section>
      </div>
    );
  };

  return (
    <>
      <div className="font-sans antialiased min-h-full flex flex-col [overflow-anchor:none]">
        <div className="relative z-50 w-full flex-none text-sm font-semibold leading-6 text-justify">
          <Navbar>
            <NavbarBrand>
              <Link href="/">
                <Image alt="Logo" height={32} src="/ecclessia.png" width={32} />
              </Link>
            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-4" justify="end">
              <NavbarItem>
                <Link
                  className="text-gray-500"
                  href="/legacy?v=mentions_legale"
                >
                  Mention legale
                </Link>
              </NavbarItem>
              <NavbarItem>
                <Link className="text-gray-500" href="/legacy?v=privacy">
                  politique de confidentialité
                </Link>
              </NavbarItem>
              <NavbarItem>
                <Link className="text-gray-500" href="/legacy?v=terms_of_use">
                  Terms conditions
                </Link>
              </NavbarItem>
            </NavbarContent>
            <ThemeSwitch />
          </Navbar>

          <div className="px-4 sm:px-6 lg:px-8">
            <div className="relative mx-auto max-w-[37.5rem] pt-20 text-center pb-12">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                {v === "mentions_legale" && "Mentions legales"}
                {v === "privacy" && "Politique de confidentialité"}
                {v === "terms_of_use" &&
                  "Termes et conditions d&apos;utilisation"}
              </h1>
              <p className="mt-4 text-base leading-7">
                {v === "mentions_legale" && "Date effective: 18 juillet 2024"}
                {v === "privacy" && "Date effective: 18 juillet 2024"}
                {v === "terms_of_use" && "Date effective: 18 juillet 2024"}
              </p>
            </div>
          </div>

          <div className="relative px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-[40rem] prose-sm prose prose-slate prose-a:font-semibold prose-a:text-sky-500 hover:prose-a:text-sky-600">
              {v === "mentions_legale" && NoticesComponent()}
              {v === "privacy" && PrivacyComponent()}
              {v === "terms_of_use" && TermsComponent()}
            </div>
          </div>

          <footer>
            <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
              <div className="sm:flex sm:items-center sm:justify-end">
                <p className="text-sm text-gray-500">
                  © 2025 EcclesiaBooK. Tous droits réservés.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
