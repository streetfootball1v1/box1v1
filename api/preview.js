export const config = { runtime: 'edge' };

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const player = searchParams.get('player');

  const sheetId = "1B_4b-tO8hC0_I7W63k3D8I2V9-fU8Z3IuN6qI7l_g";
  const sheetUrl = `https://opensheet.elk.sh/${sheetId}/Sheet1`;

  try {
    const response = await fetch(sheetUrl);
    const data = await response.json();
    
    // Ищем игрока по колонке "А (Имя)" из твоего скриншота
    const playerData = data.find(p => 
      p["А (Имя)"] && p["А (Имя)"].toString().toLowerCase() === player?.toLowerCase()
    );

    if (playerData) {
      const name = playerData["А (Имя)"];
      const ovr = playerData["В (OVR)"] || "??";
      const photo = playerData["Н (Фото URL)"] || "";

      return new Response(
        `<html>
          <head>
            <meta charset="UTF-8">
            <meta property="og:title" content="${name} | Рейтинг: ${ovr}">
            <meta property="og:description" content="Посмотри карточку игрока в STREET FOOTBALL 1v1">
            <meta property="og:image" content="${photo}">
            <meta property="og:type" content="website">
            <meta name="twitter:card" content="summary_large_image">
            <meta http-equiv="refresh" content="0; url=/#roster?player=${encodeURIComponent(player)}">
          </head>
          <body>Загружаем карточку ${name}...</body>
        </html>`,
        { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      );
    }
  } catch (e) {
    console.error(e);
  }

  return Response.redirect(new URL('/', req.url));
}
