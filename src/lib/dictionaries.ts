import type { Locale } from "@/src/lib/types";

type Dictionary = {
  common: {
    appName: string;
    home: string;
    prices: string;
    docs: string;
    newSearch: string;
    backHome: string;
    copyAll: string;
    copied: string;
    exportMarkdown: string;
    loading: string;
    retry: string;
    language: string;
    market: string;
    keyword: string;
    oneTime: string;
    subscription: string;
    monthlyPlan: string;
    monthlyQuota: string;
  };
  home: {
    badge: string;
    title: string;
    subtitle: string;
    placeholder: string;
    generate: string;
    generating: string;
    emptyKeyword: string;
    simpleInputTitle: string;
    simpleInputBody: string;
    actionableCardsTitle: string;
    actionableCardsBody: string;
    fastUnlockTitle: string;
    fastUnlockBody: string;
    signalTitle: string;
    signalBody: string;
    trendingTitle: string;
    trendingBody: string;
    autoKeywordHint: string;
    refreshKeywords: string;
    refreshingKeywords: string;
    usageToday: string;
    remainingToday: string;
    upgradeTitle: string;
    upgradeBody: string;
    upgradeCta: string;
  };
  results: {
    title: string;
    generatingTitle: string;
    generatingBody: string;
    errorTitle: string;
    unlockedTitle: string;
    unlockedBody: string;
    paywallTitle: string;
    paywallBody: string;
    unlockCta: string;
    preparing: string;
    totalIdeas: string;
    freeIdeas: string;
    moreIdeas: string;
    processingStatus: string;
    failedStatus: string;
    refreshHint: string;
    unlockPackLabel: string;
    subscribeLabel: string;
    activeSubscription: string;
    activeSubscriptionBody: string;
    purchaseIncluded: string;
    oneTimeTitle: string;
    oneTimeBody: string;
    oneTimeFeatures: string[];
    subscriptionTitle: string;
    subscriptionPrice: string;
    subscriptionBody: string;
    subscriptionFeatures: string[];
    subscriptionHint: string;
    subscriptionRecommended: string;
    previewCompleteTitle: string;
    previewCompleteBody: string;
    viewUnlockOptions: string;
  };
  ideaCard: {
    locked: string;
    idea: string;
    targetUsers: string;
    why: string;
    signalSummary: string;
    aso: string;
    title: string;
    subtitle: string;
    heroHook: string;
    description: string;
    keywords: string;
    valueBullets: string;
    paywallCopy: string;
    buildPackage: string;
    productSummary: string;
    mvpFeatures: string;
    v1Roadmap: string;
    devPromptKit: string;
    launchPromptKit: string;
    lockedBody: string;
    unlockButton: string;
  };
  pay: {
    badge: string;
    title: string;
    subtitle: string;
    purchaseType: string;
    payNow: string;
    processing: string;
    unavailableTitle: string;
    missingOrder: string;
    backResults: string;
    planSelectorBadge: string;
    planSelectorTitle: string;
    planSelectorSubtitle: string;
    autoRenewBadge: string;
    prepaidBadge: string;
    bestDealBadge: string;
    selectedPlanLabel: string;
    continueCheckout: string;
    planMonthlyHint: string;
    orderAutoRenewHint: string;
    orderFixedTermHint: string;
    planNames: Record<"monthly" | "quarterly" | "semiannual" | "auto_monthly", string>;
    planShortNames: Record<"monthly" | "quarterly" | "semiannual" | "auto_monthly", string>;
    planPrices: Record<"monthly" | "quarterly" | "semiannual" | "auto_monthly", string>;
    planDescriptions: Record<"monthly" | "quarterly" | "semiannual" | "auto_monthly", string>;
    planSavingsLabel: string;
    planBestValueLabel: string;
    planBaselineHint: string;
  };
  prices: {
    badge: string;
    title: string;
    subtitle: string;
    oneTimeTitle: string;
    oneTimePrice: string;
    oneTimeDescription: string;
    subscriptionTitle: string;
    subscriptionPrice: string;
    subscriptionDescription: string;
    nextGenerationBonus: string;
    includedTitle: string;
    recommendedBadge: string;
    subscribeNow: string;
    subscribingNow: string;
    subscriptionSuccess: string;
    oneTimeFeatures: string[];
    subscriptionFeatures: string[];
    comparisonNote: string;
  };
  docs: {
    badge: string;
    title: string;
    subtitle: string;
    sections: Array<{
      title: string;
      body: string;
      bullets: string[];
    }>;
  };
};

export const EXAMPLES_BY_LOCALE: Record<Locale, string[]> = {
  ja: ["家計簿", "ペットケア", "勉強計画", "食事管理", "習慣化"],
  en: ["pet care", "budget planner", "study schedule", "habit tracker", "meal prep"],
  "zh-CN": ["宠物护理", "学习计划", "习惯养成", "餐食管理", "家庭记账"],
};

