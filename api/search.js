export default async function handler(req, res) {
    // CORS 헤더 설정
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', 'https://jybbear.github.io/mabinogi_alban_calaculator');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // preflight 요청(OPTIONS) 처리
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    // 1. 클라이언트(index.html)에서 보낸 아이템 이름을 받음
    const { itemName } = req.query;
    
    // 2. 넥슨 API 키는 Vercel 환경 변수에서 꺼내옴 (코드에 직접 노출 X)
    const apiKey = process.env.NEXON_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: { name: 'KEY_ERROR', message: '서버에 API 키가 설정되지 않았습니다.' } });
    }

    const targetUrl = `https://open.api.nexon.com/mabinogi/v1/auction/list?item_name=${encodeURIComponent(itemName)}`;

    try {
        // 3. 백엔드에서 넥슨 서버로 요청
        const response = await fetch(targetUrl, {
            method: 'GET',
            headers: { 'x-nxopen-api-key': apiKey }
        });

        const data = await response.json();
        
        // 4. 결과만 프론트엔드로 전달
        res.status(response.status).json(data);
    } catch (error) {
        res.status(500).json({ error: { name: 'SERVER_ERROR', message: '백엔드 통신 오류가 발생했습니다.' } });
    }
}
