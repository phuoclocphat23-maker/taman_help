import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '5mb' }));

// Khởi tạo Gemini SDK an toàn phía server
const rawApiKey = process.env.GEMINI_API_KEY;
const isValidKey = Boolean(rawApiKey && rawApiKey !== 'MY_GEMINI_API_KEY' && rawApiKey.trim().length > 15);
const ai = isValidKey
  ? new GoogleGenAI({
      apiKey: rawApiKey!,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Helper timeout cho Gemini API
function withTimeout<T>(promise: Promise<T>, timeoutMs = 8000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Quá thời gian chờ phản hồi (${timeoutMs}ms)`)), timeoutMs)
    ),
  ]);
}

// Hàm kiểm tra từ khoá nguy cơ khủng hoảng (Crisis Detection)
function checkEmergencyKeywords(text: string): boolean {
  const normalized = text.toLowerCase();
  const crisisPatterns = [
    'tự tử',
    'tự sát',
    'muốn chết',
    'chết đi',
    'không muốn sống',
    'tự làm đau',
    'cắt cổ tay',
    'rạch tay',
    'nhảy lầu',
    'uống thuốc ngủ',
    'kết thúc cuộc đời',
    'tống tiền ảnh nóng',
    'bị dọa tung ảnh',
    'bị xâm hại',
    'bị bạo hành',
    'muốn biến mất mãi mãi',
  ];
  return crisisPatterns.some((pattern) => normalized.includes(pattern));
}

// Fallback NLP phân tích cảm xúc khi không có API key hoặc mạng bận
function localFallbackEmotionAnalysis(title: string, content: string) {
  const combined = `${title} ${content}`.toLowerCase();
  const hasSafetyRisk = checkEmergencyKeywords(combined);

  // Từ điển cảm xúc cơ bản tiếng Việt
  const joyWords = ['vui', 'hạnh phúc', 'cười', 'tuyệt vời', 'thích', 'yêu', 'may mắn', 'tự hào', 'hài lòng', 'phấn khởi', 'điểm cao', 'khen', 'được yêu thương'];
  const sadnessWords = ['buồn', 'khóc', 'cô đơn', 'thất vọng', 'tủi thân', 'chán', 'nhớ', 'mất mát', 'đau lòng', 'bỏ rơi', 'bất công', 'bất lực'];
  const angerWords = ['tức', 'giận', 'bực', 'phẫn nộ', 'ghét', 'bất bình', 'cãi nhau', 'chửi', 'bất hòa', 'ồn ào', 'bắt nạt', 'cay cú'];
  const anxietyWords = ['lo', 'sợ', 'áp lực', 'căng thẳng', 'stress', 'bất an', 'thi cử', 'bài tập', 'lo lắng', 'nghĩ nhiều', 'ngột ngạt', 'hoang mang'];
  const optimismWords = ['cố gắng', 'hy vọng', 'tin tưởng', 'bình yên', 'nhẹ nhõm', 'biết ơn', 'ngày mai', 'tiến bộ', 'học hỏi', 'thư giãn', 'yên tĩnh'];

  const countMatches = (list: string[]) =>
    list.reduce((acc, word) => acc + (combined.includes(word) ? 1 : 0), 0);

  const joyHits = countMatches(joyWords);
  const sadHits = countMatches(sadnessWords);
  const angerHits = countMatches(angerWords);
  const anxietyHits = countMatches(anxietyWords);
  const optimismHits = countMatches(optimismWords);

  let joy = Math.min(100, Math.max(10, 25 + joyHits * 25 - sadHits * 10));
  let sadness = Math.min(100, Math.max(5, 15 + sadHits * 30 - joyHits * 10));
  let anger = Math.min(100, Math.max(5, 10 + angerHits * 30));
  let anxiety = Math.min(100, Math.max(10, 20 + anxietyHits * 25));
  let optimism = Math.min(100, Math.max(15, 30 + optimismHits * 25 + joyHits * 10 - sadHits * 10));

  // Chuẩn hóa tỷ lệ tương đối
  const maxVal = Math.max(joy, sadness, anger, anxiety, optimism);
  let dominantEmotion = 'Bình yên & Trung tính';
  if (hasSafetyRisk || sadness >= 70) dominantEmotion = 'Buồn bã sâu sắc';
  else if (anxiety === maxVal) dominantEmotion = 'Lo âu & Áp lực';
  else if (anger === maxVal) dominantEmotion = 'Tức giận & Bức xúc';
  else if (sadness === maxVal) dominantEmotion = 'Buồn bã & Trầm lắng';
  else if (joy === maxVal) dominantEmotion = 'Vui vẻ & Hào hứng';
  else if (optimism === maxVal) dominantEmotion = 'Lạc quan & Bình yên';

  const sentimentScore = Math.round((joy + optimism - sadness - anger - anxiety * 0.5) / 2);

  // Nhận diện tác nhân
  const triggers: string[] = [];
  if (combined.includes('thi') || combined.includes('học') || combined.includes('điểm') || combined.includes('bài tập')) {
    triggers.push('Áp lực học tập & thi cử');
  }
  if (combined.includes('bạn') || combined.includes('tẩy chay') || combined.includes('nói xấu') || combined.includes('nhóm')) {
    triggers.push('Mối quan hệ bạn bè / Mạng xã hội');
  }
  if (combined.includes('bố') || combined.includes('mẹ') || combined.includes('gia đình') || combined.includes('ba')) {
    triggers.push('Kỳ vọng hoặc bất đồng gia đình');
  }
  if (combined.includes('mạng') || combined.includes('facebook') || combined.includes('tiktok') || combined.includes('bình luận')) {
    triggers.push('Tương tác trên mạng xã hội');
  }
  if (triggers.length === 0) {
    triggers.push('Nhịp sống & suy nghĩ nội tâm');
  }

  return {
    emotions: { joy, sadness, anger, anxiety, optimism },
    dominantEmotion,
    sentimentScore,
    triggers,
    empathyMessage: hasSafetyRisk
      ? 'An An nhận thấy bạn đang trải qua những cảm xúc rất nặng nề và đau lòng. Bạn không đơn độc, luôn có những người sẵn sàng giúp đỡ bạn. Đừng giữ nỗi đau một mình nhé!'
      : anxiety > 50
      ? 'Có vẻ bạn đang phải gánh một khối áp lực khá lớn hôm nay. Hãy cho phép bản thân nghỉ ngơi 10 phút, bạn đã rất nỗ lực rồi!'
      : joy > 50
      ? 'Thật tuyệt vời khi được chứng kiến những khoảnh khắc tích cực của bạn! Hãy lưu giữ niềm vui này vào một góc ấm áp trong tim nhé.'
      : 'Cảm ơn bạn đã dũng cảm viết ra cảm xúc của mình. Mọi cảm xúc, dù vui hay buồn, đều là một phần tự nhiên và đáng trân trọng của bạn.',
    selfCareTips: [
      'Thử bài tập hít thở 4-7-8 để nhịp tim và hệ thần kinh dịu lại.',
      'Uống một cốc nước ấm hoặc nghe một bản nhạc không lời nhẹ nhàng.',
      'Nếu mệt quá, hãy tạm gác màn hình điện thoại và cho đôi mắt nghỉ ngơi.',
    ],
    safetyRisk: hasSafetyRisk,
  };
}

// 1. API: Phân tích cảm xúc nhật ký bằng NLP (Gemini Flash hoặc local NLP)
app.post('/api/analyze-emotion', async (req, res) => {
  try {
    const { title = '', content = '' } = req.body;
    if (!content.trim()) {
      return res.status(400).json({ error: 'Nội dung nhật ký không được để trống.' });
    }

    const hasSafetyRisk = checkEmergencyKeywords(`${title} ${content}`);

    if (ai) {
      try {
        const prompt = `Bạn là chuyên gia NLP tâm lý học đường cho thanh thiếu niên (học sinh, Gen Z).
Hãy đọc bài nhật ký sau đây và phân tích cảm xúc của bạn trẻ:
Tiêu đề: "${title}"
Nội dung: "${content}"

Yêu cầu trả về DUY NHẤT một chuỗi JSON hợp lệ không kèm markdown backticks theo đúng cấu trúc sau:
{
  "emotions": {
    "joy": 0-100 (điểm dải cảm xúc Vui vẻ),
    "sadness": 0-100 (điểm dải cảm xúc Buồn bã),
    "anger": 0-100 (điểm dải cảm xúc Tức giận),
    "anxiety": 0-100 (điểm dải cảm xúc Lo âu / Stress),
    "optimism": 0-100 (điểm dải cảm xúc Lạc quan / Bình yên)
  },
  "dominantEmotion": "Chuỗi ngắn mô tả cảm xúc chủ đạo (ví dụ: Vui vẻ nhẹ nhõm, Lo âu học tập, Buồn bã cô đơn, v.v.)",
  "sentimentScore": điểm từ -100 (tiêu cực) đến +100 (tích cực),
  "triggers": ["1-3 tác nhân chính gây nên cảm xúc, ví dụ: Thi cử áp lực, Bất hòa với bạn bè, v.v."],
  "empathyMessage": "Lời chia sẻ, thấu hiểu ấm áp 2-3 câu từ bạn đồng hành An An (giọng văn chân thành, không phán xét, gần gũi Gen Z)",
  "selfCareTips": ["Gợi ý 1 nhỏ và cụ thể để chăm sóc tinh thần", "Gợi ý 2"],
  "safetyRisk": ${hasSafetyRisk ? 'true' : 'false'}
}`;

        const response = await withTimeout(
          ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              temperature: 0.4,
              thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            },
          }),
          8000
        );

        const rawText = response.text?.trim() || '';
        const cleanedText = rawText.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
        const parsed = JSON.parse(cleanedText);

        // Đảm bảo cờ an toàn nếu có từ khóa nguy hiểm
        if (hasSafetyRisk) {
          parsed.safetyRisk = true;
        }

        return res.json(parsed);
      } catch (geminiError) {
        console.warn('Gemini NLP call failed, using high-quality local NLP fallback:', geminiError);
        const fallback = localFallbackEmotionAnalysis(title, content);
        return res.json(fallback);
      }
    } else {
      // Không có API key, dùng local NLP engine
      const fallback = localFallbackEmotionAnalysis(title, content);
      return res.json(fallback);
    }
  } catch (error) {
    console.error('Lỗi khi phân tích cảm xúc:', error);
    res.status(500).json({ error: 'Không thể phân tích cảm xúc lúc này.' });
  }
});

// 2. API: Chatbot đồng hành tâm lý 24/7 ("An An") - Đối chiếu tài liệu chính thống
app.post('/api/chat', async (req, res) => {
  try {
    const { messages = [] } = req.body;
    if (!messages || messages.length === 0) {
      return res.status(400).json({ error: 'Danh sách tin nhắn trống.' });
    }

    const lastUserMessage = [...messages].reverse().find((m: any) => m.role === 'user')?.content || '';
    const normalizedInput = lastUserMessage.toLowerCase();
    const isCrisis = checkEmergencyKeywords(lastUserMessage);

    const crisisResponse = `Mình nghe thấy bạn và cảm nhận được bạn đang phải trải qua một nỗi đau hay áp lực rất lớn lúc này. An An luôn ở đây bên cạnh bạn, nhưng sự an toàn và tính mạng của bạn là điều quan trọng nhất trên đời. 

Bạn đừng cố gánh chịu một mình nhé. Hãy kết nối ngay với những người có thể bảo vệ bạn:
📞 **Tổng đài Quốc gia Bảo vệ Trẻ em**: **111** (Gọi miễn phí 24/7)
📞 **Đường dây nóng hỗ trợ tâm lý Ngày Mai**: **096 306 1414**
📞 **Viện Sức khỏe Tâm thần - BV Bạch Mai**: **024 3869 3731**

Có một thầy cô, người thân hoặc người lớn nào mà bạn cảm thấy an tâm nhất để chia sẻ ngay bây giờ không? Bạn luôn xứng đáng được yêu thương, được lắng nghe và được an toàn!`;

    if (isCrisis) {
      return res.json({
        reply: crisisResponse,
        safetyTriggered: true,
        officialSources: ['Tổng đài Quốc gia Bảo vệ Trẻ em 111', 'Đường dây nóng Ngày Mai', 'Bộ Y tế Việt Nam'],
        suggestedActions: ['Gọi ngay Tổng đài 111 (Miễn phí)', 'Tập bài thở 4-7-8 để dịu lại', 'Nói chuyện với người lớn tin cậy'],
      });
    }

    // Cơ sở tri thức chính thống địa phương (Local Grounded Knowledge Base)
    const getLocalGroundedResponse = (query: string) => {
      // 1. Áp lực học tập / Thi cử
      if (query.includes('học') || query.includes('thi') || query.includes('điểm') || query.includes('bài tập') || query.includes('áp lực') || query.includes('rớt') || query.includes('trượt')) {
        return {
          reply: `An An hiểu cảm giác nghẹt thở khi nhìn bài vở và kỳ thi dồn dập 🥺. Cảm giác này hoàn toàn bình thường và rất nhiều bạn học sinh cũng đang cùng trải qua.

Theo **Khuyến nghị Sức khỏe Tâm thần Học đường của UNICEF & Viện Sức khỏe Tâm thần**, đây là các bước giúp bạn gỡ rối ngay hôm nay:

1. **Phương pháp Pomodoro & Chia nhỏ mục tiêu:** Đừng nhìn cả một tệp sách dày. Hãy chia thành từng phiên học 25 phút, nghỉ 5 phút vận động nhẹ. Não bộ con người chỉ tập trung sâu tốt nhất trong 25-30 phút đầu.
2. **Quy tắc Pareto (80/20):** 80% điểm số nằm ở 20% kiến thức nền tảng cốt lõi. Hãy ưu tiên nắm chắc công thức và lý thuyết cơ bản trước khi lao vào các bài nâng cao.
3. **Tái cấu trúc nhận thức (Cognitive Reframing):** Điểm số là một cột mốc phản ánh sự chuẩn bị tại một thời điểm, chứ **không định nghĩa giá trị, nhân cách hay tương lai** của bạn.
4. **Giấc ngủ phục hồi:** Hãy ngủ ít nhất 7 tiếng. Giấc ngủ chính là lúc não chuyển kiến thức từ trí nhớ ngắn hạn sang dài hạn.

Bạn có muốn thử cùng An An làm một bài tập hít thở 2 phút để đầu óc nhẹ lại trước khi tiếp tục không nè?`,
          officialSources: ['Khuyến nghị UNICEF Việt Nam', 'Viện Sức khỏe Tâm thần - BV Bạch Mai'],
          suggestedActions: ['🌿 Tập thở 4-7-8 giảm stress', '📝 Lập kế hoạch học Pomodoro', '💬 Tâm sự thêm về môn học khó'],
        };
      }

      // 2. Bạo lực mạng / Bị nói xấu / Chế meme / Tẩy chay
      if (query.includes('bắt nạt') || query.includes('meme') || query.includes('nói xấu') || query.includes('chế ảnh') || query.includes('tẩy chay') || query.includes('bạo lực mạng') || query.includes('group') || query.includes('chửi')) {
        return {
          reply: `An An rất tiếc và đồng cảm sâu sắc khi bạn phải trải qua chuyện này. Bị bêu rếu hay chế giễu trên mạng gây tổn thương rất lớn, và bạn hoàn toàn KHÔNG CÓ LỖI trong việc này 🌸.

Theo **Cẩm nang Phòng chống Bạo lực Mạng của Cục An toàn Thông tin (Bộ TT&TT)** và **Luật Trẻ em 2016 (Điều 29)**, bạn hãy áp dụng ngay **Quy tắc 4B**:

1. **B1: Bằng chứng (Evidence):** Chụp màn hình lại toàn bộ tin nhắn, bài đăng, đường link và tài khoản kẻ quấy rối có kèm ngày giờ. Đây là bằng chứng pháp lý quan trọng nhất.
2. **B2: Block (Chặn):** Chặn tài khoản kẻ bắt nạt. Đừng đôi co hay trả lời, vì kẻ xấu chỉ muốn nhìn thấy bạn kích động để tiếp tục bêu rếu.
3. **B3: Báo cáo (Report):** Dùng tính năng Báo cáo quấy rối của nền tảng (Facebook, TikTok, Zalo) để gỡ bỏ bài viết vi phạm tiêu chuẩn cộng đồng.
4. **B4: Bạn bè & Người lớn:** Đừng giữ trong lòng một mình. Hãy chia sẻ với bố mẹ, thầy cô chủ nhiệm hoặc gọi ngay **Tổng đài 111** để được hỗ trợ can thiệp kịp thời.

Bạn có cần An An hướng dẫn chi tiết cách báo cáo bài đăng hoặc cách mở lời với thầy cô không?`,
          officialSources: ['Cục An toàn thông tin (Bộ TT&TT)', 'Luật Trẻ em 2016 (Điều 29)', 'Tổng đài Quốc gia 111'],
          suggestedActions: ['🛡️ Xem quy tắc 4B chi tiết', '📞 Cách liên hệ Tổng đài 111', '💬 Mẫu câu nói chuyện với thầy cô'],
        };
      }

      // 3. Gia đình, Bố mẹ áp đặt, So sánh "con nhà người ta"
      if (query.includes('bố') || query.includes('mẹ') || query.includes('ba') || query.includes('gia đình') || query.includes('so sánh') || query.includes('la mắng') || query.includes('áp đặt') || query.includes('kỳ vọng')) {
        return {
          reply: `An An lắng nghe và thấu hiểu nỗi tủi thân của bạn. Cảm giác bị người thân nhất so sánh với "con nhà người ta" hay không được công nhận nỗ lực thực sự rất nhức nhối 🥺.

Theo các chuyên gia **Tâm lý học Gia đình & Kỹ thuật Giao tiếp Bất bạo động (NVC)**, khoảng cách thế hệ khiến cha mẹ thường thể hiện sự lo lắng bằng sự so sánh hoặc la mắng. Để bảo vệ cảm xúc của mình và cải thiện tình hình, bạn có thể thử:

1. **Tách rời lời so sánh khỏi giá trị bản thân:** Nhắc nhở chính mình rằng: "Bố mẹ đang lo lắng theo cách vụng về, điều đó không có nghĩa là mình kém cỏi hay vô dụng".
2. **Kỹ thuật Thông điệp "Tôi" (I-Message):** Thay vì nói: *"Bố mẹ lúc nào cũng ghét con và so sánh con"*, hãy chọn lúc cả nhà đang bình tĩnh và bày tỏ: 
   *"Khi bố mẹ so sánh con với bạn khác, con thấy rất áp lực và buồn, vì con cũng đang nỗ lực hết sức. Con mong bố mẹ có thể ghi nhận những tiến bộ nhỏ của con."*
3. **Viết thư hoặc nhắn tin:** Nếu việc đối thoại trực tiếp khiến bạn run hoặc dễ khóc, một mẩu tin nhắn chân thành gửi cho bố mẹ sẽ giúp họ có thời gian ngẫm nghĩ mà không bị phản ứng tự vệ.

Bạn có muốn An An giúp bạn soạn một tin nhắn ngắn để gửi cho bố mẹ không?`,
          officialSources: ['Hội Tâm lý học Việt Nam', 'Phương pháp Giao tiếp NVC - UNICEF'],
          suggestedActions: ['✉️ Gợi ý mẫu tin nhắn gửi bố mẹ', '🌿 Bài tập giải tỏa cơn giận', '💬 Kể thêm về chuyện vừa xảy ra'],
        };
      }

      // 4. Lừa đảo, Mất tài khoản, Tống tiền hình ảnh (Sextortion / Scams)
      if (query.includes('lừa') || query.includes('mất nick') || query.includes('hack') || query.includes('tống tiền') || query.includes('ảnh nóng') || query.includes('ảnh nhạy cảm') || query.includes('dọa tung') || query.includes('nạp thẻ')) {
        return {
          reply: `Bạn hãy hít một hơi thật sâu và bình tĩnh nhé. An An ở đây cùng bạn, và điều quan trọng nhất bạn cần nhớ là: **BẠN LÀ NẠN NHÂN, BẠN KHÔNG CÓ TỘI** 🛡️. Kẻ tống tiền hoặc lừa đảo mới là người vi phạm pháp luật hình sự.

Theo **Khuyến nghị từ Cục An toàn thông tin, C02 - Bộ Công an & NCMEC (Tổ chức Quốc tế Bảo vệ Trẻ em)**:

1. **TUYỆT ĐỐI KHÔNG làm theo yêu cầu:** Không chuyển tiền, không gửi thêm bất kỳ hình ảnh nào. Kẻ tống tiền sẽ KHÔNG BAO GIỜ dừng lại sau khi bạn thỏa hiệp.
2. **Lưu giữ toàn bộ bằng chứng:** Chụp lại tin nhắn đe dọa, số tài khoản ngân hàng, link trang cá nhân kẻ tống tiền.
3. **Sử dụng công cụ Take It Down (takeitdown.ncmec.org):** Đây là công cụ chính thống của NCMEC và Facebook/Instagram/TikTok hỗ trợ tạo mã băm ẩn danh để chặn hoàn toàn việc phát tán ảnh nhạy cảm của người dưới 18 tuổi.
4. **Tìm sự bảo vệ ngay lập tức:** Hãy gọi ngay **Tổng đài 111** hoặc nói chuyện ngay với bố mẹ/công an. Các cơ quan chức năng có nghiệp vụ xử lý và bảo mật danh tính tuyệt đối cho bạn.

Đừng ôm nỗi sợ này một mình nhé, chúng mình luôn bên bạn!`,
          officialSources: ['Cục Cảnh sát Hình sự (C02)', 'Cục An toàn Thông tin', 'Take It Down (NCMEC/UNICEF)', 'Tổng đài 111'],
          suggestedActions: ['📞 Gọi Tổng đài 111 ngay', '🔒 Hướng dẫn công cụ Take It Down', '🛡️ Các bước bảo mật lại tài khoản'],
        };
      }

      // 5. Ngột ngạt, Buồn bã vô cớ, Mất ngủ, Stress
      if (query.includes('buồn') || query.includes('ngột ngạt') || query.includes('khóc') || query.includes('mệt mỏi') || query.includes('mất ngủ') || query.includes('cô đơn') || query.includes('chán') || query.includes('trống rỗng')) {
        return {
          reply: `An An gửi đến bạn một cái ôm thật ấm áp 🌸. Những ngày thấy lòng trống rỗng, buồn bã hay muốn khóc mà chẳng biết vì sao thực ra là một tín hiệu cho thấy cơ thể và tâm trí bạn đang bị quá tải và cần được nghỉ ngơi.

Theo **Sổ tay Sơ cứu Tâm lý của WHO và Viện Sức khỏe Tâm thần**:

1. **Cho phép bản thân được buồn:** Đừng cố ép mình phải vui vẻ hay tích cực độc hại. Cảm xúc như những đợt sóng biển, bạn càng cố chống cự thì càng mệt, hãy cứ để nó cuộn trào rồi sẽ tự lắng xuống.
2. **Kỹ thuật neo đậu 5-4-3-2-1:** Tìm 5 đồ vật màu xanh, 4 bề mặt có thể chạm, 3 âm thanh nghe thấy, 2 mùi hương và 1 lời khen dành cho chính mình. Kỹ thuật này giúp xoa dịu hệ thần kinh giao cảm ngay lập tức.
3. **Uống một cốc nước ấm & tắm nước mát:** Thay đổi nhiệt độ cơ thể giúp kích hoạt hormone endorphin làm dịu căng thẳng.
4. **Tạm tắt mạng xã hội:** Mạng xã hội tràn ngập những hình ảnh hào nhoáng dễ khiến ta so sánh trong vô thức và cảm thấy kiệt quệ.

Bạn có muốn bật thử một chút âm thanh tiếng mưa rơi trên thanh công cụ và thở cùng An An vài nhịp không?`,
          officialSources: ['Tổ chức Y tế Thế giới (WHO)', 'Viện Sức khỏe Tâm thần - BV Bạch Mai'],
          suggestedActions: ['🌿 Bắt đầu bài tập thở 4-7-8', '🌧️ Bật âm thanh mưa thư giãn', '📝 Viết cảm xúc vào Sổ tay NLP'],
        };
      }

      // 6. Tình bạn, Bạn bè xa cách, Tình cảm tuổi học trò
      if (query.includes('bạn thân') || query.includes('crush') || query.includes('thích') || query.includes('chia tay') || query.includes('tình bạn') || query.includes('cãi nhau') || query.includes('hiểu lầm')) {
        return {
          reply: `Những biến động trong tình bạn và những rung động tuổi học trò là những trải nghiệm rất đẹp nhưng cũng dễ làm trái tim chúng mình đau nhói 🥺.

Theo **Cẩm nang Kỹ năng Xã hội & Tâm lý Lứa tuổi Vị thành niên (UNICEF)**:

1. **Chấp nhận sự đổi thay:** Khi lớn lên, sở thích và thế giới quan của mỗi người dần khác nhau. Đôi khi bạn bè xa nhau không phải vì ai sai, mà vì con đường của hai bạn đang rẽ sang những ngã rẽ mới.
2. **Hóa giải hiểu lầm bằng sự chân thành:** Hãy chọn cách nói chuyện trực tiếp hoặc gọi điện thay vì nhắn tin qua mạng (vì tin nhắn dễ bị hiểu sai ngữ điệu). Hãy lắng nghe góc nhìn của bạn ấy trước khi giải thích.
3. **Xây dựng ranh giới lành mạnh (Boundaries):** Một tình bạn hay tình cảm lành mạnh phải dựa trên sự tôn trọng lẫn nhau, không phải là sự phụ thuộc hay kiểm soát.

Bạn muốn kể cho An An nghe cụ thể hơn điều gì vừa xảy ra giữa hai bạn không? Mình ở đây sẵn sàng lắng nghe nè!`,
          officialSources: ['Cẩm nang Kỹ năng sống UNICEF', 'Tâm lý học Phát triển Lứa tuổi Học trò'],
          suggestedActions: ['💬 Kể thêm về chuyện tình bạn', '🌿 Thư giãn và tập thở', '📝 Ghi nhật ký để nhìn lại'],
        };
      }

      // Mặc định tổng quát
      return {
        reply: `Chào bạn, An An luôn ở đây với bạn 🌸. Dù là áp lực thi cử, rắc rối tuổi dậy thì, bất hòa với bạn bè, chuyện gia đình hay những điều bối rối trên mạng xã hội, bạn cứ thoải mái trút bầu tâm sự nhé.

Mọi lời khuyên của An An đều dựa trên các **tài liệu chính thống từ UNICEF, Cục An toàn thông tin (Bộ TT&TT) và Viện Sức khỏe Tâm thần**, với mong muốn mang lại giải pháp an toàn và khoa học nhất cho bạn.

Hôm nay của bạn thế nào? Điều gì đang làm bạn bận tâm nhất lúc này?`,
        officialSources: ['UNICEF Việt Nam', 'Cục An toàn thông tin - Bộ TT&TT', 'Tổng đài Quốc gia 111'],
        suggestedActions: ['🎓 Áp lực học tập & Thi cử', '🛡️ Bị bắt nạt trên mạng', '👨‍👩‍👦 Bất đồng với gia đình'],
      };
    };

    if (ai) {
      try {
        const systemInstruction = `Bạn là "An An" (Tâm An) - chuyên gia tâm lý học đường và cố vấn an toàn không gian mạng AI dành cho học sinh, thanh thiếu niên và trẻ em Việt Nam (Gen Z).

NHIỆM VỤ CỦA BẠN:
Giải quyết mọi câu hỏi, tâm sự của bạn trẻ bằng cách đồng cảm sâu sắc, kết hợp lời khuyên dựa trên các TÀI LIỆU CHÍNH THỐNG VÀ PHÙ HỢP:
1. Luật Trẻ em 2016 (Việt Nam) & Quyết định 830/QĐ-TTg về bảo vệ trẻ em trên môi trường mạng.
2. Cẩm nang An toàn Thông tin của Cục An toàn Thông tin (Bộ TT&TT - vn-cop.vn), Mạng lưới ứng cứu bảo vệ trẻ em.
3. Hướng dẫn sức khỏe tâm thần học đường, quản lý stress và phòng chống bắt nạt của UNICEF Việt Nam và Tổ chức Y tế Thế giới (WHO).
4. Các phương pháp tâm lý học hành vi chuẩn y khoa: Kỹ thuật Hít thở 4-7-8 / Thở cơ hoành, Kỹ thuật neo đậu 5-4-3-2-1, Tái cấu trúc nhận thức (CBT), Giao tiếp Bất bạo động (NVC - Thông điệp "Tôi").
5. Hướng dẫn phòng chống lừa đảo, chiếm đoạt tài khoản và tống tiền hình ảnh (Sextortion) từ Cục Cảnh sát Hình sự (C02), Chongluadao.vn và công cụ Take It Down (NCMEC/UNICEF).
6. Đường dây nóng bảo trợ: Tổng đài Quốc gia Bảo vệ Trẻ em 111, Đường dây Ngày Mai 096 306 1414, Viện Sức khỏe Tâm thần Bạch Mai 024 3869 3731.

PHONG CÁCH VÀ CẤU TRÚC PHẢN HỒI:
- Xưng hô: "An An" và "Bạn", giọng văn dịu dàng, ấm áp, chân thành, dùng từ ngữ thân thuộc với Gen Z (nè, nhé, nha). Tuyệt đối không phán xét, không giáo điều hay chỉ trích.
- Luôn xác thực cảm xúc trước (thể hiện sự thấu hiểu tại sao bạn trẻ cảm thấy như vậy).
- Đưa ra giải pháp từng bước rõ ràng, khoa học và thực tế có thể làm ngay.
- Trích dẫn ngắn gọn tài liệu chính thống tương ứng (ví dụ: [Theo khuyến nghị UNICEF], [Theo Cẩm nang An toàn số Cục ATTT]).
- Yêu cầu trả về DUY NHẤT một chuỗi JSON hợp lệ không kèm markdown backticks theo đúng định dạng:
{
  "reply": "Nội dung phản hồi đầy đủ, định dạng Markdown đẹp mắt (in đậm, danh sách gạch đầu dòng rõ ràng, ngắt đoạn thoáng)",
  "suggestedActions": ["3 gợi ý hành động hoặc câu hỏi tiếp nối ngắn gọn"],
  "officialSources": ["2-3 tên cơ quan/tài liệu chính thống liên quan, ví dụ: UNICEF Việt Nam, Cục An toàn thông tin, Tổng đài 111"],
  "safetyTriggered": false
}`;

        // Chuẩn bị contents cho Gemini
        const formattedContents = messages.map((m: any) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }));

        const response = await withTimeout(
          ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: formattedContents,
            config: {
              systemInstruction,
              temperature: 0.6,
              responseMimeType: 'application/json',
              thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            },
          }),
          8000
        );

        const rawText = response.text?.trim() || '';
        const cleaned = rawText.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
        
        try {
          const parsed = JSON.parse(cleaned);
          return res.json({
            reply: parsed.reply || 'An An luôn ở đây lắng nghe bạn. Bạn hãy chia sẻ thêm nhé!',
            suggestedActions: parsed.suggestedActions || ['🌿 Tập thở 4-7-8', '📝 Ghi vào nhật ký NLP', '💬 Tâm sự thêm'],
            officialSources: parsed.officialSources || ['UNICEF Việt Nam', 'Cục An toàn thông tin (Bộ TT&TT)'],
            safetyTriggered: Boolean(parsed.safetyTriggered),
          });
        } catch (jsonErr) {
          // Nếu parse json không được, trả về text trực tiếp kèm metadata chuẩn
          return res.json({
            reply: cleaned || 'An An lắng nghe bạn rồi nè. Bạn cứ từ từ tâm sự tiếp nhé!',
            suggestedActions: ['🌿 Tập thở 4-7-8', '📝 Ghi nhật ký', '💬 Hỏi thêm lời khuyên'],
            officialSources: ['UNICEF Việt Nam', 'Cục An toàn thông tin'],
            safetyTriggered: false,
          });
        }
      } catch (geminiError) {
        console.warn('Gemini chat failed, using rich grounded fallback engine:', geminiError);
        const fallback = getLocalGroundedResponse(normalizedInput);
        return res.json({
          ...fallback,
          safetyTriggered: false,
        });
      }
    } else {
      // Local rich grounded response engine
      const fallback = getLocalGroundedResponse(normalizedInput);
      return res.json({
        ...fallback,
        safetyTriggered: false,
      });
    }
  } catch (error) {
    console.error('Lỗi API chat:', error);
    res.status(500).json({ error: 'Không thể xử lý tin nhắn lúc này.' });
  }
});


// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌸 Tâm An - SafeSpace server đang chạy tại http://localhost:${PORT}`);
  });
}

startServer();
