import { useMemo, useState } from 'react';
import { speak } from '../lib/speech';
import { playCorrect } from '../lib/sound';
import { touchDaily } from '../lib/store';

interface Wisdom {
  emoji: string;
  text: string;
  source: string;
  meaning: string;
}

const WISDOMS: Wisdom[] = [
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

function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date.getTime() - start.getTime()) / 86_400_000);
}

const VERSES: { text: string; source: string; meaning: string }[] = [
  { text: 'وَقُل رَّبِّ زِدْنِي عِلْمًا', source: 'سورة طه، الآية 114', meaning: 'دعاء جميل نطلبه من الله أن يزيدنا علمًا.' },
  { text: 'وَاللَّهُ يُحِبُّ الصَّابِرِينَ', source: 'سورة آل عمران، الآية 146', meaning: 'الله يحب الذي يصبر ولا يستسلم.' },
  { text: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا', source: 'سورة الشرح، الآية 5', meaning: 'بعد الصعوبة يأتي الفرج والسهولة.' },
  { text: 'وَأَحْسِنُوا إِنَّ اللَّهَ يُحِبُّ الْمُحْسِنِينَ', source: 'سورة البقرة، الآية 195', meaning: 'أحسنوا في أقوالكم وأفعالكم، فالله يحب المحسنين.' },
  { text: 'وَبِالْوَالِدَيْنِ إِحْسَانًا', source: 'سورة الإسراء، الآية 23', meaning: 'أمرنا الله بالبر والإحسان إلى الأب والأم.' },
  { text: 'إِنَّ اللَّهَ مَعَ الَّذِينَ اتَّقَوا وَّالَّذِينَ هُم مُّحْسِنُونَ', source: 'سورة النحل، الآية 128', meaning: 'الله مع من يخافه ويحسن إلى الناس.' },
];

const HADITHS: { text: string; source: string; meaning: string }[] = [
  { text: 'إنَّما الأعمالُ بالنِّيَّاتِ.', source: 'متفق عليه', meaning: 'قيمة عملنا بحسب نيتنا؛ فانوِ الخير في كل ما تفعله.' },
  { text: 'مَن لا يَرحَمْ لا يُرحَمْ.', source: 'متفق عليه', meaning: 'من كان رحيمًا بالناس رحمه الله.' },
  { text: 'تَبَسُّمُكَ في وَجهِ أخيكَ صدقةٌ.', source: 'رواه الترمذي', meaning: 'الابتسامة في وجه الآخرين صدقة دون مال.' },
  { text: 'خيرُكم مَن تعلَّمَ القرآنَ وعلَّمَهُ.', source: 'رواه البخاري', meaning: 'أفضل الناس من يتعلم القرآن ويعلمه لغيره.' },
  { text: 'مَن سلَكَ طريقًا يلتمِسُ فيهِ عِلمًا سهَّلَ اللهُ لهُ طريقًا إلى الجنَّةِ.', source: 'رواه مسلم', meaning: 'طالب العلم له أجر عظيم عند الله.' },
  { text: 'أحبُّ الأعمالِ إلى اللهِ أدومُها وإن قَلَّ.', source: 'متفق عليه', meaning: 'العمل القليل المستمر أحب إلى الله من الكثير المنقطع.' },
  { text: 'الدِّينُ النَّصيحةُ.', source: 'رواه مسلم', meaning: 'من ديننا أن ننصح بعضنا ونحب لغيرنا الخير.' },
];

export function WisdomView() {
  const today = useMemo(() => new Date(), []);
  const [offset, setOffset] = useState(0);
  const [checked, setChecked] = useState(false);
  const index = (dayOfYear(today) + offset) % WISDOMS.length;
  const wisdom = WISDOMS[index];
  const verse = VERSES[dayOfYear(today) % VERSES.length];
  const hadith = HADITHS[dayOfYear(today) % HADITHS.length];

  function next() {
    setOffset((value) => value + 1);
    setChecked(false);
  }

  return (
    <div className="wisdom-page">
      <div className="page-head">
        <div className="page-title">
          <p className="eyebrow">نافذة صغيرة كل يوم</p>
          <h1>💡 حكمة اليوم</h1>
          <p>حكمة أو مثل أو حديث، مع معناه المبسّط لأبطال مدرستي.</p>
        </div>
      </div>

      <article className="wisdom-card">
        <div className="wisdom-emoji" aria-hidden="true">
          {wisdom.emoji}
        </div>
        <blockquote>{wisdom.text}</blockquote>
        <cite>— {wisdom.source}</cite>
        <p className="wisdom-meaning">✨ {wisdom.meaning}</p>

        <div className="wisdom-actions">
          <button className="btn primary" onClick={() => speak(`${wisdom.text}. ${wisdom.meaning}`)}>
            🔊 استمع
          </button>
          <button className="btn ghost" onClick={next}>
            حكمة أخرى ↻
          </button>
        </div>
      </article>

      <section className="wisdom-task">
        <h2>تحدّي اليوم</h2>
        <p>احفظ الحكمة ثم اضغط الزر إن أتممت الحفظ:</p>
        <button
          className={`btn${checked ? ' ghost' : ' primary'} big`}
          onClick={() => {
            if (!checked) {
              setChecked(true);
              playCorrect();
              touchDaily('wisdom');
              speak('أحسنت! أنت بطل الحكمة.');
            } else {
              setChecked(false);
            }
          }}
          disabled={checked}
        >
          {checked ? '✅ أحسنت! حفظتها' : '🌟 حفظتُ الحكمة'}
        </button>
      </section>

      <section className="daily-duo">
        <article className="daily-card verse">
          <p className="eyebrow">📖 آية اليوم</p>
          <blockquote>{verse.text}</blockquote>
          <cite>{verse.source}</cite>
          <p className="daily-meaning">✨ {verse.meaning}</p>
          <button className="btn ghost small" onClick={() => speak(`${verse.text}. ${verse.meaning}`)}>
            🔊 استمع
          </button>
        </article>
        <article className="daily-card hadith">
          <p className="eyebrow">🕌 حديث اليوم</p>
          <blockquote>{hadith.text}</blockquote>
          <cite>{hadith.source}</cite>
          <p className="daily-meaning">✨ {hadith.meaning}</p>
          <button className="btn ghost small" onClick={() => speak(`${hadith.text}. ${hadith.meaning}`)}>
            🔊 استمع
          </button>
        </article>
      </section>
    </div>
  );
}
