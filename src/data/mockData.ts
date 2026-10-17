import { JournalEntry, SafetyTopic, SafetyQuiz, HotlineContact } from '../types';

export const DAILY_QUOTES = [
  {
    quote: "Cảm xúc giống như những đám mây trôi trên bầu trời. Dù mây có xám xịt đến đâu, bầu trời xanh vẫn luôn ở đó chờ bạn.",
    author: "Tâm An Đồng Hành",
  },
  {
    quote: "Bạn không cần phải hoàn hảo mỗi ngày. Việc bạn thức dậy và cố gắng vượt qua từng ngày đã là một điều phi thường rồi.",
    author: "Lời nhắn yêu thương",
  },
  {
    quote: "Trên mạng xã hội, người ta chỉ khoe những khoảnh khắc rực rỡ nhất. Đừng so sánh hậu trường của mình với thước phim đẹp nhất của người khác.",
    author: "Góc Nhìn An Toàn",
  },
  {
    quote: "Dũng cảm không phải là không bao giờ sợ hãi, mà là dám chia sẻ khi bản thân thấy bất an và cần sự giúp đỡ.",
    author: "Học Cách Lắng Nghe",
  },
];

export const INITIAL_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'entry-1',
    title: 'Áp lực trước tuần thi giữa kỳ và bài kiểm tra Toán',
    content: 'Hôm nay cô giáo vừa phát lịch thi giữa kì. Nhìn khối lượng kiến thức môn Toán và Hoá mà mình thấy choáng ngợp. Cả buổi chiều ngồi vào bàn học nhưng đầu óc cứ căng cứng, không thể tập trung được. Mình sợ làm bố mẹ thất vọng nếu điểm số lại tụt dốc như lần trước...',
    date: '2026-10-10',
    time: '21:30',
    moodEmoji: '😰',
    moodLabel: 'Lo âu',
    tags: ['Học tập', 'Thi cử', 'Gia đình'],
    emotions: {
      joy: 15,
      sadness: 45,
      anger: 20,
      anxiety: 88,
      optimism: 25,
    },
    dominantEmotion: 'Lo âu & Áp lực thi cử',
    sentimentScore: -45,
    triggers: ['Khối lượng bài thi giữa kỳ', 'Kỳ vọng điểm số từ bố mẹ', 'Môn Toán & Hoá'],
    empathyMessage: 'An An thấu hiểu cảm giác nghẹt thở khi nhìn vào lịch thi dồn dập. Điểm số là một cột mốc, nhưng nó không định nghĩa toàn bộ giá trị và năng lực của bạn. Hãy chia nhỏ bài học thành từng phần 25 phút nhé!',
    selfCareTips: [
      'Áp dụng phương pháp Pomodoro: học 25 phút, nghỉ 5 phút vận động nhẹ.',
      'Viết ra 3 câu hỏi bạn còn chưa hiểu để ngày mai hỏi bạn bè hoặc thầy cô.',
      'Uống một cốc nước ấm và tập thở 4 nhịp trước khi đi ngủ.',
    ],
  },
  {
    id: 'entry-2',
    title: 'Bị bạn bè chế ảnh và bình luận trêu chọc trong nhóm chat',
    content: 'Chiều nay một bạn trong lớp chụp lén khoảnh khắc mình ngáp ngủ trong giờ sinh hoạt rồi chế meme gửi vào nhóm chat chung có gần 40 người. Mọi người thả haha và trêu chọc. Mình cảm thấy xấu hổ và tổn thương vô cùng, nhưng không dám nhắn gì vì sợ bị nói là không biết đùa...',
    date: '2026-10-11',
    time: '22:15',
    moodEmoji: '🥺',
    moodLabel: 'Tổn thương',
    tags: ['Bạn bè', 'Mạng xã hội', 'Bắt nạt mạng'],
    emotions: {
      joy: 5,
      sadness: 82,
      anger: 65,
      anxiety: 75,
      optimism: 15,
    },
    dominantEmotion: 'Tổn thương & Tức giận',
    sentimentScore: -60,
    triggers: ['Bị chụp lén và chế meme', 'Nhóm chat trêu chọc', 'Sợ bị cô lập'],
    empathyMessage: 'Trêu chọc khi người khác không đồng ý và cảm thấy bị bẽ mặt thì không còn là trò đùa vui vẻ nữa. Cảm xúc tức giận và tổn thương của bạn là hoàn toàn chính đáng. Bạn không có lỗi trong chuyện này!',
    selfCareTips: [
      'Chụp ảnh màn hình làm bằng chứng lưu trữ lại trước khi rời hoặc tắt thông báo nhóm.',
      'Nhắn tin riêng thẳng thắn với bạn đăng ảnh yêu cầu gỡ xuống.',
      'Chia sẻ với một người bạn thân hoặc thầy cô chủ nhiệm để nhận sự hỗ trợ.',
    ],
  },
  {
    id: 'entry-3',
    title: 'Tâm sự với bạn thân và tập hít thở',
    content: 'Sáng nay mình đã nhắn tin cho Linh (bạn thân). Linh lắng nghe và bảo mình không việc gì phải xấu hổ cả, Linh còn lên tiếng nhắc nhở bạn kia xoá ảnh. Buổi chiều về hai đứa cùng đi trà sữa và thử bài tập hít thở trong phòng. Mình thấy lồng ngực nhẹ nhõm hơn nhiều.',
    date: '2026-10-12',
    time: '19:40',
    moodEmoji: '😌',
    moodLabel: 'Bình yên hơn',
    tags: ['Tình bạn', 'Chữa lành', 'Bản thân'],
    emotions: {
      joy: 65,
      sadness: 25,
      anger: 15,
      anxiety: 30,
      optimism: 78,
    },
    dominantEmotion: 'Nhẹ nhõm & Biết ơn',
    sentimentScore: 50,
    triggers: ['Sự ủng hộ của bạn thân', 'Được lắng nghe và thấu hiểu', 'Bài tập hít thở'],
    empathyMessage: 'Thật ấm lòng khi bạn có một người bạn tuyệt vời như Linh bên cạnh! Việc dám mở lời tâm sự đã giúp bạn giải tỏa được rất nhiều năng lượng u ám. Hãy trân trọng tình bạn này nhé.',
    selfCareTips: [
      'Viết một lời cảm ơn ngắn gửi đến Linh.',
      'Ghi nhớ cảm giác nhẹ nhõm này như một điểm tựa cho những ngày khó khăn sau.',
    ],
  },
  {
    id: 'entry-4',
    title: 'Bài tập nhóm bị dồn việc một mình',
    content: 'Hôm nay nhóm làm thuyết trình môn Lịch sử có 4 người nhưng 2 bạn lặn mất tăm, bạn còn lại thì bảo bận đi chơi. Hạn chót là tối mai mà slide vẫn dở dang. Mình vừa tức vừa bất lực, tại sao người có trách nhiệm luôn phải chịu thiệt thòi?',
    date: '2026-10-13',
    time: '20:00',
    moodEmoji: '😤',
    moodLabel: 'Bực bội',
    tags: ['Học tập', 'Đội nhóm', 'Bất công'],
    emotions: {
      joy: 10,
      sadness: 35,
      anger: 85,
      anxiety: 60,
      optimism: 30,
    },
    dominantEmotion: 'Tức giận & Bất mãn',
    sentimentScore: -40,
    triggers: ['Thành viên nhóm vô trách nhiệm', 'Hạn chót gấp', 'Gánh nặng công việc'],
    empathyMessage: 'Sự tức giận của bạn là hoàn toàn hợp lý. Bạn không có nghĩa vụ phải làm thay phần việc của người khác và chịu đựng trong im lặng. Hãy đặt ra ranh giới rõ ràng!',
    selfCareTips: [
      'Lập tức thông báo rõ ràng trong nhóm: Ai không hoàn thành phần việc trước 10h tối sẽ không có tên trong slide.',
      'Gửi email trao đổi trung thực với thầy cô bộ môn về tiến độ thực tế.',
      'Đứng dậy vươn vai, uống một ngụm nước mát để hạ hỏa.',
    ],
  },
  {
    id: 'entry-5',
    title: 'Giải quyết ổn thỏa và thiết lập ranh giới',
    content: 'Mình đã nhắn tin thẳng thắn cho cả nhóm và báo với cô giáo. Thật bất ngờ là cô đã hỗ trợ, yêu cầu 2 bạn kia phải nộp bài độc lập, còn mình và bạn còn lại chỉ cần hoàn thành phần của mình. Cảm thấy tự hào vì lần đầu tiên mình dám lên tiếng bảo vệ công sức của bản thân.',
    date: '2026-10-14',
    time: '21:10',
    moodEmoji: '💪',
    moodLabel: 'Tự tin',
    tags: ['Phát triển bản thân', 'Ranh giới', 'Học tập'],
    emotions: {
      joy: 78,
      sadness: 10,
      anger: 15,
      anxiety: 20,
      optimism: 85,
    },
    dominantEmotion: 'Tự hào & Vững vàng',
    sentimentScore: 68,
    triggers: ['Dám lên tiếng bảo vệ bản thân', 'Cô giáo công bằng hỗ trợ', 'Hoàn thành công việc'],
    empathyMessage: 'Tuyệt vời lắm! Lên tiếng bảo vệ ranh giới của mình là một kỹ năng trưởng thành vô cùng quan trọng. Bạn đã xử lý tình huống rất văn minh và hiệu quả.',
    selfCareTips: [
      'Thưởng cho bản thân một tập phim hoạt hình yêu thích tối nay.',
      'Tự nhủ: "Mình hoàn toàn có quyền từ chối những điều bất công".',
    ],
  },
  {
    id: 'entry-6',
    title: 'Đi dạo ngắm hoàng hôn và nghe nhạc lofi',
    content: 'Chiều thứ Sáu tan học sớm, mình đi bộ vòng quanh hồ gần nhà. Gió thu mát rượi, bầu trời chuyển sang màu cam hồng rất đẹp. Cắm tai nghe bật nhạc lofi không lời, cảm giác mọi ồn ào và áp lực suốt cả tuần dần tan biến.',
    date: '2026-10-15',
    time: '18:50',
    moodEmoji: '🍃',
    moodLabel: 'Thư thái',
    tags: ['Bản thân', 'Thiên nhiên', 'Nghỉ ngơi'],
    emotions: {
      joy: 85,
      sadness: 8,
      anger: 5,
      anxiety: 12,
      optimism: 92,
    },
    dominantEmotion: 'Bình yên & Thư thái',
    sentimentScore: 82,
    triggers: ['Không khí trong lành', 'Hoàng hôn', 'Âm nhạc lofi'],
    empathyMessage: 'Khoảnh khắc được hòa mình vào thiên nhiên và tĩnh lặng là liều thuốc quý giá nhất cho tâm hồn. Nhìn biểu đồ tuần này, An An thấy bạn đã kiên cường vượt qua những ngày giông bão để đón hoàng hôn bình yên.',
    selfCareTips: [
      'Chụp lại một bức ảnh bầu trời làm hình nền điện thoại nhắc nhở bản thân.',
      'Đi ngủ sớm hơn 30 phút để nạp lại đầy pin năng lượng.',
    ],
  },
];

