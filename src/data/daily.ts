/**
 * محتوى اليوم: حكمة وآية وحديث، يتبدل كل يوم بالتناوب حسب يوم السنة.
 * وحدة مشتركة بلا أي اعتماد خارجي، حتى يستعملها التطبيق (صفحة حكمة
 * اليوم) والخادم (إشعار الصباح اليومي) بنفس المحتوى ونفس الترتيب.
 */

export interface Wisdom {
  emoji: string;
  text: string;
  source: string;
  meaning: string;
}

export interface DailyItem {
  text: string;
  source: string;
  meaning: string;
}

export const WISDOMS: Wisdom[] = [
  { emoji: '🌱', text: 'العِلمُ في الصِّغَرِ كالنَّقشِ على الحَجَر.', source: 'مثل عربي', meaning: 'ما نتعلمه صغارًا يبقى معنا قويًا لا يُمحى.' },
  { emoji: '📚', text: 'اطلبوا العلمَ من المهدِ إلى اللحد.', source: 'حكمة', meaning: 'التعلّم لا يتوقف في أي عمر.' },
  { emoji: '🐢', text: 'في التأنّي السلامة، وفي العجلة الندامة.', source: 'مثل عربي', meaning: 'التمهّل ينجّينا من الأخطاء.' },
  { emoji: '🤝', text: 'المؤمن للمؤمن كالبنيان يشدّ بعضه بعضًا.', source: 'حديث شريف', meaning: 'التعاون يجعلنا أقوى.' },
  { emoji: '💧', text: 'قطرة فوق قطرة تصنع بحرًا.', source: 'حكمة', meaning: 'الجهد الصغير المتكرر يصنع إنجازًا كبيرًا.' },
  { emoji: '🌞', text: 'خيرُ الناسِ أنفعُهم للناس.', source: 'حديث شريف', meaning: 'أفضلنا من يساعد الآخرين.' },
  { emoji: '🧠', text: 'العقلُ السليم في الجسمِ السليم.', source: 'حكمة', meaning: 'الصحة تساعدنا على التعلّم الجيّد.' },
  { emoji: '🐝', text: 'من جدّ وجد، ومن زرع حصد.', source: 'مثل عربي', meaning: 'الاجتهاد يعطي ثمرته.' },
  { emoji: '🕊️', text: 'الكلمة الطيبة صدقة.', source: 'حديث شريف', meaning: 'كلامك الجميل أجرٌ وخير.' },
  { emoji: '🌳', text: 'الوقت كالسيف، إن لم تقطعه قطعك.', source: 'حكمة', meaning: 'استغلّ وقتك قبل أن يضيع.' },
  { emoji: '🔑', text: 'مفتاح النجاح المثابرة.', source: 'حكمة', meaning: 'لا تستسلم عند أول صعوبة.' },
  { emoji: '🌊', text: 'لا يرهب ابنَ عبّاسٍ بحرٌ.', source: 'حكمة', meaning: 'العلم يمنحك شجاعة وثقة.' },
  { emoji: '🐜', text: 'النملة تجمع قوتها في الصيف استعدادًا للشتاء.', source: 'حكاية', meaning: 'الاستعداد مسبقًا يحلّ مشاكل المستقبل.' },
  { emoji: '🎯', text: 'من لم يكن له هدف، تعب في الطريق.', source: 'حكمة', meaning: 'حدّد ما تريد أن تتعلمه اليوم.' },
  { emoji: '🌈', text: 'بعد كل عاصفة يأتي الصفاء.', source: 'حكمة', meaning: 'الصبر على الصعوبة يفتح باب الفرج.' },
  { emoji: '📖', text: 'خيرُ جليسٍ في الزمانِ كتاب.', source: 'شعر عربي', meaning: 'الكتاب صديق يعلّمك دون حساب.' },
  { emoji: '🤝', text: 'الصديق وقت الضيق.', source: 'مثل عربي', meaning: 'الأصدقاء الحقيقيون يقفون معنا عند الحاجة.' },
  { emoji: '🫱', text: 'نظافةُ المكانِ من نظافةِ القلب.', source: 'قيمة', meaning: 'المحافظة على نظافة مدرستنا واجب.' },
  { emoji: '🧩', text: 'لا شيء مستحيل على من حاول.', source: 'حكمة', meaning: 'المحاولة المتكررة تفتح أبوابًا مغلقة.' },
  { emoji: '🌙', text: 'أحبُّ الأعمالِ إلى الله أدومُها وإن قلّ.', source: 'حديث شريف', meaning: 'العمل القليل المستمر خير من الكثير المنقطع.' },
  { emoji: '🦉', text: 'العلمُ نورٌ، والجهلُ ظلام.', source: 'حكمة', meaning: 'التعلّم يضيء حياتنا.' },
  { emoji: '🐬', text: 'تعلّموا السباحة من الدلفين: اصبروا وكرّروا.', source: 'حكمة', meaning: 'التكرار طريق الإتقان.' },
  { emoji: '🌼', text: 'من زرع خيرًا حصد محبة.', source: 'حكمة', meaning: 'الطيب يعود إليك من الآخرين.' },
  { emoji: '⏰', text: 'الوقت لا ينتظر أحدًا.', source: 'حكمة', meaning: 'أنجز واجبك في وقته.' },
];

