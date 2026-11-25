import type { OfficialFiche } from '../types';

/**
 * الجذاذات الرسمية لدروس الفرنسية للمستوى السادس (المجموعة ج)،
 * منسوخة من «Guide Parcours français — 6e année» (نص OCR، 208 صفحات).
 * كل جذاذة تجمع حصتي الدرس في الدليل بالترتيب، مع الأهداف التعلمية
 * وأنشطة كل حصة (أنشطة الأستاذ(ة) والتلميذ(ة) مدمجة في كل نشاط).
 * رقم الدرس (lessonNumber) هو ترتيب الجذاذة بين جذاذات اللغة
 * (قواعد وتصريف وإملاء ومعجم) في وحدتها التعليمية حسب الدليل؛
 * لذلك يتكرر الرقم عبر الوحدات.
 * ملاحظات عن المصدر:
 * - نص الدليل المستعمل نص OCR، وفيه أخطاء قراءة واضحة صُححت إلى الكلمة
 *   المقصودة (مثل: «chagune» ← «chacune»، «pour le jeunes» ← «pour les jeunes»).
 * - في جذاذة «Le pluriel des noms en al/ail» يظهر في نشاط «Je manipule»
 *   مقطع «les trois phrases, conjuguées à l’imparfait» وهو تلوث من عمود
 *   مجاور في القراءة (نفس المقطع يرد في جذاذة «Peu/Peux/Peut» حيث يناسبها)؛
 *   حُذف المقطع وأُبقي النشاط على مهمتيه الواضحتين (الجدول + الجمع).
 * - نص الإملاء «La malbouffe» يظهر في القراءة مرتين: بعد جذاذة
 *   «Quel(s)/Quelle(s)/Qu’elle(s)» وبعد جذاذة «Peu/Peux/Peut».
 *   النص كله مبني على homonymes «peu / peux / peut» ولا يحتوي أي
 *   «quel / quelle / qu’elle»؛ لذلك أُثبت في جذاذة «Peu/Peux/Peut»
 *   وحدها، ولم تُثبت أي dictée في جذاذة «Quel(s)/Quelle(s)/Qu’elle(s)»
 *   لأن نص إملائها الخاص لم يُسترجع من القراءة.
 * - جذاذتا الوحدة 2 (la pronominalisation وla phrase interrogative)
 *   فقدت القراءة ترويستيهما (الأسابيع والأهداف والدعائم والمدة)؛
 *   الأسابيع مأخوذة من جدول تخطيط الوحدة 2 في الدليل.
 * - لا جذاذة رسمية في الدليل لدرس «Les verbes être et avoir» (مراجعة
 *   من سنوات سابقة؛ الدليل لا يخصص له جذاذة في السادس).
 */