export const SAFETY_TOPICS: SafetyTopic[] = [
  {
    id: 'cyberbullying',
    category: 'cyberbullying',
    title: 'Đối Phó Với Bạo Lực Mạng & Bắt Nạt Ẩn Danh',
    badge: 'Kỹ Năng Sống Còn',
    subtitle: 'Công thức 4B: Bằng chứng - Block - Báo cáo - Bạn bè & Người lớn',
    iconName: 'ShieldAlert',
    colorBg: 'bg-rose-50',
    colorBorder: 'border-rose-200',
    colorAccent: 'text-rose-600',
    summary: 'Bạo lực mạng (Cyberbullying) không chỉ là lời nói đùa. Nó là hành vi bêu rếu, chế giễu ngoại hình, lập group tẩy chay hoặc xúc phạm nhân phẩm có chủ đích trên môi trường mạng.',
    comicVisual: {
      title: 'Kẻ Bắt Nạt Núp Sau Bàn Phím',
      description: 'Họ chỉ mạnh mẽ khi giấu mặt. Phản ứng tức giận của bạn chính là "mồi lửa" nuôi sống họ. Tắt tiếng và ngắt nguồn cung cấp!',
      icon: 'UserX',
    },
    keyRules: [
      {
        rule: 'Nguyên tắc 1: Tuyệt đối KHÔNG trả đũa đôi co',
        detail: 'Càng tranh cãi tay đôi trên bình luận công khai, thuật toán mạng xã hội càng đẩy bài viết lên cao và kẻ bắt nạt càng phấn khích.',
      },
      {
        rule: 'Nguyên tắc 2: Chụp ảnh màn hình lưu bằng chứng (Evidence)',
        detail: 'Chụp lại toàn bộ tin nhắn, tài khoản kẻ quấy rối, mốc thời gian và liên kết trước khi chặn hoặc trước khi họ kịp thu hồi.',
      },
      {
        rule: 'Nguyên tắc 3: Chặn (Block) & Báo cáo (Report) quyết liệt',
        detail: 'Dùng tính năng Báo cáo quấy rối của Facebook, TikTok, Instagram hoặc Zalo, sau đó chặn vĩnh viễn tài khoản đó.',
      },
      {
        rule: 'Nguyên tắc 4: Nói ra với người lớn bạn tin tưởng',
        detail: 'Chia sẻ với cha mẹ, thầy cô tâm lý hoặc gọi Tổng đài Bảo vệ Trẻ em 111. Bạn không phải chịu đựng trong cô độc.',
      },
    ],
    actionGuide: [
      'Bước 1: Giữ bình tĩnh, không gõ phím phản hồi trong lúc đang tức giận hoặc hoảng loạn.',
      'Bước 2: Bấm tổ hợp phím chụp màn hình (kèm đường link bài viết/trang cá nhân kẻ xấu).',
      'Bước 3: Nhờ 3-5 người bạn cùng gắn cờ báo cáo vi phạm tiêu chuẩn cộng đồng.',
      'Bước 4: Tạm rời xa mạng xã hội trong 24 giờ, làm việc mình yêu thích ngoài đời thực.',
    ],
    cautionSigns: [
      'Nhận được tin nhắn ẩn danh từ tài khoản clone đe dọa, chửi bới.',
      'Hình ảnh cá nhân bị cắt ghép meme, chế giễu cơ thể (body shaming) trong các diễn đàn/nhóm kín.',
      'Bị tạo nhóm chat riêng để cô lập hoặc kích động tẩy chay.',
    ],
    verifiedSources: [
      { name: 'Tổng đài Quốc gia Bảo vệ Trẻ em 111', desc: 'Hỗ trợ can thiệp bạo lực học đường & không gian mạng 24/7' },
      { name: 'Cục An toàn Thông tin - Bộ TT&TT (vn-cop.vn)', desc: 'Mạng lưới ứng cứu và bảo vệ trẻ em trên môi trường mạng' },
      { name: 'CyberKid Vietnam', desc: 'Tổ chức phi lợi nhuận bảo vệ an toàn số cho trẻ em Việt Nam' },
    ],
  },
  {
    id: 'privacy',
    category: 'privacy',
    title: 'Quản Lý Dấu Chân Số & Quyền Riêng Tư Cá Nhân',
    badge: 'Bảo Mật Tối Ưu',
    subtitle: 'Những gì bạn đăng lên mạng hôm nay có thể tồn tại mãi mãi',
    iconName: 'Lock',
    colorBg: 'bg-emerald-50',
    colorBorder: 'border-emerald-200',
    colorAccent: 'text-emerald-600',
    summary: 'Dấu chân kỹ thuật số (Digital Footprint) là toàn bộ dấu vết bạn để lại trên Internet: bài đăng, ảnh check-in, lịch sử tìm kiếm, và thông tin tài khoản cá nhân.',
    comicVisual: {
      title: 'Tấm Vé "Check-in" Lộ Địa Chỉ Nhà',
      description: 'Chụp ảnh khoe vé xem phim có mã vạch, check-in thời gian thực ở trường học hay nhà riêng là mồi ngon cho kẻ theo dõi rình mò!',
      icon: 'MapPinOff',
    },
    keyRules: [
      {
        rule: 'Bật xác thực 2 lớp (2FA) bằng ứng dụng',
        detail: 'Không chỉ dựa vào mật khẩu. Hãy bật 2FA bằng Google Authenticator hoặc tin nhắn xác thực cho tài khoản Google, Facebook, Zalo.',
      },
      {
        rule: 'Quy tắc 24 Giờ: Trì hoãn Check-in',
        detail: 'Chỉ đăng ảnh chuyến đi hoặc địa điểm sau khi bạn đã rời khỏi nơi đó. Đừng để người lạ biết chính xác bạn đang ở đâu theo thời gian thực.',
      },
      {
        rule: 'Cảnh giác với trào lưu Oversharing (Chia sẻ quá đà)',
        detail: 'Không bao giờ công khai: Căn cước công dân, thẻ học sinh (có tên trường + lớp), vé máy bay/vé concert, góc chụp lộ số nhà.',
      },
      {
        rule: 'Lọc danh sách bạn bè định kỳ mỗi học kỳ',
        detail: 'Chỉ giữ kết nối với những người bạn thực sự quen biết ngoài đời. Chuyển trang cá nhân về chế độ Riêng tư (Friends only).',
      },
    ],
    actionGuide: [
      'Kiểm tra lại quyền riêng tư: Chuyển danh sách bài viết từ Công khai (Public) sang Bạn bè (Friends).',
      'Tắt quyền truy cập Vị trí (Location) nền của các ứng dụng mạng xã hội và camera.',
      'Thử tìm kiếm tên thật của chính bạn trên Google Search để xem thông tin nào đang bị công khai.',
      'Sử dụng mật khẩu mạnh dài trên 12 ký tự, không dùng ngày tháng năm sinh hay tên người yêu.',
    ],
    cautionSigns: [
      'Nhận được email hoặc thông báo có thiết bị lạ đăng nhập tài khoản ở tỉnh thành khác.',
      'Người lạ vừa kết bạn nhưng nắm rất rõ lịch trình đi học, thói quen sinh hoạt của bạn.',
      'Các ứng dụng quiz vui vẻ ("Xem tương lai", "Bạn giống ai") đòi hỏi quyền đọc danh bạ và quyền truy cập dữ liệu cá nhân.',
    ],
    verifiedSources: [
      { name: 'Cổng Không Gian Mạng Quốc Gia (khonggianmang.vn)', desc: 'Cẩm nang hướng dẫn bảo mật cá nhân & kiểm tra lộ lọt thông tin' },
      { name: 'Trung tâm Giám sát An toàn Không gian mạng Quốc gia (NCSC)', desc: 'Khuyến cáo phòng ngừa rò rỉ dữ liệu tài khoản' },
    ],
  },
  {
    id: 'fakenews',
    category: 'fakenews',
    title: 'Bộ Lọc Tin Giả, Lừa Đảo & Bẫy Deepfake',
    badge: 'Tư Duy Phản Biện',
    subtitle: 'Đừng vội tin và đừng vội chia sẻ khi chưa kiểm chứng 4 bước',
    iconName: 'Sparkles',
    colorBg: 'bg-amber-50',
    colorBorder: 'border-amber-200',
    colorAccent: 'text-amber-600',
    summary: 'Tin giả (Fake News) và video giả mạo bằng AI (Deepfake) được thiết kế tinh vi để đánh vào nỗi sợ hãi, lòng tham hoặc sự hiếu kỳ của bạn trẻ.',
    comicVisual: {
      title: 'Bẫy Nạp Thẻ Game & Deepfake Giả Giọng',
      description: '"Bấm link nhận 1000 Kim Cương miễn phí", "Mượn tiền khẩn cấp qua video call mờ ảo"... Những cái bẫy quen thuộc nhưng luôn có người sập!',
      icon: 'AlertTriangle',
    },
    keyRules: [
      {
        rule: 'Nguyên tắc STOP: Dừng lại 10 giây trước khi bấm Share',
        detail: 'Nếu một tiêu đề khiến bạn giật mình, hoảng sợ hoặc quá phấn khích, 90% nó được giật tít câu tương tác (Clickbait) hoặc lừa đảo.',
      },
      {
        rule: 'Kiểm tra 4 Yếu tố: Nguồn - Tác giả - Thời gian - Bằng chứng',
        detail: 'Tin tức này từ báo chính thống có tên miền .vn hay trang web rác đuôi lạ? Ngày đăng là hôm nay hay chuyện từ 5 năm trước?',
      },
      {
        rule: 'Nhận diện Deepfake video call mượn tiền',
        detail: 'Video call ngắn vài giây, hình ảnh bị giật, khuôn mặt đơ cứng, âm thanh méo mó và cúp máy viện cớ mạng lag rồi giục chuyển tiền gấp.',
      },
      {
        rule: 'Không có bữa trưa miễn phí trên mạng',
        detail: 'Mọi đường link hứa hẹn tặng skin game, tài khoản VIP, thẻ cào free đều là bẫy lừa cài mã độc hoặc chiếm đoạt tài khoản.',
      },
    ],
    actionGuide: [
      'Khi nhận tin nhắn vay tiền từ bạn bè/người thân: Hãy gọi điện thoại thoại thoại trực tiếp số di động ngoài mạng xã hội để xác minh.',
      'Sử dụng công cụ Google Tìm kiếm Hình ảnh bằng cách kéo thả ảnh để xem ảnh gốc xuất phát từ đâu.',
      'Theo dõi các kênh thông tin chính thống của cơ quan báo chí uy tín (VTV24, TTXVN, Tuổi Trẻ, Thanh Niên).',
    ],
    cautionSigns: [
      'Đường link lạ có ký tự sai chính tả như f4cebook.com, g00gle.com, roblox-free.xyz.',
      'Tin đồn lan truyền không dẫn tên tác giả, không có viện dẫn cơ quan chức năng, kèm câu "Hãy chia sẻ gấp trước khi bị xóa!".',
    ],
    verifiedSources: [
      { name: 'Cổng Thông tin Chống Lừa Đảo (chongluadao.vn)', desc: 'Cơ sở dữ liệu các website lừa đảo và mã độc tại Việt Nam' },
      { name: 'Trung tâm Xử lý Tin giả Việt Nam (tingia.gov.vn)', desc: 'Tra cứu và tiếp nhận phản ánh tin giả, tin sai sự thật' },
    ],
  },
  {
    id: 'grooming',
    category: 'grooming',
    title: 'Phòng Ngừa Dụ Dỗ & Tống Tiền Hình Ảnh (Sextortion)',
    badge: 'Bảo Vệ Thân Thể',
    subtitle: 'Cơ thể và hình ảnh riêng tư của bạn là bất khả xâm phạm',
    iconName: 'HeartHandshake',
    colorBg: 'bg-indigo-50',
    colorBorder: 'border-indigo-200',
    colorAccent: 'text-indigo-600',
    summary: 'Dụ dỗ qua mạng (Online Grooming) là khi kẻ xấu tiếp cận trẻ em/teen bằng cách giả làm người tốt bụng, tặng quà, lắng nghe tâm sự rồi dần đòi hỏi gửi hình ảnh/video nhạy cảm.',
    comicVisual: {
      title: 'Chiếc Bẫy "Anh Trai Mưa" Tốt Bụng',
      description: 'Họ bắt đầu bằng việc tặng quà game, tỏ ra thấu hiểu bạn hơn cả gia đình, rồi chuyển sang "chỉ gửi cho riêng anh xem thôi mà"...',
      icon: 'EyeOff',
    },
    keyRules: [
      {
        rule: 'Quy tắc Vàng: Tuyệt đối KHÔNG chụp hoặc gửi ảnh riêng tư',
        detail: 'Dù là bạn trai/bạn gái hay bất kỳ ai hứa hẹn giữ bí mật đến đâu, một bức ảnh đã gửi đi là bạn đã mất hoàn toàn quyền kiểm soát nó.',
      },
      {
        rule: 'Nếu bị đe dọa phát tán ảnh: KHÔNG chiều theo yêu cầu',
        detail: 'Kẻ tống tiền sẽ KHÔNG BAO GIỜ dừng lại sau khi bạn gửi thêm ảnh hay tiền. Càng nhượng bộ, chúng càng đòi hỏi nhiều hơn.',
      },
      {
        rule: 'Bạn là NẠN NHÂN, bạn không có tội lỗi đáng bị trừng phạt',
        detail: 'Kẻ phạm pháp là kẻ tống tiền. Đừng sợ hãi tự trách bản thân dẫn đến suy nghĩ dại dột.',
      },
      {
        rule: 'Tìm kiếm sự trợ giúp khẩn cấp ngay lập tức',
        detail: 'Báo ngay cho cha mẹ, người lớn hoặc gọi số 111 (Tổng đài Quốc gia Bảo vệ Trẻ em). Họ có quy trình bảo mật danh tính tuyệt đối.',
      },
    ],
    actionGuide: [
      'Bước 1: Ngưng mọi liên lạc với kẻ tống tiền, không gửi thêm bất kỳ tài liệu hay tiền bạc nào.',
      'Bước 2: Chụp ảnh toàn bộ bằng chứng tin nhắn tống tiền, số tài khoản, link trang cá nhân.',
      'Bước 3: Bấm gọi ngay 111 hoặc nhờ người thân đưa đến công an khu vực để can thiệp pháp luật.',
      'Bước 4: Sử dụng công cụ Take It Down (takeitdown.ncmec.org) để ngăn chặn phát tán hình ảnh riêng tư trên toàn cầu.',
    ],
    cautionSigns: [
      'Người lạ trên mạng hỏi về chuyện cơ thể, yêu cầu bật camera trong phòng ngủ kín.',
      'Kẻ đó yêu cầu giữ bí mật mối quan hệ với bố mẹ và bạn bè.',
      'Tặng quà có giá trị lớn bất thường mà không có lý do chính đáng.',
    ],
    verifiedSources: [
      { name: 'Take It Down (Unicef & NCMEC hợp tác)', desc: 'Công cụ gỡ bỏ hình ảnh riêng tư của trẻ vị thành niên trên các nền tảng mạng xã hội' },
      { name: 'Đường dây nóng Tổng đài 111', desc: 'Tiếp nhận tố giác tội phạm xâm hại và bảo vệ nạn nhân khẩn cấp' },
    ],
  },
];

