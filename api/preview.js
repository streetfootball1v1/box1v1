export const config = { runtime: 'edge' };

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const player = searchParams.get('player');

  const sheetId = "1B_4b-tO8hC0_I7W63k3D8I2V9-fU8Z3IuN6qI7l_g";
  // Проверь название листа! Если в Google Таблице внизу написано "Лист1", замени Sheet1 на Лист1
  const sheetUrl = `https://opensheet.elk.sh/${sheetId}/Лист1`;

  try {
    const response = await fetch(sheetUrl);
    const data = await response.json();
    
    // Ищем игрока по колонке "Имя"
    const playerData = data.find(p => p["Имя"] && p["Имя"].toLowerCase() === player?.toLowerCase());

    if (playerData) {
      const name = playerData["Имя"];
      const ovr = playerData["OVR"] || "??";
      const role = playerData["Роль"] || "Игрок";
      const photo = playerData["Фото URL"] || "";

      return new Response(
        `<html>
          <head>
            <meta charset="UTF-8">
            <meta property="og:title" content="${name} [OVR ${ovr}]">
            <meta property="og:description" content="Роль: ${role} | Посмотри карточку игрока в системе STREET FOOTBALL 1v1">
            <meta property="og:image" content="${photo}">
            <meta property="og:type" content="website">
            <meta name="twitter:card" content="summary_large_image">
            <meta http-equiv="refresh" content="0; url=/box1v1/#roster?player=${encodeURIComponent(player)}">
          </head>
          <body>Загрузка карточки ${name}...</body>
        </html>`,
        { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      );
    }
  } catch (e) {
    console.error(e);
  }

  // Если игрок не найден — просто на главную сайта
  return Response.redirect(new URL('/box1v1/#roster', req.url));
}
