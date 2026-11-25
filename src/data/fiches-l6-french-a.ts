import type { OfficialFiche } from '../types';

/**
 * الجذاذات الرسمية لدروس الفرنسية للمستوى السادس (المجموعة أ)،
 * منسوخة من «Guide Parcours français — 6e année» (نص OCR للدليل).
 * كل جذاذة تجمع حصص الدرس في الدليل بالترتيب، مع كفايات كل حصة وأنشطتها.
 * ملاحظات عن المصدر:
 * - lessonNumber هو ترتيب الجذاذة بين جذاذات اللغة (Grammaire / Conjugaison /
 *   Orthographe) في وحدتها التعليمية، لأن الدليل لا يرقّم جذاذاته.
 * - حيث يحدد الدليل «Séance 2» صراحة اتُّبِع تقسيمه؛ وإلا فالحصة 1 هي
 *   الملاحظة والفهم، والحصة 2 هي التطبيق والتقويم (مع الإملاء حيث ورد).
 * - جذاذات «Évaluation, soutien et consolidation» لم تُنسخ (أسابيع تقويم ودعم).
 * - درس l6-french-cod-coi بلا جذاذة: الدليل لا يحتوي جذاذة مستقلة لـ«Le COD et
 *   le COI»؛ يرد COD وCOI فقط كمعارف سابقة داخل جذاذة «Employer la
 *   pronominalisation des compléments de verbe» (درس l6-french-pronominalisation).
 * - تصحيحات أخطاء OCR الواضحة: «par ce que» ← «parce que»؛ «20€ siècle» ←
 *   «20e siècle»؛ «on se serviraient» ← «on se servirait»؛ «1€ phrase» ←
 *   «1re phrase»؛ وفي جذاذة الشرط (1er/2e) «conjuguant les verbes au présent
 *   de l’indicatif» ← «au conditionnel présent» (موضوع الجذاذة، والمقطع الموازي
 *   في النص يقرأ «au conditionnel présent»).
 * - أهداف أُعيد تركيبها لأن سطرها ضاع في OCR (من مخطط الوحدة وجذاذة التقويم
 *   لنفس الموضوع): accord-adjectif وCCL/CCT وconditionnel-1er-2e
 *   وconditionnel-3e-pron. وفي جذاذة accents ضاع سطر الهدف الأول فأُبقي
 *   الهدف الظاهر فقط («Écrire, sous dictée, un texte de quatre phrases»).
 * - في جذاذة comparaison نهاية النقطة الوسطى من «Je manipule» غير مقروءة
 *   في OCR فصيغت «identifiant de nouveaux outils de comparaison».
 * - نصوص المجاميع (corpus) غير المقتبسة في OCR لم تُخترع؛ بقي نشاط
 *   «Présente le corpus» كما في الدليل (النص في كتاب التلميذ).
 */