export const VERSES: DailyItem[] = [
  { text: 'وَقُل رَّبِّ زِدْنِي عِلْمًا', source: 'سورة طه، الآية 114', meaning: 'دعاء جميل نطلبه من الله أن يزيدنا علمًا.' },
  { text: 'وَاللَّهُ يُحِبُّ الصَّابِرِينَ', source: 'سورة آل عمران، الآية 146', meaning: 'الله يحب الذي يصبر ولا يستسلم.' },
  { text: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا', source: 'سورة الشرح، الآية 5', meaning: 'بعد الصعوبة يأتي الفرج والسهولة.' },
  { text: 'وَأَحْسِنُوا إِنَّ اللَّهَ يُحِبُّ الْمُحْسِنِينَ', source: 'سورة البقرة، الآية 195', meaning: 'أحسنوا في أقوالكم وأفعالكم، فالله يحب المحسنين.' },
  { text: 'وَبِالْوَالِدَيْنِ إِحْسَانًا', source: 'سورة الإسراء، الآية 23', meaning: 'أمرنا الله بالبر والإحسان إلى الأب والأم.' },
  { text: 'إِنَّ اللَّهَ مَعَ الَّذِينَ اتَّقَوا وَّالَّذِينَ هُم مُّحْسِنُونَ', source: 'سورة النحل، الآية 128', meaning: 'الله مع من يخافه ويحسن إلى الناس.' },
];

export const HADITHS: DailyItem[] = [
  { text: 'إنَّما الأعمالُ بالنِّيَّاتِ.', source: 'متفق عليه', meaning: 'قيمة عملنا بحسب نيتنا؛ فانوِ الخير في كل ما تفعله.' },
  { text: 'مَن لا يَرحَمْ لا يُرحَمْ.', source: 'متفق عليه', meaning: 'من كان رحيمًا بالناس رحمه الله.' },
  { text: 'تَبَسُّمُكَ في وَجهِ أخيكَ صدقةٌ.', source: 'رواه الترمذي', meaning: 'الابتسامة في وجه الآخرين صدقة دون مال.' },
  { text: 'خيرُكم مَن تعلَّمَ القرآنَ وعلَّمَهُ.', source: 'رواه البخاري', meaning: 'أفضل الناس من يتعلم القرآن ويعلمه لغيره.' },
  { text: 'مَن سلَكَ طريقًا يلتمِسُ فيهِ عِلمًا سهَّلَ اللهُ لهُ طريقًا إلى الجنَّةِ.', source: 'رواه مسلم', meaning: 'طالب العلم له أجر عظيم عند الله.' },
  { text: 'أحبُّ الأعمالِ إلى اللهِ أدومُها وإن قَلَّ.', source: 'متفق عليه', meaning: 'العمل القليل المستمر أحب إلى الله من الكثير المنقطع.' },
  { text: 'الدِّينُ النَّصيحةُ.', source: 'رواه مسلم', meaning: 'من ديننا أن ننصح بعضنا ونحب لغيرنا الخير.' },
];

export function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date.getTime() - start.getTime()) / 86_400_000);
}

export interface DailyContent {
  wisdom: Wisdom;
  verse: DailyItem;
  hadith: DailyItem;
}

/** محتوى يوم معين: الحكمة والآية والحديث، بنفس التناوب في كل مكان. */
export function dailyContent(date: Date): DailyContent {
  const day = dayOfYear(date);
  return {
    wisdom: WISDOMS[day % WISDOMS.length],
    verse: VERSES[day % VERSES.length],
    hadith: HADITHS[day % HADITHS.length],
  };
}

/** التاريخ الحالي بتوقيت المغرب (الدار البيضاء)، ليطابق يوم ولي الأمر. */
export function todayInMorocco(now: Date = new Date()): Date {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Africa/Casablanca',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const get = (type: string) => Number(parts.find((part) => part.type === type)?.value ?? 0);
  return new Date(get('year'), get('month') - 1, get('day'), 12, 0, 0);
}
