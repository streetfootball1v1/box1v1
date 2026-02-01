import { Send, CheckCircle, ArrowRight, MessageCircle } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Напиши нам',
    description: 'Перейди в Telegram-канал BOX1V1 и оставь комментарий под любым постом.',
    action: 'Открыть Telegram',
    actionLink: 'https://t.me/streetbox1v1',
    icon: Send,
  },
  {
    number: '02',
    title: 'Добавь хештег',
    description: 'Используй хештег #BOXУЧАСТВОВАТЬ — так мы поймём, что хочешь вступить.',
    action: null,
    actionLink: null,
    icon: MessageCircle,
  },
  {
    number: '03',
    title: 'Жди ответа',
    description: 'Мы проверим твой уровень игры и свяжемся для уточнения деталей.',
    action: null,
    actionLink: null,
    icon: CheckCircle,
  },
];

const requirements = [
  'Умение играть в футбол на уровне выше любительского',
  'Готовность к регулярным матчам и съёмкам',
  'Активность в социальных сетях (будет плюсом)',
  'Нахождение в городе проведения матчей',
];

export function HowToJoinSection() {
  return (
    <section className="pt-[calc(var(--box-nav-h)+40px)] pb-20 px-5" aria-label="Как попасть">
      <div className="max-w-[1300px] mx-auto">
        {/* Header */}
        <div className="mb-16">
          <span className="inline-block text-xs font-extrabold uppercase tracking-[0.2em] text-[#16a34a] mb-4">
            Присоединиться
          </span>
          <h1 className="section-title mb-6">Как попасть</h1>
          <p className="text-xl text-[#374151] max-w-2xl leading-relaxed">
            Хочешь стать участником BOX1V1? Следуй простым шагам — и мы рассмотрим твою кандидатуру.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="card-box relative overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Connector Line (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-full w-full h-[2px] z-10">
                  <div className="w-full h-full bg-[var(--box-border)] relative">
                    <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#22c55e]" />
                  </div>
                </div>
              )}

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

                <p className="text-[#374151] leading-relaxed mb-6">
                  {step.description}
                </p>

                {step.action && step.actionLink && (
                  <a
                    href={step.actionLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {step.action}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Requirements */}
        <div className="bg-white rounded-[32px] border border-[var(--box-border)] p-8 md:p-12">
          <h2 className="text-2xl font-black italic uppercase mb-8">
            Требования к участникам
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {requirements.map((req, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-2xl bg-[var(--box-bg)]"
              >
                <div className="w-8 h-8 rounded-xl bg-[#22c55e]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-[#22c55e]" />
                </div>
                <span className="text-[#374151] leading-relaxed">{req}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Note */}
        <div className="mt-12 text-center">
          <p className="text-[#374151] mb-4">
            Остались вопросы?
          </p>
          <a
            href="https://t.me/streetbox1v1"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline inline-flex"
          >
            Написать в Telegram
          </a>
        </div>
      </div>
    </section>
  );
}
