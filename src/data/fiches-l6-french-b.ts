import type { OfficialFiche } from '../types';

/**
 * الجذاذات الرسمية لدروس الفرنسية — المستوى السادس (المجموعة ب)،
 * منسوخة من «Guide Parcours français — 6e année» (نص OCR للدليل، 208 صفحات).
 * كل جذاذة تجمع حصتي الدرس في الدليل (ساعتان من 30 دقيقة، أو 35 دقيقة للإملاء)
 * بالترتيب، مع كفايات كل حصة وأنشطتها. الجذاذة من الدليل الفرنسي تبقى بالفرنسية.
 *
 * ترقيم الدروس (lessonNumber): الدليل لا يرقّم جذاذاته، فالرقم هو ترتيب الجذاذة
 * بين جذاذات اللغة (قواعد/تصريف/إملاء) في وحدتها حسب ترتيب ظهورها في نص الدليل.
 *
 * ملاحظات عن المصدر:
 * - جذاذتا «l6-french-futur» (المستقبل البسيط) و«l6-french-imperatif-1er»
 *   (الأمر للمجموعة الأولى) لا توجد لهما جذاذة تعليمية في هذا الدليل: الموضوعان
 *   مذكوران في جدول تخطيط الوحدة وفي جذاذة «أسبوع التقييم والدعم» (الأسبوع 5)
 *   فقط، وتلك الأسابيع مستثناة من النسخ، فبقي الدرسان بلا جذاذة رسمية.
 * - درس «l6-french-homophones» (a/à, et/est, son/sont) غير موجود أصلا في برنامج
 *   هذا الدليل: كلمة «homophone» لا ترد فيه إطلاقا، فبقي بلا جذاذة رسمية.
 * - جذاذتا «l6-french-passe-compose» و«l6-french-expansion-phrase» فقدت سطور
 *   رأسيهما (الأهداف والمدة والوسائل) في قراءة OCR؛ هدف كل منهما مأخوذ من جدول
 *   تخطيط وحدته، ومحتوى الأنشطة منسوخ كما ظهر.
 * - تصحيحات أخطاء OCR الواضحة: في جذاذة الماضي المركب للأفعال الضميرية،
 *   قراءة «s’empirer» صُححت إلى «s’aggraver» (الفعل في نص الانطلاق هو
 *   «s’est aggravée»)؛ وفي جذاذة (euil/eille…) قراءة «les déterminants relevés»
 *   صُححت إلى «les mots relevés»؛ وفي جذاذة الماضي الناقص للأفعال الضميرية،
 *   عبارة القاعدة المشوشة («distinguer et transformer le discours») حُذفت
 *   لأنها من جذاذة الخطاب المجاورة.
 * - نصا الانطلاق في جذاذتي (euil/eille…) والماضي الناقص للأفعال الضميرية غير
 *   ظاهرين في قراءة OCR (ذُكرت الأسئلة فقط)، فالنشاط يوثق الأسئلة دون النص.
 */
