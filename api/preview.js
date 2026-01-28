export const config = { runtime: 'edge' };

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const player = searchParams.get('player');

  // ID твоей таблицы BOX1v1
  const sheetId = "1BwmAAIYqx1YHxiqt1s8w46Gout5So96nU7XwvmLR8wY";
  // ЗАМЕНЕНО: Теперь используется "Лист1", как в твоей таблице
  const sheetUrl = `https://opensheet.elk.sh/${sheetId}/Лист1`;

  try {
    const response = await fetch(sheetUrl);
    const data = await response.json();
    
    // Поиск по колонке "A (Имя)" 
    const playerData = data.find(p => 
      p["A (Имя)"] && p["A (Имя)"].toString().toLowerCase() === player?.toLowerCase()
    );

    if (playerData) {
      const name = playerData["A (Имя)"];
      const ovr = playerData["B (OVR)"] || "??";
      const photo = playerData["H (Фото URL)"] || "";
      const role = playerData["C (Роль)"] || "Игрок";

      return new Response(
        `<html>
          <head>
            <meta charset="UTF-8">
            <meta property="og:title" content="${name} [OVR ${ovr}]">
            <meta property="og:description" content="Роль: ${role} | STREET FOOTBALL 1v1">
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
    console.error("Ошибка получения данных:", e);
  }

  return Response.redirect(new URL('/box1v1/', req.url));
}
