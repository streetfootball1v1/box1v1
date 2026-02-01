import { Target, Zap, Camera, Users } from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'Формат 1×1',
    description: 'Чистый скилл без командной поддержки. Только ты, вратарь и мяч.',
  },
  {
    icon: Zap,
    title: 'Динамика',
    description: 'Матчи до двух голов, 20 секунд на атаку. Нет времени на раскачку.',
  },
  {
    icon: Camera,
    title: 'Контент',
    description: 'Каждый матч — это история. Съёмка, монтаж, публикация.',
  },
  {
    icon: Users,
    title: 'Комьюнити',
    description: 'Игроки становятся персонажами лиги со своей аудиторией.',
  },
];

const rules = [
  {
    number: '01',
    title: 'Формат',
    description: 'Матчи 1 на 1 с участием независимого вратаря.',
  },
  {
    number: '02',
    title: 'Тайминг',
    description: 'Лимит на атаку — 20 секунд.',
  },
  {
    number: '03',
    title: 'Результат',
    description: 'Продолжительность игры до двух голов, без ничьи.',
  },
];

export function AboutSection() {
  return (
    <section className="pt-[calc(var(--box-nav-h)+40px)] pb-20 px-5" aria-label="О проекте">
      <div className="max-w-[1300px] mx-auto">
        {/* Header */}
        <div className="mb-16">
          <span className="inline-block text-xs font-extrabold uppercase tracking-[0.2em] text-[#16a34a] mb-4">
            О проекте
          </span>
          <h1 className="section-title mb-6">BOX1V1</h1>
          <p className="text-xl text-[#374151] max-w-2xl leading-relaxed">
            Медиа-лига уличного футбола формата 1×1. Мы создаём контент вокруг игроков, 
            их историй и соперничества. Каждый матч — это шоу.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="card-box"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-2xl bg-[#22c55e]/10 flex items-center justify-center mb-5">
                <feature.icon className="w-6 h-6 text-[#22c55e]" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-black italic uppercase mb-3">
                {feature.title}
              </h3>
              <p className="text-[#374151] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Rules Section */}
        <div className="bg-white rounded-[32px] border border-[var(--box-border)] p-8 md:p-12">
          <h2 className="text-3xl font-black italic uppercase mb-10">
            Регламент
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {rules.map((rule) => (
              <div
                key={rule.number}
                className="relative pb-8 md:pb-0 md:border-r md:border-[var(--box-border)] md:last:border-r-0 md:pr-8 md:last:pr-0 border-b md:border-b-0 border-[var(--box-border)] last:border-b-0 last:pb-0"
              >
                <span className="text-xs font-extrabold uppercase tracking-[0.1em] text-[#16a34a] mb-3 block">
                  {rule.number}. {rule.title}
                </span>
                <p className="text-[#374151] leading-relaxed">
                  {rule.description}
                </p>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-12 pt-8 border-t border-[var(--box-border)]">
            <h3 className="text-lg font-black italic uppercase mb-6">
              Дополнительные правила
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 bg-[#22c55e] rounded-full mt-2 flex-shrink-0" />
                <div>
                  <span className="font-bold">Поле:</span>
                  <span className="text-[#374151] ml-1">Уличная площадка с воротами 3×2 метра</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 bg-[#22c55e] rounded-full mt-2 flex-shrink-0" />
                <div>
                  <span className="font-bold">Мяч:</span>
                  <span className="text-[#374151] ml-1">Стандартный футбольный мяч №5</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 bg-[#22c55e] rounded-full mt-2 flex-shrink-0" />
                <div>
                  <span className="font-bold">Экипировка:</span>
                  <span className="text-[#374151] ml-1">Спортивная обувь с резиновой подошвой</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 bg-[#22c55e] rounded-full mt-2 flex-shrink-0" />
                <div>
                  <span className="font-bold">Судейство:</span>
                  <span className="text-[#374151] ml-1">Независимый рефери на каждом матче</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-[#374151] mb-6">
            Хочешь стать частью BOX1V1?
          </p>
          <a
            href="https://t.me/streetbox1v1"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex"
          >
            Подать заявку
          </a>
        </div>
      </div>
    </section>
  );
}
