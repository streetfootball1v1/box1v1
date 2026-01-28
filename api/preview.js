export const config = { runtime: 'edge' };

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const player = searchParams.get('player');
  const cacheBuster = Date.now(); // Генерирует уникальное число

  if (!player) return Response.redirect(new URL('/', req.url));

  const targetUrl = `https://box1v1.vercel.app/#stats?player=${encodeURIComponent(player)}`;
  
  // Используем сервис pikwy — он надежнее для JS-сайтов
  const screenshotUrl = `https://api.pikwy.com/screenshot.php?url=${encodeURIComponent(targetUrl)}&w=1200&h=630&display_full_page=0&v=${cacheBuster}`;

  return new Response(
    `<html>
      <head>
        <meta charset="UTF-8">
        <title>Player: ${player}</title>
        
        <meta property="og:title" content="Карточка игрока: ${player}">
        <meta property="og:description" content="STREET FOOTBALL 1v1 | Рейтинги и статистика">
        <meta property="og:image" content="${screenshotUrl}">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">
        <meta property="og:type" content="website">
        
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:image" content="${screenshotUrl}">
        
        <meta http-equiv="refresh" content="0; url=/#stats?player=${encodeURIComponent(player)}">
      </head>
      <body></body>
    </html>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );
}
