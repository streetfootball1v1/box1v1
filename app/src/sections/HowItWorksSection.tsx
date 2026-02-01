import { Users, Trophy, TrendingUp } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Регистрация',
    description: 'Оставь заявку через Telegram. Мы проверим твой уровень и добавим в ростер.',
    icon: Users,
  },
  {
    number: '02',
    title: 'Матчи',
    description: 'Играй 1×1 с вратарём. До двух голов, 20 секунд на атаку — чистый скилл.',
    icon: Trophy,
  },
  {
    number: '03',
    title: 'Рейтинг',
    description: 'Зарабатывай очки за победы. Поднимайся в таблице и становись лицом лиги.',
    icon: TrendingUp,
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 px-5" aria-label="Как работает BOX1V1">
      <div className="max-w-[1300px] mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-extrabold uppercase tracking-[0.2em] text-[#16a34a] mb-4">
            Быстрый старт
          </span>
          <h2 className="text-[clamp(2rem,6vw,4rem)] leading-[0.95]">
            Как работает BOX1V1
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="card-box relative overflow-hidden group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Number Background */}
              <div className="absolute -top-4 -right-4 text-[8rem] font-black italic text-black/[0.03] leading-none select-none pointer-events-none">
                {step.number}
              </div>

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#22c55e]/10 flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-[#22c55e]" strokeWidth={2.5} />
                  </div>
                  <span className="text-4xl font-black italic text-[#22c55e]">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-2xl font-black italic uppercase mb-3">
                  {step.title}
                </h3>

                <p className="text-[#374151] leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