const dictionaries: Record<Locale, Dictionary> = {
  ja: {
    common: {
      appName: "App Idea Finder",
      home: "ホーム",
      prices: "Prices",
      docs: "Doc",
      newSearch: "新しく探す",
      backHome: "ホームへ戻る",
      copyAll: "すべてコピー",
      copied: "コピー済み",
      exportMarkdown: "Markdown を書き出す",
      loading: "読み込み中...",
      retry: "再試行",
      language: "言語",
      market: "市場",
      keyword: "キーワード",
      oneTime: "単発購入",
      subscription: "サブスクリプション",
      monthlyPlan: "月額プラン",
      monthlyQuota: "月次枠",
    },
    home: {
      badge: "何を作るかを決める",
      title: "次に作るアプリのアイデアをすぐ見つける",
      subtitle:
        "キーワードを入れるだけで、作れるアプリ案、軽量な App Store シグナル、そしてそのまま使える ASO と開発プロンプトを取得できます。",
      placeholder: "例: ペットケア、家計簿、勉強計画...",
      generate: "アイデアを生成",
      generating: "生成中...",
      emptyKeyword: "キーワードを入力してください。",
      simpleInputTitle: "シンプル入力",
      simpleInputBody: "キーワードを 1 つ入れるだけ。表やダッシュボードはありません。",
      actionableCardsTitle: "実行しやすいカード",
      actionableCardsBody: "各アイデアにターゲット、収益性の示唆、ASO、プロダクトの方向性を含めます。",
      fastUnlockTitle: "すぐにアンロック",
      fastUnlockBody: "最初の 2 件は無料。気に入ったらフルパックまたは月額で解放できます。",
      signalTitle: "軽量な実市場シグナル",
      signalBody: "裏側では App Store の軽量シグナルを要約し、画面は極力シンプルに保ちます。",
      trendingTitle: "人気キーワードから着想",
      trendingBody: "表示される 5 件のタグは固定ではなく、人気キーワード候補から毎回ランダムに表示します。",
      autoKeywordHint: "キーワードが空の場合は、人気キーワードから 1 つ選んで自動生成します。",
      refreshKeywords: "キーワードを更新",
      refreshingKeywords: "更新中...",
      usageToday: "今日の生成回数",
      remainingToday: "アップグレード前の目安残数",
      upgradeTitle: "さらに多く試すなら月額プランへ",
      upgradeBody: "今日 3 回以上生成しています。月額プランなら次回生成から 8 件の idea を取得でき、継続的な比較がしやすくなります。",
      upgradeCta: "Prices を見る",
    },
    results: {
      title: "アイデアパック",
      generatingTitle: "アイデアを生成しています...",
      generatingBody: "数秒で結果が表示されます。自動で更新します。",
      errorTitle: "結果を読み込めませんでした",
      unlockedTitle: "アンロック済み",
      unlockedBody: "フルパックの確認、コピー、書き出しができます。",
      paywallTitle: "フルアイデアパックをアンロック",
      paywallBody:
        "あと {count} 件のアイデアが待っています。各案に詳細 ASO、機能提案、MVP スコープ、開発プロンプトを含みます。",
      unlockCta: "フルアイデアパックをアンロック",
      preparing: "準備中...",
      totalIdeas: "総アイデア数",
      freeIdeas: "無料アイデア",
      moreIdeas: "残りのアイデア",
      processingStatus: "生成中",
      failedStatus: "生成失敗",
      refreshHint: "自動更新されない場合は再試行してください。",
      unlockPackLabel: "このパックを購入",
      subscribeLabel: "月額プランで使う",
      activeSubscription: "月額プラン有効",
      activeSubscriptionBody: "このパックは月額枠で利用できます。追加決済なしでフル内容を表示します。",
      purchaseIncluded: "このパックは月額プランに含まれます。",
      oneTimeTitle: "単発でこのパックだけ解放",
      oneTimeBody: "今見ているキーワードだけ深掘りしたいときに向いています。",
      oneTimeFeatures: ["現在の結果だけアンロック", "追加の継続特典なし", "1 回限りの確認向け"],
      subscriptionTitle: "月額で継続的に比較・生成する",
      subscriptionPrice: "${price} / month から",
      subscriptionBody: "今のパック解放に加えて、次回以降の生成量アップと継続検証のしやすさをまとめて得られます。",
      subscriptionFeatures: [
        "現在の pack も月額枠で解放",
        "次回生成から 8 件の idea",
        "継続的な比較と再生成に向く",
        "長く使うほど単発購入より割安"
      ],
      subscriptionHint: "遷移先で 1 か月 / 3 か月 / 半年 / 継続月額 を選べます。",
      subscriptionRecommended: "おすすめ",
      previewCompleteTitle: "まずは無料プレビューを確認",
      previewCompleteBody: "上の結果を見て方向性が合えば、下の解放オプションから単発購入または月額プランを選べます。",
      viewUnlockOptions: "解放オプションを見る",
    },
    ideaCard: {
      locked: "ロック中",
      idea: "アイデア",
      targetUsers: "対象ユーザー",
      why: "差別化ポイントと売り",
      signalSummary: "シグナル要約",
      aso: "紹介文案と見せ方",
      title: "アプリ名",
      subtitle: "短い訴求コピー",
      heroHook: "最初に刺さる一文",
      description: "紹介文",
      keywords: "キーワード",
      valueBullets: "価値の見せ方",
      paywallCopy: "課金導線コピー",
      buildPackage: "開発の進め方と実装ヒント",
      productSummary: "コンセプト要約",
      mvpFeatures: "先に作る主要機能",
      v1Roadmap: "V1 ロードマップ",
      devPromptKit: "開発プロンプト",
      launchPromptKit: "ローンチプロンプト",
      lockedBody: "アンロックすると、差別化ポイント、紹介文案、実装ヒント、開発プロンプトまで確認できます。",
      unlockButton: "この内容を解放する",
    },
    pay: {
      badge: "決済",
      title: "フルアイデアパックをアンロック",
      subtitle: "単発購入または月額プランで即時解放。支払い後すぐ結果ページに戻ります。",
      purchaseType: "購入タイプ",
      payNow: "今すぐ支払う",
      processing: "処理中...",
      unavailableTitle: "決済を開始できません",
      missingOrder: "注文情報が見つかりません。",
      backResults: "結果に戻る",
      planSelectorBadge: "プラン選択",
      planSelectorTitle: "月額プランを選ぶ",
      planSelectorSubtitle: "期間付きプランか、最も割安な継続月額を選択できます。",
      autoRenewBadge: "継続",
      prepaidBadge: "一括",
      bestDealBadge: "最安",
      selectedPlanLabel: "選択中プラン",
      continueCheckout: "このプランで決済へ進む",
      planMonthlyHint: "月あたり {monthly}",
      orderAutoRenewHint: "{price} ドル / month で自動更新されます。いつでも見直せます。",
      orderFixedTermHint: "{months} か月分の前払いプランです。期間内で継続的に使えます。",
      planNames: {
        monthly: "1 か月プラン",
        quarterly: "3 か月プラン",
        semiannual: "半年プラン",
        auto_monthly: "継続月額プラン"
      },
      planShortNames: {
        monthly: "1 か月",
        quarterly: "3 か月",
        semiannual: "半年",
        auto_monthly: "継続月額"
      },
      planPrices: {
        monthly: "${price} / 一括  ",
        quarterly: "${price} / 一括 (${monthly} / month)",
        semiannual: "${price} / 一括 (${monthly} / month)",
        auto_monthly: "${price} / month"
      },
      planDescriptions: {
        monthly: "まず 1 か月だけ集中して試したい方向け。",
        quarterly: "複数のキーワードを比較しながら 3 か月運用したい方向け。",
        semiannual: "長めの探索期間を確保しつつ月額コストも抑えたい方向け。",
        auto_monthly: "継続利用なら最も始めやすく、月あたり単価も最安です。"
      },
      planSavingsLabel: "{percent}% お得",
      planBestValueLabel: "おすすめ",
      planBaselineHint: "通常比較: {amount} USD",
    },
    prices: {
      badge: "Pricing",
      title: "シンプルな価格で、思考から実行までを一気に進める",
      subtitle:
        "単発購入は今見ている案を深く掘るためのプラン。月額プランは継続的にアイデアを量産し、次回以降の生成数も増える builder 向けプランです。",
      oneTimeTitle: "単発プラン",
      oneTimePrice: "$9 / pack",
      oneTimeDescription: "現在の 1 パックだけをすぐに深掘りしたい人向け。",
      subscriptionTitle: "月額 Builder プラン",
      subscriptionPrice: "$29 / month",
      subscriptionDescription: "継続的に案を試し、比較し、毎月複数の方向性を検証したい人向け。",
      nextGenerationBonus: "月額プランは有効化後、次回生成から 8 件の idea を返します。",
      includedTitle: "含まれる内容",
      recommendedBadge: "おすすめ",
      subscribeNow: "月額プランを購入",
      subscribingNow: "決済へ移動中...",
      subscriptionSuccess: "月額プランの購入が完了しました。次回生成から 8 件の idea を利用できます。",
      oneTimeFeatures: [
        "現在の pack の全 idea を即時アンロック",
        "詳細 ASO と説明文",
        "MVP 機能提案",
        "V1 ロードマップ",
        "AI 開発 prompt kit",
        "AI ローンチ prompt kit",
        "Markdown エクスポート",
        "比較用の signal summary"
      ],
      subscriptionFeatures: [
        "月 20 回の生成枠",
        "月 20 回のダウンロード枠",
        "次回生成から 8 件の拡張 idea",
        "生成時に pack が自動アンロック",
        "継続的な比較・再生成に向いた運用",
        "毎回フル build package を取得",
        "高速な方向性比較",
        "反復的な AI builder ワークフローに最適"
      ],
      comparisonNote: "単発は 1 回の深掘り、月額は毎月の探索速度を上げるプランです。",
    },
    docs: {
      badge: "Doc",
      title: "App Idea Finder の使い方",
      subtitle: "1 つのキーワードから、作る価値のあるアプリ案を短時間で広げ、比較し、すぐに実装に移れるように設計されています。",
      sections: [
        {
          title: "1. キーワードを入力する",
          body: "広すぎないテーマを 1 つ入れるだけで十分です。複雑な調査や大量の条件入力は不要です。",
          bullets: ["ニッチを 1 語で試せる", "最初の思考コストが低い", "モバイルでもすぐ試せる"],
        },
        {
          title: "2. まず無料の 2 件で方向性を判断する",
          body: "最初の 2 件で、対象ユーザー、収益性、ポジショニングが自分に合うかをすぐ確認できます。",
          bullets: ["何を作るかを素早く決められる", "無駄なブレスト時間を減らせる", "最初の手応えを確認できる"],
        },
        {
          title: "3. 有料で build-ready な内容まで取得する",
          body: "購入後は ASO だけではなく、MVP 機能、V1 構想、開発 prompt、ローンチ prompt まで一気に取得できます。",
          bullets: ["仕様化の初速が上がる", "AI coding tool にすぐ渡せる", "検証と実装がつながる"],
        },
        {
          title: "4. なぜアイデア出しが速くなるのか",
          body: "本ツールは数値表やダッシュボードを見せる代わりに、軽量な App Store シグナルを裏側で要約し、判断に必要な形だけを提示します。",
          bullets: ["情報過多になりにくい", "決断に必要な粒度だけ見せる", "インスピレーションと実行をつなげる"],
        }
      ],
    },
  },
  en: {
    common: {
      appName: "App Idea Finder",
      home: "Home",
      prices: "Prices",
      docs: "Doc",
      newSearch: "New Search",
      backHome: "Back Home",
      copyAll: "Copy All",
      copied: "Copied",
      exportMarkdown: "Export Markdown",
      loading: "Loading...",
      retry: "Retry",
      language: "Language",
      market: "Market",
      keyword: "Keyword",
      oneTime: "One-Time",
      subscription: "Subscription",
      monthlyPlan: "Monthly Plan",
      monthlyQuota: "Monthly Quota",
    },
    home: {
      badge: "Decide What To Build",
      title: "Find your next buildable app idea in minutes",
      subtitle:
        "Enter one keyword to get app ideas, lightweight App Store signals, launch-ready ASO, and developer prompt kits.",
      placeholder: "For example: pet care, budget planner, study schedule...",
      generate: "Generate Ideas",
      generating: "Generating...",
      emptyKeyword: "Please enter a keyword.",
      simpleInputTitle: "Simple Input",
      simpleInputBody: "Start with one keyword. No tables, no dashboards, no clutter.",
      actionableCardsTitle: "Actionable Cards",
      actionableCardsBody: "Each idea includes target users, monetization signals, ASO, and product direction.",
      fastUnlockTitle: "Fast Unlock",
      fastUnlockBody: "The first 2 ideas are free. Unlock the full pack or use a monthly plan when you're ready.",
      signalTitle: "Light Market Signals",
      signalBody: "The backend can summarize lightweight App Store signals while keeping the page simple.",
      trendingTitle: "Trending keyword sparks",
      trendingBody: "The 5 shortcut tags are randomized from a trending keyword pool instead of staying fixed.",
      autoKeywordHint: "If you leave the keyword empty, the system will automatically generate from a trending keyword.",
      refreshKeywords: "Refresh Keywords",
      refreshingKeywords: "Refreshing...",
      usageToday: "Today's generations",
      remainingToday: "Remaining before upgrade prompt",
      upgradeTitle: "Need more idea volume?",
      upgradeBody: "You have already generated 3 or more times today. The monthly plan gives you 8 ideas from the next generation onward and makes comparison workflows much easier.",
      upgradeCta: "See Prices",
    },
    results: {
      title: "Idea Pack",
      generatingTitle: "Generating your idea pack...",
      generatingBody: "This usually takes a few seconds. The page refreshes automatically.",
      errorTitle: "Unable to load results",
      unlockedTitle: "Unlocked",
      unlockedBody: "You can now review, copy, and export the full pack.",
      paywallTitle: "Unlock the full idea pack",
      paywallBody:
        "There are {count} more ideas waiting. Each paid idea includes deeper ASO, feature scope, MVP guidance, and build prompts.",
      unlockCta: "Unlock Full Idea Pack",
      preparing: "Preparing...",
      totalIdeas: "total ideas",
      freeIdeas: "free ideas",
      moreIdeas: "more ideas",
      processingStatus: "Processing",
      failedStatus: "Failed",
      refreshHint: "If the page does not refresh automatically, please retry.",
      unlockPackLabel: "Buy This Pack",
      subscribeLabel: "Use Monthly Plan",
      activeSubscription: "Monthly Plan Active",
      activeSubscriptionBody: "This pack is available under your monthly quota with no extra payment.",
      purchaseIncluded: "This pack is included in your monthly plan.",
      oneTimeTitle: "Unlock only this pack",
      oneTimeBody: "Best when you only want to go deeper on the keyword in front of you.",
      oneTimeFeatures: ["Unlocks only the current pack", "No ongoing generation benefits", "Good for a one-off check"],
      subscriptionTitle: "Use a plan for ongoing idea discovery",
      subscriptionPrice: "From ${price} / month",
      subscriptionBody: "You unlock this pack now and also get better value for repeated generations, comparisons, and future idea exploration.",
      subscriptionFeatures: [
        "Unlock this pack with your plan quota",
        "8 ideas from your next generation onward",
        "Better for compare-and-iterate workflows",
        "Lower effective cost if you keep exploring"
      ],
      subscriptionHint: "The next screen lets you choose 1 month, 3 months, 6 months, or continuous monthly.",
      subscriptionRecommended: "Recommended",
      previewCompleteTitle: "Review the free preview first",
      previewCompleteBody: "If the direction looks promising, use the unlock options below to buy once or switch to a monthly plan.",
      viewUnlockOptions: "See unlock options",
    },
    ideaCard: {
      locked: "Locked",
      idea: "Idea",
      targetUsers: "Target Users",
      why: "Hook & Differentiator",
      signalSummary: "Signal Summary",
      aso: "App Messaging",
      title: "App Name",
      subtitle: "Short Hook",
      heroHook: "Hero Hook",
      description: "Store Description",
      keywords: "Keywords",
      valueBullets: "Value Bullets",
      paywallCopy: "Upgrade Copy",
      buildPackage: "Build Plan & Prompt Kit",
      productSummary: "Concept Summary",
      mvpFeatures: "Core MVP Features",
      v1Roadmap: "V1 Roadmap",
      devPromptKit: "Dev Prompt Kit",
      launchPromptKit: "Launch Prompt Kit",
      lockedBody: "Unlock to view the hook, messaging, product scope, and AI-ready build prompts.",
      unlockButton: "Unlock this content",
    },
    pay: {
      badge: "Payment",
      title: "Unlock the full idea pack",
      subtitle: "Choose a one-time purchase or monthly plan. You return to the results page right after payment.",
      purchaseType: "Purchase Type",
      payNow: "Pay Now",
      processing: "Processing...",
      unavailableTitle: "Unable to start checkout",
      missingOrder: "Order information was not found.",
      backResults: "Back to Results",
      planSelectorBadge: "Plan Select",
      planSelectorTitle: "Choose your monthly plan",
      planSelectorSubtitle: "Pick a fixed term or the most cost-effective continuous monthly option.",
      autoRenewBadge: "Auto Renew",
      prepaidBadge: "Prepaid",
      bestDealBadge: "Best Deal",
      selectedPlanLabel: "Selected Plan",
      continueCheckout: "Continue to Checkout",
      planMonthlyHint: "{monthly} / month",
      orderAutoRenewHint: "Renews automatically at ${price} / month until you change it.",
      orderFixedTermHint: "This is a prepaid {months}-month plan for sustained idea exploration.",
      planNames: {
        monthly: "1-Month Plan",
        quarterly: "3-Month Plan",
        semiannual: "6-Month Plan",
        auto_monthly: "Continuous Monthly"
      },
      planShortNames: {
        monthly: "1 month",
        quarterly: "3 months",
        semiannual: "6 months",
        auto_monthly: "continuous monthly"
      },
      planPrices: {
        monthly: "${price} prepaid",
        quarterly: "${price} prepaid (${monthly} / month)",
        semiannual: "${price} prepaid (${monthly} / month)",
        auto_monthly: "${price} / month"
      },
      planDescriptions: {
        monthly: "Best if you want a short focused validation cycle.",
        quarterly: "A good fit for comparing several keywords over a few months.",
        semiannual: "Lower average monthly cost for a longer exploration window.",
        auto_monthly: "The most flexible and lowest monthly starting price for active builders."
      },
      planSavingsLabel: "Save {percent}%",
      planBestValueLabel: "Best Value",
      planBaselineHint: "Standard price: {amount} USD",
    },
    prices: {
      badge: "Pricing",
      title: "Simple pricing for turning ideas into build-ready plans",
      subtitle:
        "The one-time option is for going deep on the pack in front of you. The monthly plan is for makers who want to generate, compare, and validate ideas continuously.",
      oneTimeTitle: "One-Time Pack",
      oneTimePrice: "$9 / pack",
      oneTimeDescription: "Best for validating one keyword deeply right now.",
      subscriptionTitle: "Monthly Builder Plan",
      subscriptionPrice: "$29 / month",
      subscriptionDescription: "Best for repeat builders who want more idea volume and faster iteration.",
      nextGenerationBonus: "After subscription activation, your next generation returns 8 ideas instead of 6.",
      includedTitle: "What You Get",
      recommendedBadge: "Recommended",
      subscribeNow: "Buy Monthly Plan",
      subscribingNow: "Redirecting...",
      subscriptionSuccess: "Monthly plan purchased successfully. Your next generation will include 8 ideas.",
      oneTimeFeatures: [
        "Instant unlock for the current pack",
        "Full ASO block with description",
        "MVP feature scope",
        "V1 roadmap suggestions",
        "AI-ready dev prompt kit",
        "AI-ready launch prompt kit",
        "Markdown export",
        "Signal summaries for positioning"
      ],
      subscriptionFeatures: [
        "20 generations per month",
        "20 downloads per month",
        "8 ideas from the next generation onward",
        "New subscribed packs unlock automatically",
        "Built for compare-and-iterate workflows",
        "Full build package on every generation",
        "Better throughput for serious makers",
        "Ideal for AI-assisted shipping loops"
      ],
      comparisonNote: "One-time helps you go deep once. Monthly helps you explore faster every week.",
    },
    docs: {
      badge: "Doc",
      title: "How to use App Idea Finder",
      subtitle: "The product is designed to turn one keyword into clear, buildable product directions without forcing you through heavy analytics.",
      sections: [
        {
          title: "1. Start with one keyword",
          body: "Use a niche, a workflow, or a user problem. You do not need a full market brief to begin.",
          bullets: ["Low-friction input", "Fast on desktop and mobile", "Good for rapid idea exploration"],
        },
        {
          title: "2. Use the first 2 ideas to judge direction",
          body: "The free preview lets you quickly decide whether the niche is interesting before paying.",
          bullets: ["See the positioning fast", "Check monetization logic", "Filter weak directions early"],
        },
        {
          title: "3. Unlock the build package when it feels promising",
          body: "Paid content gives you more than ASO. It gives you product framing, MVP scope, roadmap ideas, and prompts you can use in AI coding tools.",
          bullets: ["Move from idea to implementation", "Get launch guidance too", "Export and reuse everything"],
        },
        {
          title: "4. Why it helps creativity move faster",
          body: "Instead of showing keyword tables and dashboards, the product compresses lightweight market signals into human-readable idea cards so you can make decisions faster.",
          bullets: ["Less analysis paralysis", "More momentum", "Better idea collisions for solo builders"],
        }
      ],
    },
  },
  "zh-CN": {
    common: {
      appName: "App Idea Finder",
      home: "首页",
      prices: "Prices",
      docs: "Doc",
      newSearch: "重新搜索",
      backHome: "返回首页",
      copyAll: "复制全部",
      copied: "已复制",
      exportMarkdown: "导出 Markdown",
      loading: "加载中...",
      retry: "重试",
      language: "语言",
      market: "市场",
      keyword: "关键词",
      oneTime: "单次购买",
      subscription: "订阅",
      monthlyPlan: "包月方案",
      monthlyQuota: "月度额度",
    },
    home: {
      badge: "帮助你决定做什么",
      title: "快速找到下一个值得做的 App 点子",
      subtitle: "输入一个关键词，获得可落地的 App 创意、轻量 App Store 信号，以及可直接使用的 ASO 和开发提示词。",
      placeholder: "例如：宠物护理、记账、学习计划...",
      generate: "生成点子",
      generating: "生成中...",
      emptyKeyword: "请输入关键词。",
      simpleInputTitle: "输入简单",
      simpleInputBody: "只输入一个关键词，不需要表格和复杂看板。",
      actionableCardsTitle: "可执行卡片",
      actionableCardsBody: "每个点子都包含目标用户、变现信号、ASO 和产品方向。",
      fastUnlockTitle: "快速解锁",
      fastUnlockBody: "前 2 个点子免费，感兴趣后可按次购买或包月解锁。",
      signalTitle: "轻量真实信号",
      signalBody: "后台可接入轻量 App Store 信号摘要，但前台仍保持极简展示。",
      trendingTitle: "热门关键词灵感",
      trendingBody: "页面上的 5 个快捷标签不再固定，而是从热门关键词池中随机展示。",
      autoKeywordHint: "如果关键词留空，系统会自动选一个热门关键词来生成结果。",
      refreshKeywords: "刷新关键词",
      refreshingKeywords: "刷新中...",
      usageToday: "今日生成次数",
      remainingToday: "触发升级提示前剩余",
      upgradeTitle: "如果你想持续高频探索，建议升级包月",
      upgradeBody: "你今天已经生成了 3 次以上。升级包月后，从下一次生成开始就能获得 8 个 idea，更适合持续比较与筛选。",
      upgradeCta: "查看定价",
    },
    results: {
      title: "点子包",
      generatingTitle: "正在生成你的点子...",
      generatingBody: "通常只需要几秒，页面会自动刷新。",
      errorTitle: "无法加载结果",
      unlockedTitle: "已解锁",
      unlockedBody: "现在可以查看、复制并导出完整点子包。",
      paywallTitle: "解锁完整点子包",
      paywallBody: "还有 {count} 个点子待解锁，每个都包含更完整的 ASO、功能建议、MVP 范围和开发提示词。",
      unlockCta: "解锁完整点子包",
      preparing: "准备中...",
      totalIdeas: "总点子数",
      freeIdeas: "免费点子",
      moreIdeas: "剩余点子",
      processingStatus: "生成中",
      failedStatus: "生成失败",
      refreshHint: "如果没有自动刷新，请手动重试。",
      unlockPackLabel: "购买当前方案",
      subscribeLabel: "使用包月方案",
      activeSubscription: "包月已生效",
      activeSubscriptionBody: "当前点子包已包含在你的月度额度内，无需额外支付。",
      purchaseIncluded: "当前方案已包含在你的包月权益中。",
      oneTimeTitle: "只解锁当前点子包",
      oneTimeBody: "适合你只想深入看这一次结果，不打算持续生成时。",
      oneTimeFeatures: ["仅解锁当前结果", "不包含后续持续权益", "适合一次性判断"],
      subscriptionTitle: "用包月持续生成和比较更划算",
      subscriptionPrice: "${price} / 月起",
      subscriptionBody: "除了本次点子包解锁，还能让你后续持续生成、比较方向时更省钱、更高效。",
      subscriptionFeatures: [
        "当前点子包也可直接解锁",
        "下一次生成开始可获得 8 个点子",
        "更适合持续比较和反复筛选",
        "长期使用比单次购买更划算"
      ],
      subscriptionHint: "下一步可选择 1 个月、3 个月、半年或连续包月。",
      subscriptionRecommended: "推荐",
      previewCompleteTitle: "先看结果，再决定是否解锁",
      previewCompleteBody: "你可以先浏览上面的免费预览，确认方向值得做后，再看下方的单次购买或包月方案。",
      viewUnlockOptions: "查看解锁方案",
    },
    ideaCard: {
      locked: "已锁定",
      idea: "点子",
      targetUsers: "目标用户",
      why: "创新点与卖点",
      signalSummary: "信号摘要",
      aso: "产品介绍文案",
      title: "应用名称",
      subtitle: "核心卖点短句",
      heroHook: "最先打动用户的一句",
      description: "介绍文案",
      keywords: "关键词",
      valueBullets: "价值亮点",
      paywallCopy: "付费引导文案",
      buildPackage: "开发思路与提示词",
      productSummary: "产品概念摘要",
      mvpFeatures: "优先开发的核心功能",
      v1Roadmap: "V1 路线图",
      devPromptKit: "开发提示词",
      launchPromptKit: "上线提示词",
      lockedBody: "解锁后可查看创新点、介绍文案、功能方案和 AI 开发提示词。",
      unlockButton: "解锁这部分内容",
    },
    pay: {
      badge: "支付",
      title: "解锁完整点子包",
      subtitle: "支持单次购买或包月，支付后立刻返回结果页。",
      purchaseType: "购买类型",
      payNow: "立即支付",
      processing: "处理中...",
      unavailableTitle: "无法打开支付",
      missingOrder: "未找到订单信息。",
      backResults: "返回结果页",
      planSelectorBadge: "套餐选择",
      planSelectorTitle: "选择包月套餐",
      planSelectorSubtitle: "可选择固定时长套餐，或更优惠的连续包月。",
      autoRenewBadge: "连续包月",
      prepaidBadge: "固定时长",
      bestDealBadge: "更优惠",
      selectedPlanLabel: "当前选择",
      continueCheckout: "按此套餐去支付",
      planMonthlyHint: "折合每月 {monthly}",
      orderAutoRenewHint: "将按 ${price} / 月连续续费，适合长期持续找方向。",
      orderFixedTermHint: "这是 {months} 个月固定时长套餐，适合阶段性集中使用。",
      planNames: {
        monthly: "1 个月套餐",
        quarterly: "3 个月套餐",
        semiannual: "半年套餐",
        auto_monthly: "连续包月套餐"
      },
      planShortNames: {
        monthly: "1 个月",
        quarterly: "3 个月",
        semiannual: "半年",
        auto_monthly: "连续包月"
      },
      planPrices: {
        monthly: "${price} / 一次性",
        quarterly: "${price} / 一次性 (${monthly} / 月)",
        semiannual: "${price} / 一次性 (${monthly} / 月)",
        auto_monthly: "${price} / 月"
      },
      planDescriptions: {
        monthly: "适合先短期体验，集中验证 1 个到多个关键词。",
        quarterly: "适合连续做几轮生成、比较和筛选。",
        semiannual: "适合长期寻找方向，平均月成本更低。",
        auto_monthly: "最灵活，也最适合长期高频使用，月均门槛最低。"
      },
      planSavingsLabel: "省 {percent}%",
      planBestValueLabel: "性价比最高",
      planBaselineHint: "常规定价对比：{amount} USD",
    },
    prices: {
      badge: "定价",
      title: "透明定价，把想法直接推进到可执行方案",
      subtitle:
        "单次购买适合你对当前这组方案做深入判断；包月适合持续生成、比较、筛选方向，并从下一次生成开始获得更多 idea 数量。",
      oneTimeTitle: "单次方案",
      oneTimePrice: "$9 / 次",
      oneTimeDescription: "适合当前就想把这一个关键词深入拆开的用户。",
      subscriptionTitle: "包月 Builder 方案",
      subscriptionPrice: "$29 / 月",
      subscriptionDescription: "适合会频繁尝试新方向、持续做验证和生成的独立开发者。",
      nextGenerationBonus: "包月生效后，从下一次生成开始，idea 数量会从 6 个提升到 8 个。",
      includedTitle: "包含权益",
      recommendedBadge: "推荐",
      subscribeNow: "购买包月方案",
      subscribingNow: "正在跳转支付...",
      subscriptionSuccess: "包月购买成功。你从下一次生成开始可获得 8 个 idea。",
      oneTimeFeatures: [
        "立即解锁当前点子包",
        "完整 ASO 标题、副标题、描述、关键词",
        "MVP 功能建议",
        "V1 路线图建议",
        "AI 开发提示词方案",
        "AI 上线与验证提示词方案",
        "Markdown 下载导出",
        "信号摘要辅助定位"
      ],
      subscriptionFeatures: [
        "每月 20 次生成额度",
        "每月 20 次下载额度",
        "从下一次生成开始获得 8 个点子",
        "新生成的方案自动解锁",
        "更适合持续比较与反复筛选",
        "每次都拿到完整 build package",
        "提升每月探索效率",
        "更适合 AI builder 的迭代工作流"
      ],
      comparisonNote: "单次更适合当前这个方案，包月更适合长期找方向和持续出方案。",
    },
    docs: {
      badge: "文档",
      title: "如何使用 App Idea Finder",
      subtitle: "这个工具的目标不是做复杂分析，而是帮助你从一个关键词快速碰撞出多个值得做、能赚钱、可直接开始构建的方向。",
      sections: [
        {
          title: "1. 输入一个关键词即可开始",
          body: "你不需要准备完整调研，只要从一个细分主题、用户问题或工作流出发即可。",
          bullets: ["输入门槛低", "适合快速试错", "手机和桌面都能直接使用"],
        },
        {
          title: "2. 先用前 2 个免费结果判断方向",
          body: "免费结果会先告诉你用户是谁、为什么值得做、能否赚钱，帮助你迅速过滤掉弱方向。",
          bullets: ["快速判断方向是否成立", "先看价值感再决定是否购买", "降低无效 brainstorm 时间"],
        },
        {
          title: "3. 购买后拿到完整执行包",
          body: "购买后不仅是更多 idea，还包括完整 ASO、MVP 范围、路线图、开发提示词和上线提示词。",
          bullets: ["从灵感直接过渡到执行", "可直接喂给 AI 编码工具", "也适合做 landing page 和验证"],
        },
        {
          title: "4. 为什么它能帮助你更快碰撞灵感",
          body: "它不会让你看复杂表格，而是把轻量市场信号压缩成可理解的 idea card，让你更快形成对比与联想。",
          bullets: ["减少分析负担", "提升创意碰撞速度", "更容易做出下一步决策"],
        }
      ],
    },
  },
};

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
