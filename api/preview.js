export const config = { runtime: 'edge' };

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const player = searchParams.get('player');

  if (!player) return Response.redirect(new URL('/', req.url));

  // Ссылка на твою страницу стат (без лишних папок)
  const targetUrl = `https://box1v1.vercel.app/#stats?player=${encodeURIComponent(player)}`;

  // Сервис-скриншотер (делает фото твоей верстки)
  const screenshotUrl = `https://s0.wp.com/mshots/v1/${encodeURIComponent(targetUrl)}?w=1200&h=630`;

  return new Response(
    `<html>
      <head>
        <meta charset="UTF-8">
        <meta property="og:title" content="Карточка игрока: ${player}">
        <meta property="og:description" content="STREET FOOTBALL 1v1 | Статистика и рейтинги">
        <meta property="og:image" content="${screenshotUrl}">
        <meta property="og:type" content="website">
        <meta name="twitter:card" content="summary_large_image">
        <meta http-equiv="refresh" content="0; url=/#stats?player=${encodeURIComponent(player)}">
      </head>
      <body>Загрузка карточки...</body>
    </html>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );
}
