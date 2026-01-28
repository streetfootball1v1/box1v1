export const config = { runtime: 'edge' };

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const player = searchParams.get('player');

  // URL твоей Google таблицы (JSON формат)
  const sheetId = "1B_4b-tO8hC0_I7W63k3D8I2V9-fU8Z3IuN6qI7l_g"; // ЗАМЕНИ НА СВОЙ ID
  const sheetUrl = `https://opensheet.elk.sh/${sheetId}/Sheet1`;

  try {
    const response = await fetch(sheetUrl);
    const data = await response.json();
    
    // Ищем игрока в данных из таблицы
    const playerData = data.find(p => p.Name.toLowerCase() === player?.toLowerCase());

    if (playerData) {
      // Генерируем HTML только с метатегами для бота
      return new Response(
        `<html>
          <head>
            <meta property="og:title" content="Карточка игрока: ${playerData.Name}">
            <meta property="og:description" content="Рейтинг: ${playerData.Rating} | Позиция: ${playerData.Position}">
            <meta property="og:image" content="${playerData.PhotoURL}">
            <meta property="og:type" content="website">
            <meta http-equiv="refresh" content="0; url=/box1v1/#roster?player=${player}">
          </head>
        </html>`,
        { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      );
    }
  } catch (e) {
    console.error(e);
  }

  // Если игрока нет, просто редиректим на главную
  return Response.redirect(new URL('/box1v1/', req.url));
}
