export const config = { runtime: 'edge' };

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const player = searchParams.get('player');

  if (!player) return Response.redirect(new URL('/box1v1/', req.url));

  // 1. Ссылка на твой сайт, где открывается конкретная карта
  const targetUrl = `https://box1v1.vercel.app/box1v1/#stats?player=${encodeURIComponent(player)}`;

  // 2. Ссылка на сервис-скриншотер (он сделает фото твоего сайта на лету)
  // Мы задаем размеры 1200x630 — это стандарт для большой карточки в ТГ
  const screenshotUrl = `https://s0.wp.com/mshots/v1/${encodeURIComponent(targetUrl)}?w=1200&h=630`;

  return new Response(
    `<html>
      <head>
        <meta charset="UTF-8">
        <title>Карточка ${player}</title>
        
        <meta property="og:title" content="Игрок: ${player}">
        <meta property="og:description" content="Посмотри полную статистику игрока в STREET FOOTBALL 1v1">
        
        <meta property="og:image" content="${screenshotUrl}">
        
        <meta property="og:type" content="website">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:image" content="${screenshotUrl}">

        <meta http-equiv="refresh" content="0; url=/box1v1/#stats?player=${encodeURIComponent(player)}">
      </head>
      <body>Загрузка карточки ${player}...</body>
    </html>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );
}