export const OFFICIAL_FICHES_FRENCH6_C: OfficialFiche[] = [
  {
    lessonId: 'l6-french-phrase-nominale',
    source: 'Guide Parcours français — 6e année',
    lessonNumber: 1,
    sessions: [
      {
        name: 'Séances 1 et 2 (Semaines 1 et 2) — 2 séances de 30 min chacune',
        objective: 'Transformer une phrase nominale en une phrase verbale et inversement.',
        activities: [
          {
            title: 'Présenter le corpus et découvrir le fait de langue',
            description: 'L’enseignant(e) présente le corpus contenant le fait de langue à étudier et pose des questions pour faire découvrir le fait de langue objet d’étude. Les élèves découvrent le corpus proposé et répondent aux questions.',
          },
          {
            title: 'Je manipule et je réfléchis',
            description: 'Réaliser les activités de la rubrique « Je manipule et je réfléchis » : identifier les phrases verbales ; identifier les phrases nominales ; transformer les phrases verbales en phrases nominales.',
          },
          {
            title: 'Déduire la règle du fait de langue',
            description: 'Inviter les élèves à déduire la règle du fait de langue objet d’étude. Les élèves déduisent la règle du fait de langue objet d’étude.',
          },
          {
            title: 'Je m’entraîne',
            description: 'Demander aux élèves de réaliser les exercices proposés dans le livret, rubrique « Je m’entraîne ». Procéder à la correction collective et individuelle ; les élèves participent à la correction et corrigent leur réalisation, si besoin est.',
          },
          {
            title: 'Je m’évalue',
            description: 'Faire réaliser les exercices proposés dans le livret, rubrique « Je m’évalue ». Identifier les erreurs éventuelles et procéder à leur traitement ; les élèves participent au traitement des erreurs et corrigent leur réalisation, si besoin est.',
          },
        ],
      },
    ],
  },
  {
    lessonId: 'l6-french-present-usuels',
    source: 'Guide Parcours français — 6e année',
    lessonNumber: 2,
    sessions: [
      {
        name: 'Séances 1 et 2 (Semaines 1 et 2) — 2 séances de 30 min chacune',
        objective: 'Conjuguer des verbes usuels au présent de l’indicatif.',
        activities: [
          {
            title: 'Étape : Observation / Découverte',
            description: 'Présenter le corpus contenant le fait de langue à étudier et l’exploiter, à l’aide des questions proposées dans la rubrique « J’observe et je découvre », pour faire découvrir le fait de langue proposé à l’étude. Les élèves découvrent le corpus proposé dans le livret et participent à la formulation des réponses aux questions posées.',
          },
          {
            title: 'Étape : Compréhension / Conceptualisation',
            description: 'Demander aux élèves de répondre aux questions proposées dans la rubrique « Je manipule et je réfléchis » : classer dans un tableau les verbes usuels conjugués au présent de l’indicatif ; conjuguer les verbes usuels au présent de l’indicatif. Inviter les élèves à déduire la règle du fait de langue étudié.',
          },
          {
            title: 'Étape : Application',
            description: 'Demander aux élèves de réaliser les exercices proposés dans le livret, rubrique « Je m’entraîne ». Procéder à la correction collective et individuelle ; les élèves participent à la correction collective et corrigent leur réalisation, si besoin est.',
          },
          {
            title: 'Étape : Évaluation et Soutien',
            description: 'Demander aux élèves de réaliser les exercices proposés dans le livret, rubrique « Je m’évalue ». Identifier les erreurs et associer les élèves à leur traitement ; les élèves participent au traitement des erreurs et corrigent leur réalisation, si besoin est.',
          },
        ],
      },
    ],
  },
  {
    lessonId: 'l6-french-pronominalisation',
    source: 'Guide Parcours français — 6e année',
    lessonNumber: 1,
    sessions: [
      {
        name: 'Séances 1 et 2 (Semaines 1 et 2)',
        objective: 'Employer la pronominalisation des compléments de verbe.',
        activities: [
          {
            title: 'Présenter le corpus et découvrir le fait de langue',
            description: 'Présenter des phrases contenant le fait de langue à étudier ; lire et faire lire les phrases. Poser des questions pour faire identifier les faits étudiés. Les élèves lisent les phrases et répondent aux questions.',
          },
          {
            title: 'Je manipule et je réfléchis',
            description: 'Réaliser les activités de la rubrique « Je manipule et je réfléchis » : écrire les compléments et les pronoms qui les remplacent dans le tableau proposé ; identifier le pronom complément qui remplace le COD ou le COI ; remplacer le COD ou le COI par le pronom qui convient ; utiliser le pronom complément qui convient pour remplacer un COD ou un COI.',
          },
          {
            title: 'Déduire la règle du fait de langue',
            description: 'Inviter les élèves à déduire la règle du fait étudié. Les élèves déduisent la règle du fait de langue étudié.',
          },
          {
            title: 'Je m’entraîne',
            description: 'Demander aux élèves de réaliser les exercices prévus dans le livret de l’élève, rubrique « Je m’entraîne ». Inviter les élèves à corriger ; les élèves corrigent les exercices.',
          },
          {
            title: 'Je m’évalue',
            description: 'Demander aux élèves de réaliser les exercices 1 et 2 du livret de l’élève, rubrique « Je m’évalue ». Demander aux élèves de corriger leurs erreurs ; les élèves corrigent leurs erreurs.',
          },
        ],
      },
    ],
  },
  {
    lessonId: 'l6-french-phrase-interrogative',
    source: 'Guide Parcours français — 6e année',
    lessonNumber: 5,
    sessions: [
      {
        name: 'Séances 1 et 2 (Semaines 3 et 4)',
        objective: 'Utiliser la phrase interrogative (interrogations totale et partielle).',
        activities: [
          {
            title: 'Présenter le corpus et découvrir le fait de langue',
            description: 'Présenter des phrases contenant le fait de langue à étudier ; lire et faire lire les phrases. Poser des questions pour faire identifier les faits étudiés. Les élèves lisent les phrases et répondent aux questions.',
          },
          {
            title: 'Je manipule et je réfléchis',
            description: 'Réaliser les activités de la rubrique « Je manipule et je réfléchis » : chercher les phrases contenant une interrogation totale ou partielle ; identifier les interrogations totale ou partielle ; classer les phrases selon deux catégories : interrogation totale et interrogation partielle.',
          },
          {
            title: 'Déduire la règle du fait de langue',
            description: 'Inviter les élèves à déduire la règle du fait étudié. Les élèves déduisent la règle du fait de langue étudié.',
          },
          {
            title: 'Je m’entraîne',
            description: 'Demander aux élèves de réaliser les exercices prévus dans le livret de l’élève, rubrique « Je m’entraîne ». Inviter les élèves à corriger les exercices ; les élèves corrigent les exercices.',
          },
          {
            title: 'Je m’évalue',
            description: 'Demander aux élèves de réaliser les exercices 1 et 2 du livret de l’élève, rubrique « Je m’évalue ». Demander aux élèves de corriger leurs erreurs ; les élèves corrigent leurs erreurs.',
          },
        ],
      },
    ],
  },
  {
    lessonId: 'l6-french-tout',
    source: 'Guide Parcours français — 6e année',
    lessonNumber: 7,
    sessions: [
      {
        name: 'Séances 1 et 2 (Semaines 3 et 4) — 2 séances de 35 min chacune',
        objective: 'Écrire correctement les déterminants tout / toute / tous / toutes.',
        activities: [
          {
            title: 'Étape : Observation / Découverte',
            description: 'Indiquer la page du livret. Présenter le corpus et le lire : 1. Y a-t-il, dans le village, des maisons qui ne sont pas dotées d’électricité ? — Les maisons de tout le village. 2. Quels sont les robots qui permettent de gagner du temps ? — Tous les robots permettent de gagner du temps. 3. Quelles sont les parties de la fusée qui ont été brûlées ? — Toute la fusée a été brûlée. 4. Quelles sont les voitures qui sont dotées maintenant de systèmes automatisés ? — Toutes les voitures. 5. Quels sont les mots qu’on a utilisés chaque fois pour répondre aux questions ? — Le mot tout / toutes / tous / toute. 6. Sont-ils écrits de la même manière ? — Non, ces mots n’ont pas la même écriture.',
          },
          {
            title: 'Étape : Compréhension / Conceptualisation',
            description: 'Demander aux élèves de répondre aux questions présentées dans la rubrique « Je manipule et je réfléchis » : identifier, dans le tableau proposé, le genre et le nombre des déterminants relevés dans le support ; réécrire les quatre phrases du support en remplaçant le nom par un autre nom de genre et de nombre différents. Inviter les élèves à déduire la règle du fait de langue étudié.',
          },
          {
            title: 'Étape : Application',
            description: 'Demander aux élèves de réaliser les exercices prévus dans le livret de l’élève, rubrique « Je m’entraîne ». Inviter les élèves à corriger ; les élèves corrigent les exercices.',
          },
          {
            title: 'Étape : Évaluation et Soutien',
            description: 'Demander aux élèves de réaliser les exercices de la rubrique « Je m’évalue » (exercices 1 et 2). Demander aux élèves de corriger leurs erreurs ; les élèves corrigent leurs erreurs.',
          },
          {
            title: 'Dictée',
            description: 'Texte : « La technologie est présente dans toute notre vie. Toutes les cuisines sont équipées par tout le matériel nécessaire : robots autocuiseurs, batteurs électriques. Tout le monde a au moins un téléphone. Même toutes les voitures actuelles sont dotées de systèmes automatisés. » Lire le texte deux fois à haute voix ; dicter le texte phrase par phrase ; relire le texte à haute voix ; faire corriger la dictée au tableau.',
          },
        ],
      },
    ],
  },
  {
    lessonId: 'l6-french-pluriel-al-ail',
    source: 'Guide Parcours français — 6e année',
    lessonNumber: 3,
    sessions: [
      {
        name: 'Séances 1 et 2 (Semaines 1 et 2) — 2 séances de 35 min chacune',
        objective: 'Écrire au pluriel les noms en « al » et « ail ».',
        activities: [
          {
            title: 'Étape : Observation / Découverte',
            description: 'Présenter les phrases contenant le fait de langue à étudier : 1. La baisse du carburant est annoncée dans les journaux. 2. Les animaux préfèrent la lumière naturelle. 3. Son chef lui demande de fermer les portails. 4. Pour moderniser la gare, on a installé de nouveaux rails. Lire et faire lire les phrases ; poser des questions pour faire identifier les faits étudiés.',
          },
          {
            title: 'Étape : Compréhension / Conceptualisation',
            description: 'Inviter les élèves à répondre aux questions de la rubrique « Je manipule et je réfléchis » : écrire les phrases du support dans le tableau proposé dans le livret ; mettre les deux premières phrases du support au pluriel. Inviter les élèves à déduire la règle du fait de langue étudié : le pluriel des noms en « al » et « ail » (« Je retiens »).',
          },
          {
            title: 'Étape : Application',
            description: 'Demander aux élèves de réaliser les exercices prévus dans le livret de l’élève, rubrique « Je m’entraîne ». Inviter les élèves à corriger les exercices ; les élèves corrigent les exercices.',
          },
          {
            title: 'Étape : Évaluation et Soutien',
            description: 'Demander aux élèves de réaliser les exercices 1 et 2 du livret de l’élève, rubrique « Je m’évalue ». Demander aux élèves de corriger leurs erreurs ; les élèves corrigent leurs erreurs.',
          },
          {
            title: 'Dictée',
            description: 'Texte : « Ce matin, les journaux ont donné les détails de l’événement : les portails des fermes sont restés fermés. Le maire a demandé, par mails, aux habitants du village L’Épouvantail, de ne pas sortir le bétail. Les travaux de modernisation des rails du chemin de fer vont bloquer le canal. » Lire le texte deux fois à haute voix ; dicter le texte phrase par phrase ; relire le texte à haute voix ; faire corriger la dictée au tableau.',
          },
        ],
      },
    ],
  },
  {
    lessonId: 'l6-french-quel-quelle',
    source: 'Guide Parcours français — 6e année',
    lessonNumber: 7,
    sessions: [
      {
        name: 'Séance 1 (Semaines 3 et 4)',
        objective: 'Écrire correctement les homonymes « Quel(s) / Quelle(s) / Qu’elle(s) ».',
        activities: [
          {
            title: 'Étape : Observation / Découverte',
            description: 'Présenter le corpus : 1. Alors quelles énergies peuvent remplacer les énergies fossiles ? 2. Quelle gigantesque éolienne ! 3. La maison qu’elle va acheter est bien ensoleillée. Poser des questions pour faire identifier les faits étudiés : 1. Quels sont les mots qui se prononcent de la même façon dans ces phrases ? 2. Ces mots s’écrivent-ils de la même façon ? 3. Ces mots ont-ils le même sens ? Les élèves lisent les phrases et répondent aux questions.',
          },
          {
            title: 'Étape : Compréhension / Conceptualisation',
            description: 'Demander aux élèves de répondre aux questions présentées dans la rubrique « Je manipule et je réfléchis » : compléter la liste par d’autres homonymes ; les classer dans le tableau à deux entrées : « Quand je veux poser une question ou exprimer une exclamation » / « Quand je peux remplacer elle(s) par un autre pronom personnel ». Inviter les élèves à déduire la règle du fait de langue étudié (« Je retiens »).',
          },
        ],
      },
      {
        name: 'Séance 2 (Semaines 3 et 4)',
        objective: 'Écrire correctement les homonymes « Quel(s) / Quelle(s) / Qu’elle(s) ».',
        activities: [
          {
            title: 'Étape : Application',
            description: 'Demander aux élèves de réaliser les exercices prévus dans le livret de l’élève, rubrique « Je m’entraîne ». Inviter les élèves à corriger les exercices ; les élèves corrigent les exercices.',
          },
          {
            title: 'Étape : Évaluation et Soutien',
            description: 'Demander aux élèves de réaliser les exercices 1 et 2 du livret de l’élève, rubrique « Je m’évalue ». Demander aux élèves de corriger leurs erreurs ; les élèves corrigent leurs erreurs.',
          },
        ],
      },
    ],
  },
  {
    lessonId: 'l6-french-present-pron',
    source: 'Guide Parcours français — 6e année',
    lessonNumber: 2,
    sessions: [
      {
        name: 'Séances 1 et 2 (Semaines 1 et 2) — 2 séances de 30 min chacune',
        objective: 'Conjuguer les verbes pronominaux usuels au présent de l’indicatif.',
        activities: [
          {
            title: 'Étape : Observation / Découverte',
            description: 'Présenter le corpus contenant le fait de langue à étudier ; lire et faire lire les phrases. Poser des questions pour faire identifier les faits étudiés. Les élèves lisent les phrases et répondent aux questions.',
          },
          {
            title: 'Étape : Compréhension / Conceptualisation',
            description: 'Demander aux élèves de répondre aux questions présentées dans la rubrique « Je manipule et je réfléchis » : classer les verbes pronominaux conjugués au présent de l’indicatif dans le tableau proposé, en distinguant les « infinitifs » / « groupes / terminaisons » ; conjuguer les verbes pronominaux proposés au présent de l’indicatif. Inviter les élèves à déduire la règle du fait de langue étudié.',
          },
          {
            title: 'Étape : Application',
            description: 'Demander aux élèves de réaliser l’exercice proposé dans le livret, rubrique « Je m’entraîne ». Inviter les élèves à corriger ; les élèves corrigent les exercices.',
          },
          {
            title: 'Étape : Évaluation et Soutien',
            description: 'Demander aux élèves de réaliser les exercices du livret de l’élève, rubrique « Je m’évalue ». Demander aux élèves de corriger leurs erreurs ; les élèves corrigent leurs erreurs.',
          },
        ],
      },
    ],
  },
  {
    lessonId: 'l6-french-pluriel-ou-eu',
    source: 'Guide Parcours français — 6e année',
    lessonNumber: 3,
    sessions: [
      {
        name: 'Séances 1 et 2 (Semaines 1 et 2) — 2 séances de 35 min chacune',
        objective: 'Écrire le pluriel des noms en « ou » et en « eu ».',
        activities: [
          {
            title: 'Étape : Observation / Découverte',
            description: 'Présenter le corpus contenant le fait de langue à étudier ; lire et faire lire les phrases. Poser des questions pour faire identifier les faits étudiés. Les élèves lisent les phrases et répondent aux questions.',
          },
          {
            title: 'Étape : Compréhension / Conceptualisation',
            description: 'Demander aux élèves de répondre aux questions présentées dans la rubrique « Je manipule et je réfléchis » : classer les mots de la liste proposée dans le tableau pour distinguer les différents pluriels ; chercher d’autres mots qui se terminent par « ous » et « eux ». Inviter les élèves à déduire la règle du fait de langue étudié.',
          },
          {
            title: 'Étape : Application',
            description: 'Demander aux élèves de réaliser l’exercice proposé dans le livret, rubrique « Je m’entraîne ». Inviter les élèves à corriger ; les élèves corrigent les exercices.',
          },
          {
            title: 'Étape : Évaluation et Soutien',
            description: 'Demander aux élèves de réaliser un ou deux exercices proposés dans le livret, rubrique « Je m’évalue ». Procéder à la correction collective et individuelle ; les élèves participent à la correction et corrigent leurs erreurs.',
          },
          {
            title: 'Dictée',
            description: 'Texte : « Aujourd’hui, on construit partout des immeubles de plus en plus fous. Certains sont dressés comme des pieux. D’autres ressemblent à des pneus bleus. Mais au moins, il y a, pour les jeunes, des aires de jeux. » Lire le texte deux fois à haute voix ; dicter le texte phrase par phrase ; relire le texte à haute voix ; procéder à la correction collective et individuelle.',
          },
        ],
      },
    ],
  },
  {
    lessonId: 'l6-french-voix-passive',
    source: 'Guide Parcours français — 6e année',
    lessonNumber: 5,
    sessions: [
      {
        name: 'Séances 1 et 2 (Semaines 3 et 4) — 2 séances de 30 min chacune',
        objective: 'Utiliser la voix active et la voix passive (verbes au présent de l’indicatif).',
        activities: [
          {
            title: 'Présenter le corpus',
            description: 'Présenter et lire les phrases : 1. La société actuelle gaspille les ressources de notre planète. 2. Ce chercheur explique les défis de la vie contemporaine. 3. Les ressources de notre planète sont gaspillées par la société actuelle. 4. Les défis de la vie contemporaine sont expliqués par ce chercheur. Poser des questions pour faire identifier les faits étudiés : 1. Que fait la société actuelle ? — Elle gaspille… 2. Que fait le chercheur ? — Il explique… 3. Qui fait l’action dans ces deux phrases ? — Le sujet : la société actuelle / ce chercheur. Souligner avec des couleurs différentes les faits de langue relevés dans les quatre phrases : voix active / voix passive.',
          },
          {
            title: 'Je manipule et je réfléchis',
            description: 'Inviter les élèves à répondre aux questions de la rubrique « Je manipule et je réfléchis » : écrire les quatre phrases du support dans le tableau proposé dans le livret pour réfléchir sur le fait étudié (sujet qui fait l’action / sujet qui subit l’action / complément d’agent…) ; compléter le tableau proposé à partir des quatre phrases ; écrire le complément du verbe ou le complément d’agent de chacune des quatre phrases. Inviter les élèves à déduire la règle du fait de langue étudié (« Je retiens »).',
          },
          {
            title: 'Je m’entraîne',
            description: 'Demander aux élèves de réaliser l’exercice proposé dans le livret, rubrique « Je m’entraîne ». Inviter les élèves à corriger les exercices ; les élèves corrigent les exercices.',
          },
          {
            title: 'Je m’évalue',
            description: 'Réaliser les exercices 1 et 2 proposés dans le livret, rubrique « Je m’évalue ». Demander aux élèves de corriger leurs erreurs ; les élèves corrigent leurs erreurs.',
          },
        ],
      },
    ],
  },
  {
    lessonId: 'l6-french-peu-peux-peut',
    source: 'Guide Parcours français — 6e année',
    lessonNumber: 7,
    sessions: [
      {
        name: 'Séance 1 (Semaines 3 et 4)',
        objective: 'Écrire correctement les homonymes Peu / Peux / Peut.',
        activities: [
          {
            title: 'Étape : Observation / Découverte',
            description: 'Présenter le corpus : 1. Je vois qu’il reste peu d’arbres dans la forêt de cette grande région. 2. Le voisin peut participer à la collecte de nourriture. 3. Soufiane : « Est-ce que tu peux aider les pauvres ? » Rajae : « Oui, je peux le faire. » Lire et faire lire les phrases. Poser des questions pour faire identifier les faits étudiés : 1. Est-ce qu’il reste beaucoup d’arbres dans la forêt de cette grande région ? — Il reste peu d’arbres. 2. Est-ce que le voisin peut participer à la collecte de nourriture ? — Il peut participer. 3. Rajae peut aider les pauvres, et toi ? — Oui, je peux. 4. Quels sont les mots répétés dans ces réponses ? — Les homonymes peut ; peu, peux. Souligner avec des couleurs différentes les faits de langue relevés dans les phrases.',
          },
          {
            title: 'Étape : Compréhension / Conceptualisation',
            description: 'Inviter les élèves à répondre aux questions de la rubrique « Je manipule et je réfléchis » : mettre les trois phrases à l’imparfait, puis les écrire dans le tableau proposé dans le livret pour distinguer « la phrase où l’homonyme reste invariable » et « la phrase où l’homonyme se conjugue à l’imparfait ». Inviter les élèves à déduire la règle du fait de langue étudié (« Je retiens »).',
          },
        ],
      },
      {
        name: 'Séance 2 (Semaines 3 et 4)',
        objective: 'Écrire correctement les homonymes Peu / Peux / Peut.',
        activities: [
          {
            title: 'Étape : Application',
            description: 'Demander aux élèves de réaliser l’exercice proposé dans le livret, rubrique « Je m’entraîne ». Inviter les élèves à corriger les exercices ; les élèves corrigent les exercices.',
          },
          {
            title: 'Étape : Évaluation et Soutien',
            description: 'Réaliser les exercices 1 et 2 proposés dans le livret, rubrique « Je m’évalue ». Demander aux élèves de corriger leurs erreurs ; les élèves corrigent leurs erreurs.',
          },
          {
            title: 'Dictée',
            description: 'Texte : « La malbouffe. Le terme de malbouffe désigne une alimentation qui n’est pas saine et qui peut avoir des dégâts sur notre santé. Peu d’enfants résistent aux burgers, frites et sodas. En anglais, on parle de « junk food ». Je peux le traduire par la nourriture « déchets, ordure ». Un jeune peut manger une grande pizza et refuser un repas avec peu de légumes. » Lire le texte deux fois à haute voix ; écrire le terme en anglais au tableau ; dicter le texte phrase par phrase ; relire le texte à haute voix ; faire corriger la dictée au tableau.',
          },
        ],
      },
    ],
  },
  {
    lessonId: 'l6-french-pluriel-composes',
    source: 'Guide Parcours français — 6e année',
    lessonNumber: 7,
    sessions: [
      {
        name: 'Séance 1 (Semaines 3 et 4)',
        objective: 'Écrire au pluriel les noms composés.',
        activities: [
          {
            title: 'Étape : Observation / Découverte',
            description: 'Présenter des phrases contenant le fait de langue à étudier ; lire et faire lire les phrases. Poser des questions pour faire identifier les noms composés. Les élèves lisent les phrases et répondent aux questions.',
          },
          {
            title: 'Étape : Compréhension / Conceptualisation',
            description: 'Demander aux élèves de répondre aux questions présentées dans la rubrique « Je manipule et je réfléchis » : classer les noms composés dégagés du corpus dans le tableau indiqué ; identifier la nature des composantes des noms composés ; écrire ces mêmes noms composés au pluriel ou au singulier pour détecter les changements opérés. Inviter les élèves à déduire la règle permettant d’écrire correctement le pluriel des noms composés.',
          },
        ],
      },
      {
        name: 'Séance 2 (Semaines 3 et 4)',
        objective: 'Écrire au pluriel les noms composés.',
        activities: [
          {
            title: 'Étape : Application',
            description: 'Demander aux élèves de réaliser l’exercice prévu dans le livret de l’élève, rubrique « Je m’entraîne ». Inviter les élèves à corriger ; les élèves corrigent les exercices.',
          },
          {
            title: 'Étape : Évaluation et Soutien',
            description: 'Demander aux élèves de réaliser les exercices du livret de l’élève, rubrique « Je m’évalue ». Demander aux élèves de corriger leurs erreurs ; les élèves corrigent leurs erreurs.',
          },
          {
            title: 'Dictée',
            description: 'Texte : « Il était l’un des plus grands artistes de son époque. Ses chefs-d’œuvre sont connus jusqu’à nos jours. Les auteurs-compositeurs le considéraient comme un génie. Les amateurs de musique écoutaient ses chansons sur leurs tourne-disques et attendaient, avec impatience, la sortie de ses derniers films, car il était également un acteur. » Lire le texte deux fois à haute voix ; dicter le texte phrase par phrase ; relire le texte à haute voix ; faire corriger la dictée au tableau.',
          },
        ],
      },
    ],
  },
];