export const SAFETY_QUIZZES: SafetyQuiz[] = [
  {
    id: 'quiz-1',
    category: 'Cyberbullying',
    question: 'Bạn tình cờ thấy một nhóm bạn cùng khối lập group chat đặt biệt danh xúc phạm và bêu rếu ảnh một bạn trong lớp. Bạn nên làm gì?',
    context: 'Tình huống bạo lực mạng học đường rất phổ biến',
    options: [
      {
        text: 'Thả haha và nhắn theo cho vui, vì mình không phải là người tạo nhóm.',
        isCorrect: false,
        explanation: 'Hùa theo trò đùa ác ý vô tình biến bạn thành đồng phạm tiếp tay cho bạo lực mạng, gây tổn thương sâu sắc cho nạn nhân.',
      },
      {
        text: 'Lặng lẽ rời nhóm, vờ như không biết gì để tránh bị liên lụy.',
        isCorrect: false,
        explanation: 'Im lặng đôi khi là đồng thuận. Bạn có thể làm tốt hơn thế để bảo vệ bạn mình một cách an toàn.',
      },
      {
        text: 'Chụp lại màn hình làm bằng chứng, nhắc nhở nhóm dừng lại hoặc báo cho thầy cô/cố vấn tâm lý.',
        isCorrect: true,
        explanation: 'Chính xác! Lưu bằng chứng và báo người lớn có trách nhiệm là hành động dũng cảm giúp chấm dứt hành vi bắt nạt.',
      },
    ],
  },
  {
    id: 'quiz-2',
    category: 'Fake News & Scams',
    question: 'Tài khoản mạng xã hội của một người bạn thân bất ngờ nhắn tin: "Tao đang kẹt tiền đóng tiền học gấp quá, mày chuyển khoản cho tao 500k vào số tài khoản này với, tối tao trả". Bạn nên làm gì?',
    context: 'Thủ đoạn hack nick hoặc mạo danh bạn bè mượn tiền',
    options: [
      {
        text: 'Chuyển khoản ngay vì bạn thân đang gặp hoạn nạn cần giúp đỡ.',
        isCorrect: false,
        explanation: 'Rất nguy hiểm! Tài khoản của bạn có thể đã bị kẻ xấu hack hoặc chiếm quyền kiểm soát.',
      },
      {
        text: 'Gọi điện thoại trực tiếp vào số di động cá nhân của bạn để xác minh giọng nói và tình huống.',
        isCorrect: true,
        explanation: 'Chính xác! Luôn xác minh qua một kênh liên lạc độc lập (gọi điện thoại trực tiếp ngoài mạng xã hội) trước khi liên quan đến tiền bạc.',
      },
      {
        text: 'Chụp màn hình đăng lên trang cá nhân hỏi xem có ai bị bạn ấy mượn tiền không.',
        isCorrect: false,
        explanation: 'Điều này có thể làm lộ thông tin riêng tư và chưa phải là cách xác minh nhanh nhất.',
      },
    ],
  },
  {
    id: 'quiz-3',
    category: 'Digital Footprint',
    question: 'Bạn vừa nhận được giấy báo trúng tuyển trường cấp 3 hoặc bằng khen học sinh giỏi. Bạn muốn chia sẻ niềm vui lên mạng xã hội, cách nào an toàn nhất?',
    context: 'Khoe thành tích nhưng không để lộ dấu chân dữ liệu cá nhân',
    options: [
      {
        text: 'Chụp toàn bộ tờ giấy báo bao gồm họ tên, ngày sinh, số CCCD, địa chỉ nhà và tên trường lớp.',
        isCorrect: false,
        explanation: 'Thông tin này có thể bị kẻ xấu dùng để mở tài khoản giả mạo, định danh hoặc rình mò địa chỉ nơi ở của bạn.',
      },
      {
        text: 'Chụp ảnh có che mờ (blur) số CCCD, địa chỉ nhà, mã số học sinh, chỉ để lại lời chúc mừng và tên bạn.',
        isCorrect: true,
        explanation: 'Rất chuẩn! Bạn vẫn có thể chia sẻ niềm tự hào cùng bạn bè mà vẫn bảo vệ an toàn danh tính của mình.',
      },
      {
        text: 'Ghim vị trí check-in tại nhà riêng khi đăng kèm bài viết.',
        isCorrect: false,
        explanation: 'Check-in tại nhà riêng khiến bất kỳ ai trên mạng cũng biết được tọa độ sinh sống chính xác của gia đình bạn.',
      },
    ],
  },
];