export const OFFICIAL_FICHES_FRENCH6_B: OfficialFiche[] = [
  {
    lessonId: 'l6-french-imparfait',
    source: 'Guide Parcours français — 6e année',
    lessonNumber: 3,
    sessions: [
      {
        name: 'Séance 1 – Observation et découverte',
        objective: 'Conjuguer des verbes usuels à l’imparfait de l’indicatif.',
        activities: [
          {
            title: 'Observation / Découverte',
            description:
              'Présente le corpus : « Notre maison était vaste. Nous avions même un jardinet où poussait un sycomore. Des buissons d’acacia le séparaient de la rue, et un bassin de pierre, sorte d’étang, ne se remplissait d’eau que lors des crues du fleuve. Nous prenions nos repas sur la véranda où l’on accédait de la chambre de consultation de mon père. » (D’après Sinouhé l’Égyptien - Tome 1 de Mika Waltari). Pose des questions pour faire découvrir le fait de langue proposé à l’étude : 1. De quoi parle le narrateur ? 2. Relève les verbes conjugués dans ce texte. 3. À quel groupe chacun de ces verbes appartient-il ? 4. À quel temps ces verbes sont-ils conjugués ?',
          },
          {
            title: 'Compréhension / Conceptualisation',
            description:
              'Invite les élèves à répondre aux questions de la rubrique « Je manipule et je réfléchis » : écrire les verbes conjugués dans le tableau ; conjuguer les verbes « séparer », « remplir » et « prendre » à l’imparfait. Invite les élèves à déduire la règle de conjugaison à retenir.',
          },
        ],
      },
      {
        name: 'Séance 2 – Application et évaluation',
        objective: 'Conjuguer des verbes usuels à l’imparfait de l’indicatif.',
        activities: [
          {
            title: 'Application',
            description:
              'Demande aux élèves de réaliser les exercices proposés dans le livret, rubrique « Je m’entraîne ». Invite les élèves à corriger les exercices.',
          },
          {
            title: 'Évaluation et Soutien',
            description:
              'Réaliser les exercices proposés dans le livret, rubrique « Je m’évalue ». Traite les erreurs identifiées.',
          },
        ],
      },
    ],
  },
  {
    lessonId: 'l6-french-passe-compose',
    source: 'Guide Parcours français — 6e année',
    lessonNumber: 2,
    sessions: [
      {
        name: 'Séance 1 – Observation et découverte',
        objective: 'Conjuguer des verbes usuels au passé composé de l’indicatif.',
        activities: [
          {
            title: 'Observation / Découverte',
            description:
              'Présente des phrases contenant le fait de langue à étudier. Présente le corpus : lit et fait lire les phrases. Pose des questions pour faire identifier les faits étudiés.',
          },
          {
            title: 'Compréhension / Conceptualisation',
            description:
              'Demande aux élèves de répondre aux questions présentées dans la rubrique « Je manipule et je réfléchis » en : réécrivant la première phrase en remplaçant « Les marcheurs » par « Nous », puis par « Vous » ; conjuguant le verbe « aller » au passé composé, aux trois personnes du pluriel ; conjuguant le verbe « préparer » au passé composé, aux trois personnes du pluriel ; exprimant ce qu’il remarque. Invite les élèves à déduire la règle du fait étudié.',
          },
        ],
      },
      {
        name: 'Séance 2 – Application et évaluation',
        objective: 'Conjuguer des verbes usuels au passé composé de l’indicatif.',
        activities: [
          {
            title: 'Application',
            description:
              'Demande aux élèves de réaliser les exercices prévus dans le livret de l’élève, rubrique « Je m’entraîne ». Invite les élèves à corriger les exercices.',
          },
          {
            title: 'Évaluation et Soutien',
            description:
              'Demande aux élèves de réaliser les exercices sur le livret de l’élève, rubrique « Je m’évalue » (exercices 1 et 2). Demande aux élèves de corriger leurs erreurs.',
          },
        ],
      },
    ],
  },
  {
    lessonId: 'l6-french-negation',
    source: 'Guide Parcours français — 6e année',
    lessonNumber: 1,
    sessions: [
      {
        name: 'Séance 1 – Observation et découverte',
        objective: 'Employer la négation.',
        activities: [
          {
            title: 'Observation / Découverte',
            description:
              'Indique la page du livret. Présente le corpus (voir livret). Lit et fait lire les phrases. Pose des questions pour faire identifier les faits étudiés : 1. Sur quoi ces phrases nous informent-elles ? 2. Quelles sont les phrases affirmatives ? 3. Expriment-elles la même idée ? 4. Quelles sont les phrases qui ne sont pas affirmatives ? Relève les mots qui t’ont permis de répondre ? 5. Comment appelle-t-on ces phrases ? Le corpus oppose des phrases affirmatives (« Les robots sont utiles à l’homme. Ils peuvent faire tout ce que font les humains. Ils seront un jour équivalents aux humains. ») et des phrases négatives (« Les robots ne sont pas utiles à l’homme. Ils ne peuvent pas faire tout ce que font les humains. Ils ne seront jamais équivalents aux humains. »).',
          },
          {
            title: 'Compréhension / Conceptualisation',
            description:
              'Demande aux élèves de répondre aux questions présentées dans la rubrique « Je manipule et je réfléchis » en : relevant les phrases négatives et les éléments utilisés pour exprimer la négation ; soulignant les mots entourant la négation dans les phrases relevées ; trouvant d’autres mots pour exprimer la négation. Invite les élèves à déduire la règle du fait étudié (voir la règle dans le livret).',
          },
        ],
      },
      {
        name: 'Séance 2 – Application et évaluation',
        objective: 'Employer la négation.',
        activities: [
          {
            title: 'Application',
            description:
              'Demande aux élèves de réaliser les exercices dans « Je m’entraîne ». Invite les élèves à corriger.',
          },
          {
            title: 'Évaluation et Soutien',
            description:
              'Demande aux élèves de réaliser les exercices 1 et 2 du livret de l’élève, rubrique « Je m’évalue ». Demande aux élèves de corriger leurs erreurs.',
          },
        ],
      },
    ],
  },
  {
    lessonId: 'l6-french-mots-euil',
    source: 'Guide Parcours français — 6e année',
    lessonNumber: 3,
    sessions: [
      {
        name: 'Séance 1 – Observation et découverte',
        objective: 'Écrire correctement les mots terminés avec euil/euille/eil/eille/ail/aille.',
        activities: [
          {
            title: 'Observation / Découverte',
            description:
              'Présente des phrases contenant le fait de langue à étudier. Présente le corpus : lit et fait lire les phrases. Pose des questions pour faire identifier les faits étudiés : 1. Où se trouve le narrateur de ce texte ? 2. Quelle est la nature des mots en gras ? 3. Par quoi se terminent les mots en gras ?',
          },
          {
            title: 'Compréhension / Conceptualisation',
            description:
              'Demande aux élèves de répondre aux questions de la rubrique « Je manipule et je réfléchis » en : écrivant les mots relevés dans le tableau ; précisant, pour chaque mot, le genre et le nombre ; remplaçant, dans les phrases, le nom par un autre nom de genre et de nombre différents. Invite les élèves à déduire la règle du fait étudié (voir livret).',
          },
        ],
      },
      {
        name: 'Séance 2 – Application et évaluation',
        objective: 'Écrire correctement les mots terminés avec euil/euille/eil/eille/ail/aille.',
        activities: [
          {
            title: 'Application',
            description:
              'Demande aux élèves de réaliser les exercices prévus dans le livret de l’élève, rubrique « Je m’entraîne ». Invite les élèves à corriger les exercices.',
          },
          {
            title: 'Évaluation et Soutien',
            description:
              'Demande aux élèves de réaliser les exercices dans « Je m’évalue ». Demande aux élèves de corriger leurs erreurs.',
          },
          {
            title: 'Dictée',
            description:
              'Texte : « Chez ma grand-mère assise sur le fauteuil, j’ai ouvert le portail du jardin et j’ai chassé la volaille qui picorait le grain. Tout-à-coup, une abeille m’a piqué. J’ai couru vers mon grand-père qui m’a mis une feuille d’une plante sur ma main gonflée. Toute la nuit, je n’ai pas pu trouver le sommeil. » Lit le texte deux fois à haute voix. Dicte le texte (lentement et de manière expressive) phrase par phrase. Relit le texte à haute voix. Fait corriger la dictée au tableau.',
          },
        ],
      },
    ],
  },
  {
    lessonId: 'l6-french-expansion-phrase',
    source: 'Guide Parcours français — 6e année',
    lessonNumber: 2,
    sessions: [
      {
        name: 'Séance 1 – Observation et découverte',
        objective: 'Réduire une phrase et enrichir une phrase.',
        activities: [
          {
            title: 'Observation / Découverte',
            description:
              'Présente le corpus : 1. « Chaque jour, matin et soir, mon père nous demande avec une grande insistance d’économiser l’eau et l’électricité. » 2. « Mon père nous demande d’économiser l’eau et l’électricité. » Lit et fait lire les phrases. Pose des questions pour faire identifier les faits étudiés : 1. Quelle est la phrase qui contient le plus d’informations ? 2. Quelle est la phrase qui contient moins d’informations ? 3. Quels sont les mots supprimés dans la deuxième phrase ?',
          },
          {
            title: 'Compréhension / Conceptualisation',
            description:
              'Invite les élèves à répondre aux questions de la rubrique « Je manipule et je réfléchis » en écrivant : les quatre phrases du support dans le tableau proposé dans le livret ; les compléments et les compléments d’agent. Invite les élèves à déduire la règle du fait étudié (« Je retiens »).',
          },
        ],
      },
      {
        name: 'Séance 2 – Application et évaluation',
        objective: 'Réduire une phrase et enrichir une phrase.',
        activities: [
          {
            title: 'Application',
            description:
              'Demande aux élèves de réaliser les exercices prévus dans le livret de l’élève, rubrique « Je m’entraîne ». Invite les élèves à corriger les exercices.',
          },
          {
            title: 'Évaluation et Soutien',
            description:
              'Demande aux élèves de réaliser les exercices sur le livret de l’élève, rubrique « Je m’évalue » (exercices 1 et 2). Demande aux élèves de corriger leurs erreurs.',
          },
        ],
      },
    ],
  },
  {
    lessonId: 'l6-french-imperatif-2e',
    source: 'Guide Parcours français — 6e année',
    lessonNumber: 3,
    sessions: [
      {
        name: 'Séance 1 – Observation et découverte',
        objective: 'Conjuguer des verbes usuels du 2e groupe à l’impératif présent.',
        activities: [
          {
            title: 'Observation / Découverte',
            description:
              'Présente le corpus : 1. « Choisissons une lampe à néon au lieu d’une lampe ordinaire ! » 2. « Agissez pour aider à économiser de l’énergie ! » Lit et fait lire les phrases. Pose des questions pour faire identifier les faits étudiés : 1. Quels sont les verbes conjugués dans le texte ci-dessus ? 2. Quel est l’infinitif de chacun de ces verbes ? 3. Comment appelle-t-on ces verbes ? 4. À quel temps ces verbes sont-ils conjugués ?',
          },
          {
            title: 'Compréhension / Conceptualisation',
            description:
              'Invite les élèves à répondre aux questions de la rubrique « Je manipule et je réfléchis » en : observant le tableau et indiquant ce qui diffère entre la conjugaison du verbe « agir » à l’impératif présent par rapport à la conjugaison de ce verbe au présent de l’indicatif ; entourant, dans les phrases proposées, les verbes conjugués à l’impératif présent. Invite les élèves à déduire la règle du fait étudié (« Je retiens »).',
          },
        ],
      },
      {
        name: 'Séance 2 – Application et évaluation',
        objective: 'Conjuguer des verbes usuels du 2e groupe à l’impératif présent.',
        activities: [
          {
            title: 'Application',
            description:
              'Demande aux élèves de réaliser les exercices prévus dans le livret de l’élève, rubrique « Je m’entraîne ». Invite les élèves à corriger les exercices.',
          },
          {
            title: 'Évaluation et Soutien',
            description:
              'Demande aux élèves de réaliser les exercices sur le livret de l’élève, rubrique « Je m’évalue » (exercices 1 et 2). Demande aux élèves de corriger leurs erreurs.',
          },
        ],
      },
    ],
  },
  {
    lessonId: 'l6-french-passe-compose-pron',
    source: 'Guide Parcours français — 6e année',
    lessonNumber: 4,
    sessions: [
      {
        name: 'Séance 1 – Observation et découverte',
        objective: 'Conjuguer des verbes pronominaux usuels au passé composé de l’indicatif.',
        activities: [
          {
            title: 'Observation / Découverte',
            description:
              'Présente le corpus : 1. « Le gaspillage de la nourriture s’est intensifié ces dernières années. » 2. « Nous nous sommes habitués à ce gaspillage inquiétant alors que la situation des pauvres s’est aggravée. » Lit et fait lire les phrases. Pose des questions pour faire identifier les faits étudiés : 1. Quels sont les verbes conjugués dans le texte ci-dessus ? 2. Quel est l’infinitif de chacun de ces verbes ? 3. Comment appelle-t-on ces verbes ? 4. À quel temps ces verbes sont-ils conjugués ? (Réponses : s’intensifier, s’habituer, s’aggraver ; ce sont des verbes pronominaux ; ils sont conjugués au passé composé.)',
          },
          {
            title: 'Compréhension / Conceptualisation',
            description:
              'Invite les élèves à répondre aux questions de la rubrique « Je manipule et je réfléchis » en écrivant : les deux phrases du support dans le tableau proposé dans le livret (Groupe nominal sujet / Pronom réfléchi / Auxiliaire être conjugué / Participe passé) ; l’infinitif de ces verbes ; conjuguant le verbe « s’habituer » au passé composé. Invite les élèves à déduire la règle du fait étudié, rubrique « Je retiens ».',
          },
        ],
      },
      {
        name: 'Séance 2 – Application et évaluation',
        objective: 'Conjuguer des verbes pronominaux usuels au passé composé de l’indicatif.',
        activities: [
          {
            title: 'Application',
            description:
              'Demande aux élèves de réaliser les exercices proposés dans le livret, rubrique « Je m’entraîne ». Invite les élèves à corriger les exercices.',
          },
          {
            title: 'Évaluation et Soutien',
            description:
              'Réaliser les exercices proposés dans le livret, rubrique « Je m’évalue » (exercices 1 et 2). Demande aux élèves de corriger leurs erreurs.',
          },
        ],
      },
    ],
  },
  {
    lessonId: 'l6-french-imperatif-3e-pron',
    source: 'Guide Parcours français — 6e année',
    lessonNumber: 2,
    sessions: [
      {
        name: 'Séance 1 – Observation et découverte',
        objective: 'Conjuguer des verbes usuels du 3e groupe et des verbes pronominaux à l’impératif.',
        activities: [
          {
            title: 'Observation / Découverte',
            description:
              'Présente des phrases contenant les faits de langue à étudier. Présente le corpus : lit et fait lire le petit poème. Pose des questions pour faire dégager les verbes conjugués à l’impératif.',
          },
          {
            title: 'Compréhension / Conceptualisation',
            description:
              'Demande aux élèves de répondre aux questions présentées dans la rubrique « Je manipule et je réfléchis » en : classant les verbes conjugués à l’impératif dans le tableau proposé ; identifiant d’autres verbes conjugués à l’impératif dans la liste indiquée ; écrivant les terminaisons de ces verbes. Invite les élèves à déduire la règle permettant de conjuguer correctement les verbes usuels du 3e groupe et les verbes pronominaux à l’impératif.',
          },
        ],
      },
      {
        name: 'Séance 2 – Application et évaluation',
        objective: 'Conjuguer des verbes usuels du 3e groupe et des verbes pronominaux à l’impératif.',
        activities: [
          {
            title: 'Application',
            description:
              'Demande aux élèves de réaliser les exercices prévus dans le livret de l’élève, rubrique « Je m’entraîne ». Invite les élèves à corriger les exercices.',
          },
          {
            title: 'Évaluation et Soutien',
            description:
              'Demande aux élèves de réaliser les exercices sur le livret de l’élève, rubrique « Je m’évalue » (exercices 1 et 2). Demande aux élèves de corriger leurs erreurs.',
          },
        ],
      },
    ],
  },
  {
    lessonId: 'l6-french-mots-invariables',
    source: 'Guide Parcours français — 6e année',
    lessonNumber: 3,
    sessions: [
      {
        name: 'Séance 1 – Observation et découverte',
        objective: 'Écrire correctement les mots invariables.',
        activities: [
          {
            title: 'Observation / Découverte',
            description:
              'Présente le corpus : lit et fait lire le texte. Pose des questions pour faire identifier les mots invariables.',
          },
          {
            title: 'Compréhension / Conceptualisation',
            description:
              'Demande aux élèves de répondre aux questions présentées dans la rubrique « Je manipule et je réfléchis » en : relevant les autres mots invariables se trouvant dans le texte ; classant les mots relevés dans un tableau en précisant leurs natures. Invite les élèves à déduire la règle qui permet d’identifier et d’orthographier correctement les mots invariables.',
          },
        ],
      },
      {
        name: 'Séance 2 – Application et évaluation',
        objective: 'Écrire correctement les mots invariables.',
        activities: [
          {
            title: 'Application',
            description:
              'Demande aux élèves de réaliser les exercices prévus dans le livret de l’élève, rubrique « Je m’entraîne ». Invite les élèves à corriger les exercices.',
          },
          {
            title: 'Évaluation et Soutien',
            description:
              'Demande aux élèves de réaliser les exercices sur le livret de l’élève, rubrique « Je m’évalue » (exercices 1 et 2). Demande aux élèves de corriger leurs erreurs.',
          },
          {
            title: 'Dictée',
            description:
              'Texte : « Les lieux artistiques, comme le théâtre, l’opéra, le musée, sont particuliers. Pour comprendre cela, il faut aller voir une pièce en direct. La grandeur du lieu, la haute estrade, l’éclairage, la décoration, le jeu de lumières, créent un monde magique, celui de l’art. Les acteurs sont différents de ceux qu’on voit à la télévision. Ils sont plus réels et plus proches. Être dans ce genre de lieux, à côté de ces acteurs est une expérience inoubliable. » Lit le texte deux fois à haute voix. Dicte le texte phrase par phrase. Relit le texte à haute voix. Fait corriger la dictée au tableau.',
          },
        ],
      },
    ],
  },
  {
    lessonId: 'l6-french-imparfait-pron',
    source: 'Guide Parcours français — 6e année',
    lessonNumber: 5,
    sessions: [
      {
        name: 'Séance 1 – Observation et découverte',
        objective: 'Conjuguer les verbes pronominaux usuels à l’imparfait de l’indicatif.',
        activities: [
          {
            title: 'Observation / Découverte',
            description:
              'Présente le corpus : lit et fait lire les phrases. Pose des questions pour faire identifier les verbes conjugués à l’imparfait de l’indicatif.',
          },
          {
            title: 'Compréhension / Conceptualisation',
            description:
              'Demande aux élèves de répondre aux questions présentées dans la rubrique « Je manipule et je réfléchis » en : classant les verbes pronominaux conjugués à l’imparfait dans le tableau proposé ; identifiant d’autres verbes conjugués à l’imparfait dans la liste indiquée ; écrivant les terminaisons de ces verbes. Invite les élèves à déduire la règle du fait de langue étudié.',
          },
        ],
      },
      {
        name: 'Séance 2 – Application et évaluation',
        objective: 'Conjuguer les verbes pronominaux usuels à l’imparfait de l’indicatif.',
        activities: [
          {
            title: 'Application',
            description:
              'Demande aux élèves de réaliser les exercices de la rubrique « Je m’entraîne » dans le livret de l’élève. Invite les élèves à corriger les exercices.',
          },
          {
            title: 'Évaluation et Soutien',
            description:
              'Demande aux élèves de réaliser les exercices de la rubrique « Je m’évalue » dans le livret de l’élève (exercices 1 et 2). Demande aux élèves de corriger leurs erreurs.',
          },
        ],
      },
    ],
  },
];
