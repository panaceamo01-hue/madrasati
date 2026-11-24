import { dailyContent, todayInMorocco } from '../src/data/daily';
import { createVapidJwt } from './_lib/webpush';

/** نقطة فحص مؤقتة: هل تعمل الاستيرادات النسبية في واجهات Vercel؟ تُحذف بعد الاختبار. */
export default async function handler(req: any, res: any): Promise<void> {
  const content = dailyContent(todayInMorocco());
  res.status(200).json({
    ok: true,
    verse: content.verse.text,
    jwtFn: typeof createVapidJwt,
  });
}