export const HOTLINES: HotlineContact[] = [
  {
    name: 'Tổng đài Quốc gia Bảo vệ Trẻ em',
    number: '111',
    shortDesc: 'Tư vấn tâm lý, can thiệp khẩn cấp bạo lực học đường, xâm hại và bạo lực mạng.',
    badge: 'Khẩn cấp 24/7',
    available: '24/7 Miễn phí cước',
    isFree: true,
    type: 'children',
  },
  {
    name: 'Đường dây nóng Hỗ trợ Tâm lý Ngày Mai',
    number: '096 306 1414',
    shortDesc: 'Lắng nghe, thấu hiểu người trầm cảm, khủng hoảng cảm xúc và thanh thiếu niên.',
    badge: 'Tư vấn Tâm lý',
    available: '08:00 - 20:30 Hằng ngày',
    isFree: true,
    type: 'mental_health',
  },
  {
    name: 'Viện Sức khỏe Tâm thần - BV Bạch Mai',
    number: '024 3869 3731',
    shortDesc: 'Đơn vị y tế chuyên sâu hỗ trợ can thiệp rối loạn lo âu, trầm cảm thanh thiếu niên.',
    badge: 'Chuyên gia Y tế',
    available: 'Giờ hành chính & Cấp cứu',
    isFree: false,
    type: 'mental_health',
  },
  {
    name: 'Tổng đài Cảnh sát Khẩn cấp',
    number: '113',
    shortDesc: 'Ứng phó khẩn cấp các hành vi bạo lực thân thể, đe dọa tính mạng hoặc tống tiền nguy hiểm.',
    badge: 'Công An',
    available: '24/7 Toàn quốc',
    isFree: true,
    type: 'police',
  },
];