export const OFFICIAL_FICHES_FRENCH6_A: OfficialFiche[] = [
  {
    lessonId: 'l6-french-accents',
    source: 'Guide Parcours français — 6e année',
    lessonNumber: 3,
    sessions: [
      {
        name: 'Séance 1 — Les accents (observation et conceptualisation)',
        objective: 'Écrire, sous dictée, un texte de quatre phrases',
        activities: [
          {
            title: 'Présentation du corpus',
            description: 'L’enseignant présente le corpus contenant le fait de langue à étudier (livret de l’élève) ; les élèves découvrent le corpus. (Travail individuel)',
          },
          {
            title: 'Observation et découverte',
            description: 'L’enseignant exploite le corpus à l’aide des questions proposées dans la rubrique « J’observe et je découvre » pour faire découvrir le fait de langue proposé à l’étude ; les élèves participent à la formulation des réponses aux questions posées et découvrent le fait de langue. (Travail individuel puis collectif)',
          },
          {
            title: 'Je manipule et je réfléchis',
            description: 'L’enseignant amène les élèves à répondre aux questions proposées dans la rubrique « Je manipule et je réfléchis » ; les élèves répondent aux questions en identifiant les mots qui contiennent les accents et en classant les mots dans le tableau proposé. (Travail individuel / collectif)',
          },
          {
            title: 'Déduction de la règle',
            description: 'L’enseignant invite les élèves à déduire la règle du fait étudié ; les élèves déduisent la règle du fait de langue étudié. (Travail collectif)',
          },
        ],
      },
      {
        name: 'Séance 2 — Les accents (application, évaluation et dictée)',
        objective: 'Écrire, sous dictée, un texte de quatre phrases',
        activities: [
          {
            title: 'Je m’entraîne',
            description: 'L’enseignant demande aux élèves de réaliser les exercices proposés dans le livret, rubrique « Je m’entraîne », puis procède à la correction collective et individuelle ; les élèves réalisent les exercices et participent à la correction collective et corrigent leur réalisation, si besoin est. (Travail individuel)',
          },
          {
            title: 'Je m’évalue',
            description: 'L’enseignant demande aux élèves de réaliser les exercices proposés dans le livret, rubrique « Je m’évalue », puis procède à la correction collective et individuelle ; les élèves réalisent les exercices et participent à la correction et corrigent leur réalisation, si besoin est. (Travail individuel)',
          },
          {
            title: 'Dictée',
            description: 'Texte : « Les touristes venaient souvent en voyage organisé pour visiter les pyramides de l’Égypte. Ils repartaient surpris et étonnés de ces gigantesques monuments historiques. Ils étaient motivés pour visiter d’autres monuments, au Caire. Ils étaient satisfaits d’avoir réalisé l’album photo de leurs rêves. » L’enseignant lit le texte deux fois à haute voix, dicte le texte progressivement, le relit à haute voix, puis procède à la correction collective et individuelle ; les élèves écoutent le texte lu, écrivent sous dictée le texte, suivent et vérifient ce qu’ils ont écrit, puis participent à la correction collective et corrigent leurs erreurs. (Travail individuel / collectif)',
          },
        ],
      },
    ],
  },
  {
    lessonId: 'l6-french-adjectif',
    source: 'Guide Parcours français — 6e année',
    lessonNumber: 4,
    sessions: [
      {
        name: 'Séance 1 — L’adjectif qualificatif et sa fonction (observation et conceptualisation)',
        objective: 'Reconnaitre l’adjectif qualificatif et sa fonction (épithète et attribut)',
        activities: [
          {
            title: 'Présentation du corpus',
            description: 'L’enseignant présente le corpus : « Le plus ancien quartier arabe de Grenade est situé sur la colline de l’Alhambra. Ses rues sont très étroites et ses places sont bordées de maisons blanchies à la chaux. L’Alhambra mauresque est un ensemble fortifié de bâtiments. Ce site historique de la civilisation islamique est très célèbre. » Il lit et fait lire les phrases ; les élèves découvrent le corpus. (Travail individuel)',
          },
          {
            title: 'Questions d’observation',
            description: 'L’enseignant pose des questions pour faire identifier les faits étudiés : 1. Où le quartier arabe est-il situé ? — Il est situé sur la colline de l’Alhambra. 2. Comment est ce quartier ? — C’est un ancien quartier. 3. Comment sont les rues ? — Les rues sont très étroites. 4. Relève, dans les deux dernières phrases, les mots utilisés pour caractériser l’Alhambra. — Ancien... étroites... 5. Quelle est la nature grammaticale de ces mots ? 6. Par quoi l’adjectif « célèbre » est-il relié au verbe ? Quelle est donc sa fonction grammaticale ? 7. Où l’adjectif « ancien » est-il placé par rapport au mot « quartier » ? Quelle est donc sa fonction grammaticale ? Les élèves participent à la formulation des réponses. (Travail individuel / collectif)',
          },
          {
            title: 'Je manipule et je réfléchis',
            description: 'L’enseignant invite les élèves à répondre aux questions de la rubrique « Je manipule et je réfléchis » et à déduire la règle du fait de langue à retenir ; les élèves réalisent les activités de la rubrique en relevant les adjectifs qualificatifs dans le support et en classant les adjectifs qualificatifs dans le tableau proposé à cet effet, puis déduisent la règle à retenir. (Travail individuel / collectif)',
          },
        ],
      },
      {
        name: 'Séance 2 — L’adjectif qualificatif et sa fonction (application et évaluation)',
        objective: 'Reconnaitre l’adjectif qualificatif et sa fonction (épithète et attribut)',
        activities: [
          {
            title: 'Je m’entraîne',
            description: 'L’enseignant demande aux élèves de réaliser les exercices proposés dans le livret, rubrique « Je m’entraîne », puis procède à la correction des exercices ; les élèves réalisent les exercices et participent à la correction des exercices. (Travail individuel / collectif)',
          },
          {
            title: 'Je m’évalue',
            description: 'L’enseignant fait réaliser les exercices proposés dans le livret, rubrique « Je m’évalue », puis identifie les erreurs et procède à leur traitement ; les élèves réalisent les exercices, participent au traitement des erreurs et corrigent leur réalisation, si besoin est. (Travail individuel)',
          },
        ],
      },
    ],
  },
  {
    lessonId: 'l6-french-accord-adjectif',
    source: 'Guide Parcours français — 6e année',
    lessonNumber: 6,
    sessions: [
      {
        name: 'Séance 1 — L’accord de l’adjectif qualificatif (observation et conceptualisation)',
        objective: 'Appliquer les règles d’accord de l’adjectif qualificatif ; écrire, sous dictée, un texte de quatre phrases',
        activities: [
          {
            title: 'Présentation du corpus',
            description: 'L’enseignant présente le corpus : « Le musée du Louvre est l’un des plus grands musées au monde. Ce site culturel et artistique est situé au cœur de la ville de Paris, près de la rive droite de la Seine. Le bâtiment est un ancien palais royal. Parmi ses pièces les plus célèbres figure La Joconde. » Les élèves découvrent le corpus. (Travail individuel)',
          },
          {
            title: 'Questions d’observation',
            description: 'L’enseignant pose des questions pour faire identifier le fait de langue proposé à l’étude : 1. Que décrit-on dans ce texte ? 2. Comment est le musée du Louvre ? 3. Près de quelle rive de la Seine le musée du Louvre est-il situé ? 4. Quelle est la nature des mots qui t’ont permis de répondre aux questions 2 et 3 ? 5. Pourquoi l’adjectif « grands » est-il écrit au masculin pluriel dans la première phrase ? Les élèves participent à la formulation des réponses et découvrent le fait de langue, objet d’étude. (Travail individuel / collectif)',
          },
          {
            title: 'Je manipule et je réfléchis',
            description: 'L’enseignant invite les élèves à répondre aux questions de la rubrique « Je manipule et je réfléchis », à classer les adjectifs dans un tableau, à remplacer « Le musée du Louvre » par « La tour Eiffel » et à réécrire la phrase, puis à déduire la règle orthographique à retenir ; les élèves répondent aux questions de la rubrique en classant les adjectifs qualificatifs dans le tableau et en remplaçant, dans la 1re phrase, « Le musée du Louvre » par « La tour Eiffel », puis déduisent la règle orthographique à retenir. (Travail individuel / collectif)',
          },
        ],
      },
      {
        name: 'Séance 2 — L’accord de l’adjectif qualificatif (application, évaluation et dictée)',
        objective: 'Appliquer les règles d’accord de l’adjectif qualificatif ; écrire, sous dictée, un texte de quatre phrases',
        activities: [
          {
            title: 'Je m’entraîne',
            description: 'L’enseignant demande aux élèves de réaliser les exercices proposés dans le livret, rubrique « Je m’entraîne », puis invite les élèves à corriger les exercices ; les élèves réalisent l’exercice et participent à la correction des exercices. (Travail individuel)',
          },
          {
            title: 'Je m’évalue',
            description: 'L’enseignant fait réaliser les exercices proposés dans le livret, rubrique « Je m’évalue », puis procède au traitement des erreurs ; les élèves réalisent les exercices, participent au traitement des erreurs et corrigent leur réalisation. (Travail individuel)',
          },
          {
            title: 'Dictée',
            description: 'Texte : « Le plus ancien quartier arabe de Grenade est situé sur la colline de l’Alhambra. Ses rues sont très étroites et ses places sont bordées de maisons blanchies à la chaux. L’Alhambra est un ensemble fortifié de bâtiments. Ce site historique de la civilisation islamique est très célèbre. » L’enseignant lit le texte deux fois à haute voix, écrit les mots difficiles au tableau, dicte progressivement le texte, le relit à haute voix, puis fait corriger la dictée au tableau ; les élèves écoutent le texte lu, écrivent sous dictée le texte, suivent et vérifient ce qu’ils ont écrit, puis corrigent leurs erreurs. (Travail individuel / collectif)',
          },
        ],
      },
    ],
  },
  {
    lessonId: 'l6-french-accord-verbe-sujet',
    source: 'Guide Parcours français — 6e année',
    lessonNumber: 3,
    sessions: [
      {
        name: 'Séance 1 — L’accord du verbe avec le sujet (observation et conceptualisation)',
        objective: 'Accorder le verbe avec le sujet',
        activities: [
          {
            title: 'Présentation du corpus',
            description: 'L’enseignant présente des phrases contenant le fait de langue à étudier et présente le corpus : il lit et fait lire les phrases ; les élèves lisent les phrases. (Travail individuel)',
          },
          {
            title: 'Questions d’observation',
            description: 'L’enseignant pose des questions pour faire identifier les faits étudiés ; les élèves répondent aux questions. (Travail individuel puis collectif)',
          },
          {
            title: 'Je manipule et je réfléchis',
            description: 'L’enseignant demande aux élèves de répondre aux questions présentées dans la rubrique « Je manipule et je réfléchis » et les invite à déduire la règle du fait étudié ; les élèves réalisent les activités de la rubrique en réécrivant les deux premières phrases en remplaçant « Il » par « Ils », en réécrivant la troisième phrase en remplaçant « Nous » par « Je », et en exprimant ce qu’ils remarquent, puis déduisent la règle du fait de langue étudié. (Travail individuel, au tableau, sur le livret et sur les ardoises)',
          },
        ],
      },
      {
        name: 'Séance 2 — L’accord du verbe avec le sujet (application et évaluation)',
        objective: 'Accorder le verbe avec le sujet',
        activities: [
          {
            title: 'Je m’entraîne',
            description: 'L’enseignant demande aux élèves de réaliser les exercices prévus dans le livret de l’élève, rubrique « Je m’entraîne », puis invite les élèves à corriger ; les élèves réalisent l’exercice et corrigent les exercices. (Travail individuel)',
          },
          {
            title: 'Je m’évalue',
            description: 'L’enseignant demande aux élèves de réaliser les exercices sur le livret de l’élève, rubrique « Je m’évalue », puis demande aux élèves de corriger leurs erreurs ; les élèves réalisent les exercices 1 et 2 et corrigent leurs erreurs. (Travail individuel)',
          },
        ],
      },
    ],
  },
  {
    lessonId: 'l6-french-accord-participe',
    source: 'Guide Parcours français — 6e année',
    lessonNumber: 5,
    sessions: [
      {
        name: 'Séance 1 — L’accord du participe passé (observation et conceptualisation)',
        objective: 'Accorder le participe passé employé avec « être » et « avoir »',
        activities: [
          {
            title: 'Présentation du corpus',
            description: 'L’enseignant présente des phrases contenant le fait de langue à étudier et présente le corpus : il lit et fait lire les phrases ; les élèves lisent les phrases. (Travail individuel puis collectif)',
          },
          {
            title: 'Questions d’observation',
            description: 'L’enseignant pose des questions pour faire identifier les faits étudiés ; les élèves répondent aux questions.',
          },
          {
            title: 'Je manipule et je réfléchis',
            description: 'L’enseignant demande aux élèves de répondre aux questions présentées dans la rubrique « Je manipule et je réfléchis » et les invite à déduire la règle du fait étudié ; les élèves réalisent les activités de la rubrique en complétant le tableau à partir des phrases proposées et en réécrivant les phrases 2 et 3 en mettant le sujet au singulier, puis déduisent la règle du fait de langue étudié. (Travail individuel, au tableau, sur le livret et sur les ardoises)',
          },
        ],
      },
      {
        name: 'Séance 2 — L’accord du participe passé (application, évaluation et dictée)',
        objective: 'Accorder le participe passé employé avec « être » et « avoir »',
        activities: [
          {
            title: 'Je m’entraîne',
            description: 'L’enseignant demande aux élèves de réaliser les exercices prévus dans le livret de l’élève, rubrique « Je m’entraîne », puis invite les élèves à corriger les exercices ; les élèves réalisent l’exercice de la rubrique « Je m’entraîne » et corrigent les exercices. (Travail individuel)',
          },
          {
            title: 'Je m’évalue',
            description: 'L’enseignant demande aux élèves de réaliser les exercices sur le livret de l’élève, rubrique « Je m’évalue », puis demande aux élèves de corriger leurs erreurs ; les élèves réalisent les exercices 1 et 2 et corrigent leurs erreurs. (Travail individuel)',
          },
          {
            title: 'Dictée',
            description: 'Texte : « Quand on est solidaire, on est lié aux autres. On fait partie d’un groupe, on n’est pas seul. C’est important aussi, pour nombre de personnes. En effet, je pense que les humains sont tous liés, qu’ils dépendent les uns des autres. » L’enseignant lit le texte deux fois à haute voix, dicte le texte phrase par phrase, le relit à haute voix, puis fait corriger la dictée au tableau ; les élèves écoutent le texte lu, écrivent sous dictée le texte, suivent et vérifient sur leur texte, puis corrigent leurs erreurs. (Travail individuel)',
          },
        ],
      },
    ],
  },
  {
    lessonId: 'l6-french-cause',
    source: 'Guide Parcours français — 6e année',
    lessonNumber: 4,
    sessions: [
      {
        name: 'Séance 1 — Les expressions de la cause (observation et conceptualisation)',
        objective: 'Reconnaitre les expressions de la cause ; utiliser les expressions de la cause',
        activities: [
          {
            title: 'Présentation du corpus',
            description: 'L’enseignant indique la page du livret et présente le corpus : il lit et fait lire les phrases ; les élèves lisent les phrases. (Travail individuel)',
          },
          {
            title: 'Questions d’observation',
            description: 'L’enseignant pose des questions pour faire identifier les faits étudiés : 1. Pourquoi Anis est-il pour la technologie ? — Anis est pour la technologie parce qu’elle nous simplifie la vie de tous les jours. 2. Pourquoi Wifaq ne partage-t-elle pas son avis ? — Wifaq ne partage pas son avis parce que la technologie pollue. 3. Pourquoi l’ordinateur constitue-t-il un danger réel pour l’environnement ? — L’ordinateur constitue un danger car il est difficilement recyclable. 4. Quels sont les mots que tu as utilisés pour répondre à la question « pourquoi » ? — Parce que, car. 5. Qu’expriment ces mots ? — Ces mots expriment la cause. Les élèves répondent aux questions. (Travail individuel puis collectif)',
          },
          {
            title: 'Je manipule et je réfléchis',
            description: 'L’enseignant demande aux élèves de répondre aux questions présentées dans la rubrique « Je manipule et je réfléchis » et les invite à déduire la règle du fait étudié ; les élèves réalisent les activités de la rubrique en utilisant d’autres expressions de la cause, en montrant la nuance entre les deux expressions de la cause dans les deux premières phrases, et en proposant d’autres expressions de la cause, puis déduisent la règle du fait de langue étudié. (Travail individuel, au tableau, sur le livret et sur les ardoises)',
          },
        ],
      },
      {
        name: 'Séance 2 — Les expressions de la cause (application et évaluation)',
        objective: 'Reconnaitre les expressions de la cause ; utiliser les expressions de la cause',
        activities: [
          {
            title: 'Je m’entraîne',
            description: 'L’enseignant demande aux élèves de réaliser les exercices prévus dans le livret de l’élève, rubrique « Je m’entraîne », puis invite les élèves à corriger ; les élèves réalisent les exercices de la rubrique « Je m’entraîne » et corrigent les exercices. (Travail individuel)',
          },
          {
            title: 'Je m’évalue',
            description: 'L’enseignant demande aux élèves de réaliser les exercices de la rubrique « Je m’évalue », puis demande aux élèves de corriger leurs erreurs ; les élèves réalisent les exercices 1 et 2 de la rubrique « Je m’évalue » et corrigent leurs erreurs. (Travail individuel)',
          },
        ],
      },
    ],
  },
  {
    lessonId: 'l6-french-ccl-cct',
    source: 'Guide Parcours français — 6e année',
    lessonNumber: 1,
    sessions: [
      {
        name: 'Séance 1 — Le CCL et le CCT (observation et conceptualisation)',
        objective: 'Reconnaître les CCL et les CCT ; utiliser les CCL et les CCT',
        activities: [
          {
            title: 'Présentation du corpus',
            description: 'L’enseignant présente des phrases contenant le fait de langue à étudier : 1. Les réserves non renouvelables sont utilisées depuis le 20e siècle. 2. Les panneaux solaires sont installés sur les toits des bâtiments. Il lit et fait lire les phrases ; les élèves lisent les phrases. (Travail individuel)',
          },
          {
            title: 'Questions d’observation',
            description: 'L’enseignant pose des questions pour faire identifier les faits étudiés : 1. Depuis quand les réserves non renouvelables sont-elles utilisées ? — Depuis le 20e siècle. 2. Où les panneaux solaires sont-ils installés ? — Sur les toits. 3. Quels sont les mots qui t’ont permis de répondre ? 4. Quelle est la fonction grammaticale de ces mots ? — Compléments circonstanciels de temps et de lieu. Les élèves répondent aux questions. (Travail individuel / collectif)',
          },
          {
            title: 'Je manipule et je réfléchis',
            description: 'L’enseignant invite les élèves à répondre aux questions de la rubrique « Je manipule et je réfléchis » et à déduire la règle du fait étudié ; les élèves réalisent les activités de la rubrique en formulant les questions pour trouver les compléments circonstanciels relevés dans le support et en soulignant les CCT et les CCL dans les phrases proposées, puis déduisent la règle du fait de langue étudié (« Je retiens »). (Travail individuel, au tableau, sur le livret et sur les ardoises)',
          },
        ],
      },
      {
        name: 'Séance 2 — Le CCL et le CCT (application et évaluation)',
        objective: 'Reconnaître les CCL et les CCT ; utiliser les CCL et les CCT',
        activities: [
          {
            title: 'Je m’entraîne',
            description: 'L’enseignant demande aux élèves de réaliser les exercices prévus dans le livret de l’élève, rubrique « Je m’entraîne », puis invite les élèves à corriger les exercices ; les élèves réalisent l’exercice de la rubrique « Je m’entraîne » et corrigent les exercices. (Travail individuel)',
          },
          {
            title: 'Je m’évalue',
            description: 'L’enseignant demande aux élèves de réaliser les exercices sur le livret de l’élève, rubrique « Je m’évalue », puis demande aux élèves de corriger leurs erreurs ; les élèves réalisent les exercices 1 et 2 et corrigent leurs erreurs. (Travail individuel)',
          },
        ],
      },
    ],
  },
  {
    lessonId: 'l6-french-ccm',
    source: 'Guide Parcours français — 6e année',
    lessonNumber: 1,
    sessions: [
      {
        name: 'Séance 1 — Le complément circonstanciel de manière (observation et conceptualisation)',
        objective: 'Reconnaitre le complément circonstanciel de manière (CCM) ; utiliser le complément circonstanciel de manière (CCM)',
        activities: [
          {
            title: 'Présentation du corpus',
            description: 'L’enseignant présente le corpus contenant le fait de langue à étudier ; les élèves lisent les phrases. (Travail individuel)',
          },
          {
            title: 'Questions d’observation',
            description: 'L’enseignant pose des questions pour faire identifier les faits étudiés ; les élèves répondent aux questions. (Travail individuel puis collectif)',
          },
          {
            title: 'Je manipule et je réfléchis',
            description: 'L’enseignant demande aux élèves de répondre aux questions présentées dans la rubrique « Je manipule et je réfléchis » et les invite à déduire la règle du fait étudié ; les élèves réalisent les activités de la rubrique en soulignant les compléments circonstanciels de manière (CCM) et en classant les compléments circonstanciels de manière dans un tableau, puis déduisent la règle du fait de langue étudié. (Travail individuel / collectif)',
          },
        ],
      },
      {
        name: 'Séance 2 — Le complément circonstanciel de manière (application et évaluation)',
        objective: 'Reconnaitre le complément circonstanciel de manière (CCM) ; utiliser le complément circonstanciel de manière (CCM)',
        activities: [
          {
            title: 'Je m’entraîne',
            description: 'L’enseignant demande aux élèves de réaliser les exercices proposés dans le livret, rubrique « Je m’entraîne », puis invite les élèves à corriger ; les élèves réalisent l’exercice et corrigent les exercices. (Travail individuel)',
          },
          {
            title: 'Je m’évalue',
            description: 'L’enseignant fait réaliser les exercices proposés dans le livret, rubrique « Je m’évalue », puis demande aux élèves de corriger leurs erreurs ; les élèves réalisent les exercices et corrigent leurs erreurs. (Travail individuel)',
          },
        ],
      },
    ],
  },
  {
    lessonId: 'l6-french-comparaison',
    source: 'Guide Parcours français — 6e année',
    lessonNumber: 1,
    sessions: [
      {
        name: 'Séance 1 — La comparaison (observation et conceptualisation)',
        objective: 'Reconnaître la comparaison ; exprimer la comparaison',
        activities: [
          {
            title: 'Présentation du corpus',
            description: 'L’enseignant présente des phrases contenant l’expression de la comparaison et présente le corpus : il lit et fait lire les phrases ; les élèves lisent les phrases. (Travail individuel)',
          },
          {
            title: 'Questions d’observation',
            description: 'L’enseignant pose des questions pour faire identifier la comparaison ; les élèves répondent aux questions. (Travail individuel puis collectif)',
          },
          {
            title: 'Je manipule et je réfléchis',
            description: 'L’enseignant demande aux élèves de répondre aux questions présentées dans la rubrique « Je manipule et je réfléchis » et les invite à déduire la règle qui permet d’exprimer la comparaison ; les élèves réalisent les activités de la rubrique en classant les outils de comparaison dans le tableau indiqué et en identifiant et en cherchant de nouveaux outils de comparaison, puis déduisent la règle du fait de langue étudié. (Travail individuel, au tableau, sur le livret et sur les ardoises)',
          },
        ],
      },
      {
        name: 'Séance 2 — La comparaison (application et évaluation)',
        objective: 'Reconnaître la comparaison ; exprimer la comparaison',
        activities: [
          {
            title: 'Je m’entraîne',
            description: 'L’enseignant demande aux élèves de réaliser les exercices prévus dans le livret de l’élève, rubrique « Je m’entraîne », puis invite les élèves à corriger ; les élèves réalisent l’exercice de la rubrique « Je m’entraîne » et corrigent les exercices. (Travail individuel)',
          },
          {
            title: 'Je m’évalue',
            description: 'L’enseignant demande aux élèves de réaliser les exercices sur le livret de l’élève, rubrique « Je m’évalue », puis demande aux élèves de corriger leurs erreurs ; les élèves réalisent les exercices de la rubrique « Je m’évalue » et corrigent leurs erreurs. (Travail individuel)',
          },
        ],
      },
    ],
  },
  {
    lessonId: 'l6-french-conditionnel-1er-2e',
    source: 'Guide Parcours français — 6e année',
    lessonNumber: 5,
    sessions: [
      {
        name: 'Séance 1 — Le conditionnel présent des verbes du 1er et du 2e groupes (observation et conceptualisation)',
        objective: 'Conjuguer les verbes usuels du 1er et du 2e groupes au conditionnel présent',
        activities: [
          {
            title: 'Présentation du corpus',
            description: 'L’enseignant indique la page du livret et présente le corpus : il lit et fait lire les phrases ; les élèves lisent les phrases. (Travail individuel)',
          },
          {
            title: 'Questions d’observation',
            description: 'L’enseignant pose des questions pour faire identifier les faits étudiés : 1. Quels sont les verbes conjugués dans ces phrases ? — Les verbes conjugués : « j’étais » ; « je choisirais » ; « je la remplirais » ; « je volerais » ; « je marcherais ». 2. Quel est l’infinitif de chacun de ces verbes ? — L’infinitif des verbes conjugués : « être » ; « choisir » ; « remplir » ; « voler » ; « marcher ». 3. À quels groupes ces verbes appartiennent-ils ? 4. À quel temps ces verbes sont-ils conjugués ? Les élèves répondent aux questions. (Travail individuel puis collectif)',
          },
          {
            title: 'Je manipule et je réfléchis',
            description: 'L’enseignant demande aux élèves de répondre aux questions présentées dans la rubrique « Je manipule et je réfléchis » et les invite à déduire la règle du fait étudié ; les élèves réalisent les activités de la rubrique en classant les verbes conjugués dans le tableau et en conjuguant les verbes au conditionnel présent, puis déduisent la règle du fait de langue étudié. (Travail individuel, au tableau, sur le livret et sur les ardoises)',
          },
        ],
      },
      {
        name: 'Séance 2 — Le conditionnel présent des verbes du 1er et du 2e groupes (application et évaluation)',
        objective: 'Conjuguer les verbes usuels du 1er et du 2e groupes au conditionnel présent',
        activities: [
          {
            title: 'Je m’entraîne',
            description: 'L’enseignant demande aux élèves de réaliser les exercices de la rubrique « Je m’entraîne », puis invite les élèves à corriger ; les élèves réalisent les exercices de la rubrique « Je m’entraîne » et corrigent les exercices. (Travail individuel)',
          },
          {
            title: 'Je m’évalue',
            description: 'L’enseignant demande aux élèves de réaliser les exercices de la rubrique « Je m’évalue », puis demande aux élèves de corriger leurs erreurs ; les élèves réalisent les exercices 1 et 2 de la rubrique « Je m’évalue » et corrigent leurs erreurs. (Travail individuel)',
          },
        ],
      },
    ],
  },
  {
    lessonId: 'l6-french-conditionnel-3e-pron',
    source: 'Guide Parcours français — 6e année',
    lessonNumber: 2,
    sessions: [
      {
        name: 'Séance 1 — Le conditionnel présent des verbes du 3e groupe et des verbes pronominaux (observation et conceptualisation)',
        objective: 'Conjuguer des verbes usuels du 3e groupe et des verbes pronominaux au conditionnel présent',
        activities: [
          {
            title: 'Présentation du corpus',
            description: 'L’enseignant présente des phrases contenant le fait de langue à étudier : 1. J’apprendrais plus si je pouvais visiter un parc d’éoliennes. 2. Des pays africains voudraient suivre l’exemple marocain en matière d’énergie solaire. 3. Il a fallu du temps pour comprendre qu’avec une planche, on se servirait des vagues pour glisser sur l’eau. 4. Le Maroc se doterait en énergie nucléaire dans 10 ans. Il lit et fait lire les phrases ; les élèves lisent les phrases. (Travail individuel / collectif)',
          },
          {
            title: 'Questions d’observation',
            description: 'L’enseignant pose des questions pour faire identifier les faits étudiés ; les élèves répondent aux questions et découvrent l’objectif de la leçon.',
          },
          {
            title: 'Je manipule et je réfléchis',
            description: 'L’enseignant invite les élèves à répondre aux questions de la rubrique « Je manipule et je réfléchis » et à déduire la règle du fait étudié ; les élèves réalisent les activités de la rubrique en écrivant les quatre phrases du support dans le tableau proposé et en distinguant radical et terminaison du conditionnel présent, puis déduisent la règle du fait de langue étudié (« Je retiens »). (Travail individuel, au tableau, sur le livret et sur les ardoises)',
          },
        ],
      },
      {
        name: 'Séance 2 — Le conditionnel présent des verbes du 3e groupe et des verbes pronominaux (application et évaluation)',
        objective: 'Conjuguer des verbes usuels du 3e groupe et des verbes pronominaux au conditionnel présent',
        activities: [
          {
            title: 'Je m’entraîne',
            description: 'L’enseignant demande aux élèves de réaliser les exercices prévus dans le livret de l’élève, rubrique « Je m’entraîne », puis invite les élèves à corriger les exercices ; les élèves réalisent l’exercice de la rubrique « Je m’entraîne » et corrigent les exercices. (Travail individuel)',
          },
          {
            title: 'Je m’évalue',
            description: 'L’enseignant demande aux élèves de réaliser les exercices sur le livret de l’élève, rubrique « Je m’évalue », puis demande aux élèves de corriger leurs erreurs ; les élèves réalisent les exercices 1 et 2 et corrigent leurs erreurs. (Travail individuel)',
          },
        ],
      },
    ],
  },
  {
    lessonId: 'l6-french-discours',
    source: 'Guide Parcours français — 6e année',
    lessonNumber: 4,
    sessions: [
      {
        name: 'Séance 1 — Le discours direct et le discours indirect (observation et conceptualisation)',
        objective: 'Distinguer le discours direct du discours indirect ; transformer le discours direct au discours indirect / le discours indirect au discours direct',
        activities: [
          {
            title: 'Présentation du corpus',
            description: 'L’enseignant présente le corpus : il lit et fait lire les phrases ; les élèves lisent les phrases. (Travail individuel)',
          },
          {
            title: 'Questions d’observation',
            description: 'L’enseignant pose des questions pour faire identifier les différents discours (direct et indirect) ; les élèves répondent aux questions. (Travail individuel puis collectif)',
          },
          {
            title: 'Je manipule et je réfléchis',
            description: 'L’enseignant demande aux élèves de répondre aux questions présentées dans la rubrique « Je manipule et je réfléchis » et les invite à déduire la règle qui permet de distinguer et de transformer le discours ; les élèves réalisent les activités de la rubrique en classant les différents discours dans le tableau indiqué et en relevant, des mêmes exemples, les éléments nécessaires à la transformation du discours, puis déduisent la règle du fait de langue étudié. (Travail individuel, au tableau, sur le livret et sur les ardoises)',
          },
        ],
      },
      {
        name: 'Séance 2 — Le discours direct et le discours indirect (application et évaluation)',
        objective: 'Distinguer le discours direct du discours indirect ; transformer le discours direct au discours indirect / le discours indirect au discours direct',
        activities: [
          {
            title: 'Je m’entraîne',
            description: 'L’enseignant demande aux élèves de réaliser les exercices prévus dans le livret de l’élève, rubrique « Je m’entraîne », puis invite les élèves à corriger les exercices ; les élèves réalisent les exercices de la rubrique « Je m’entraîne » et corrigent les exercices. (Travail individuel)',
          },
          {
            title: 'Je m’évalue',
            description: 'L’enseignant demande aux élèves de réaliser les exercices sur le livret de l’élève, rubrique « Je m’évalue », puis demande aux élèves de corriger leurs erreurs ; les élèves réalisent les exercices de la rubrique « Je m’évalue » et corrigent leurs erreurs. (Travail individuel)',
          },
        ],
      },
    ],
  },
];
