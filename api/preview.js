export const config = { runtime: 'edge' };

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const player = searchParams.get('player');

  // Данные твоей таблицы из файла ключ.txt
  const sheetId = "1B_4b-tO8hC0_I7W63k3D8I2V9-fU8Z3IuN6qI7l_g";
  const sheetUrl = `https://opensheet.elk.sh/${sheetId}/Sheet1`;

  try {
    const response = await fetch(sheetUrl);
    const data = await response.json();
    
    // Ищем игрока в колонке "Имя" (столбец A)
    const playerData = data.find(p => p["Имя"] && p["Имя"].toLowerCase() === player?.toLowerCase());

    if (playerData) {
      // Формируем красивое описание из твоих колонок B и C
      const description = `Рейтинг (OVR): ${playerData["OVR"] || '??'} | Роль: ${playerData["Роль"] || 'Игрок'}`;
      const photo = playerData["Фото URL"] || "";

      return new Response(
        `<html>
          <head>
            <meta charset="UTF-8">
            <title>Карточка ${playerData["Имя"]}</title>
            <meta property="og:title" content="Street Football 1v1: ${playerData["Имя"]}">
            <meta property="og:description" content="${description}">
            <meta property="og:image" content="${photo}">
            <meta property="og:type" content="website">
            <meta name="twitter:card" content="summary_large_image">
            <meta name="twitter:image" content="${photo}">
            
            <meta http-equiv="refresh" content="0; url=/box1v1/#roster?player=${encodeURIComponent(player)}">
          </head>
          <body>Переход к карточке игрока ${playerData["Имя"]}...</body>
        </html>`,
        { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      );
    }
  } catch (e) {
    console.error("Error fetching sheet:", e);
  }

  // Если игрок не найден или ошибка — отправляем на главную страницу ростера
  return Response.redirect(new URL('/box1v1/#roster', req.url));
}
