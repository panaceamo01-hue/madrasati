import type { Route } from '../lib/router';

interface Tab {
  href: string;
  label: string;
  emoji: string;
  matches: Route['name'][];
}

const TABS: Tab[] = [
  { href: '#/', label: 'المستويات', emoji: '🏫', matches: ['home', 'level', 'lesson', 'examLesson', 'examLevel'] },
  { href: '#/games', label: 'ألعاب الذكاء', emoji: '🎮', matches: ['games', 'game'] },
  { href: '#/wisdom', label: 'حكمة اليوم', emoji: '💡', matches: ['wisdom'] },
  { href: '#/progress', label: 'ملفي', emoji: '🦸', matches: ['progress'] },
  { href: '#/settings', label: 'الإعدادات', emoji: '⚙️', matches: ['settings', 'parent'] },
];

export function BottomNav({ current }: { current: Route['name'] }) {
  return (
    <nav className="bottom-nav" aria-label="التنقل بين نوافذ التطبيق">
      <div className="bottom-nav-inner">
        {TABS.map((tab) => {
          const active = tab.matches.includes(current);
          return (
            <a
              key={tab.href}
              href={tab.href}
              className={`tab${active ? ' active' : ''}`}
              aria-current={active ? 'page' : undefined}
            >
              <span className="tab-bubble" aria-hidden="true">
                {tab.emoji}
              </span>
              <span className="tab-label">{tab.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
