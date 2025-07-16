export interface NewsItem {
  id: string
  title: string
  excerpt: string
  imageUrl: string
}

export const newsItems: NewsItem[] = [
  {
    id: 'summer-hair-refresh',
    title: '夏のヘアリフレッシュ',
    excerpt: '今夏は、すべてのカラーサービスが20%オフ。今すぐご予約して、輝きを放って！',
    imageUrl: '/images/news-image-01.png',
  },
  {
    id: 'keratin-treatment',
    title: 'ケラチントリートメントの紹介',
    excerpt:
      'サラサラでフリズのない髪を、サロンの新しいケラチントリートメントで実現します。今すぐご予約を！',
    imageUrl: '/images/news-image-02.png',
  },
  {
    id: 'seasonal-hair-trends',
    title: '季節のヘアトレンド',
    excerpt: '今シーズンの最新ヘアトレンドやスタイルをご紹介します。',
    imageUrl: '/images/news-image-03.png',
  },
  {
    id: 'hair-care-tips',
    title: 'ヘアケアのコツ',
    excerpt: '髪の健康とツヤを保つための、プロによるアドバイスをご紹介します。',
    imageUrl: '/images/news-image-04.png',
  },
  {
    id: 'special-offer',
    title: '特別オファー',
    excerpt: '当サロンのサービスや商品に関する限定割引や特典をご利用いただけます。',
    imageUrl: '/images/news-image-05.png',
  },
  {
    id: 'professional-hair-treatment',
    title: 'プロフェッショナルヘアトリートメント',
    excerpt:
      'プロによるヘアトリートメントの効果や、髪の健康をどのように高めてくれるのかをご紹介します。',
    imageUrl: '/images/news-image-06.png',
  },
  // 追加の記事データ（テスト用）
  {
    id: 'winter-hair-care',
    title: '冬のヘアケア特集',
    excerpt: '乾燥する冬の季節に適したヘアケア方法をご紹介します。',
    imageUrl: '/images/news-image-01.png',
  },
  {
    id: 'new-year-special',
    title: '新年特別企画',
    excerpt: '新年を迎えるにあたって、新しいヘアスタイルで気分一新しませんか？',
    imageUrl: '/images/news-image-02.png',
  },
  {
    id: 'spring-collection',
    title: '春コレクション',
    excerpt: '春らしい明るいカラーとスタイルで、新しい季節を迎えましょう。',
    imageUrl: '/images/news-image-03.png',
  },
  {
    id: 'summer-special',
    title: '夏限定サービス',
    excerpt: '暑い夏を快適に過ごすためのヘアスタイルとケアをご提案します。',
    imageUrl: '/images/news-image-04.png',
  },
  {
    id: 'autumn-trends',
    title: '秋のトレンド',
    excerpt: '秋らしい落ち着いたカラーとスタイルで、上品な印象を演出します。',
    imageUrl: '/images/news-image-05.png',
  },
  {
    id: 'christmas-special',
    title: 'クリスマス特別企画',
    excerpt: 'クリスマスパーティーにぴったりの華やかなヘアスタイルをご提案します。',
    imageUrl: '/images/news-image-06.png',
  },
  {
    id: 'new-year-new-look',
    title: '新年、新しい私',
    excerpt: '新しい年の始まりに、イメージチェンジで気分を一新しませんか。',
    imageUrl: '/images/news-image-01.png',
  },
  {
    id: 'valentines-day-style',
    title: 'バレンタインスタイル',
    excerpt: '特別な日のための、ロマンティックなヘアアレンジをご提案します。',
    imageUrl: '/images/news-image-02.png',
  },
  {
    id: 'white-day-gift',
    title: 'ホワイトデーのお返しに',
    excerpt: '大切な人への贈り物に、ヘアケア製品はいかがですか。',
    imageUrl: '/images/news-image-03.png',
  },
  {
    id: 'graduation-ceremony-hair',
    title: '卒業式のヘアセット',
    excerpt: '晴れの日にふさわしい、思い出に残るヘアセットを。',
    imageUrl: '/images/news-image-04.png',
  },
  {
    id: 'entrance-ceremony-style',
    title: '入学式の準備',
    excerpt: '新しい生活のスタートに、フレッシュなヘアスタイルを。',
    imageUrl: '/images/news-image-05.png',
  },
  {
    id: 'golden-week-offer',
    title: 'ゴールデンウィーク企画',
    excerpt: '連休中にリフレッシュ。お得なキャンペーンを実施中です。',
    imageUrl: '/images/news-image-06.png',
  },
  {
    id: 'mothers-day-present',
    title: '母の日ギフト',
    excerpt: '日頃の感謝を込めて、ヘッドスパのプレゼントはいかがですか。',
    imageUrl: '/images/news-image-01.png',
  },
  {
    id: 'rainy-season-hair-care',
    title: '梅雨のヘアケア',
    excerpt: '湿気に負けない、まとまりやすい髪質へ改善します。',
    imageUrl: '/images/news-image-02.png',
  },
  {
    id: 'fathers-day-special',
    title: '父の日キャンペーン',
    excerpt: 'お父さんもカッコよく。メンズカットがお得になります。',
    imageUrl: '/images/news-image-03.png',
  },
  {
    id: 'early-summer-refresh',
    title: '初夏のリフレッシュ',
    excerpt: '紫外線対策もできる、夏向けトリートメントがおすすめです。',
    imageUrl: '/images/news-image-04.png',
  },
  {
    id: 'tanabata-event',
    title: '七夕イベント',
    excerpt: '短冊に願いを込めて。ささやかなプレゼントをご用意しています。',
    imageUrl: '/images/news-image-05.png',
  },
  {
    id: 'obon-holiday-notice',
    title: 'お盆休みのお知らせ',
    excerpt: '8月のお休みについてのご案内です。ご予約はお早めに。',
    imageUrl: '/images/news-image-06.png',
  },
  {
    id: 'autumn-color-campaign',
    title: '秋色カラーキャンペーン',
    excerpt: '深みのある秋色カラーで、大人っぽい雰囲気に。',
    imageUrl: '/images/news-image-01.png',
  },
  {
    id: 'respect-for-the-aged-day',
    title: '敬老の日',
    excerpt: 'おじいちゃん、おばあちゃんへのプレゼントに。',
    imageUrl: '/images/news-image-02.png',
  },
  {
    id: 'halloween-hair-arrange',
    title: 'ハロウィンアレンジ',
    excerpt: 'イベントがもっと楽しくなる、特別なヘアアレンジ。',
    imageUrl: '/images/news-image-03.png',
  },
  {
    id: 'culture-day-special',
    title: '文化の日',
    excerpt: '芸術の秋。いつもと違う自分を表現してみませんか。',
    imageUrl: '/images/news-image-04.png',
  },
  {
    id: 'end-of-year-hair-care',
    title: '年末ヘアメンテナンス',
    excerpt: '今年一年頑張った髪にご褒美を。年内に髪を綺麗に。',
    imageUrl: '/images/news-image-05.png',
  },
]
