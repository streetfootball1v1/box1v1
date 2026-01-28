export const config = { runtime: 'edge' };

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const player = searchParams.get('player');

  // Твой АКТУАЛЬНЫЙ ID таблицы
  const sheetId = "1BwmAAIYqx1YHxiqt1s8w46Gout5So96nU7XwvmLR8wY";
  // Используем "Лист1", так как в таблице лист называется именно так
  const sheetUrl = `https://opensheet.elk.sh/${sheetId}/Лист1`;

  try {
    const response = await fetch(sheetUrl);
    const data = await response.json();
    
    // Ищем игрока по точному названию колонки "A (Имя)"
    const playerData = data.find(p => 
      p["A (Имя)"] && p["A (Имя)"].toString().toLowerCase() === player?.toLowerCase()
    );

    if (playerData) {
      const name = playerData["A (Имя)"];
      const ovr = playerData["B (OVR)"] || "??";
      const photo = playerData["H (Фото URL)"] || "";

      return new Response(
        `<html>
          <head>
            <meta charset="UTF-8">
            <meta property="og:title" content="${name} | OVR: ${ovr}">
            <meta property="og:description" content="STREET FOOTBALL 1v1">
            <meta property="og:image" content="${photo}">
            <meta property="og:type" content="website">
            <meta name="twitter:card" content="summary_large_image">
            <meta http-equiv="refresh" content="0; url=/#roster?player=${encodeURIComponent(player)}">
          </head>
          <body>Загрузка карточки ${name}...</body>
        </html>`,
        { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      );
    }
  } catch (e) {
    return new Response("Ошибка: " + e.message, { status: 500 });
  }

  return Response.redirect(new URL('/', req.url));
}
