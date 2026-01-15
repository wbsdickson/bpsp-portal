"use client";

import { useState, useMemo } from "react";
import HeaderPage from "@/components/header-page";
import { useTranslations, useLocale } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import LocaleTabs from "@/components/locale-tabs";

export default function FAQPage() {
  const t = useTranslations("Merchant.FAQ");
  const appLocale = useLocale();
  const [faqLocale, setFaqLocale] = useState<"en" | "ja">(
    appLocale as "en" | "ja",
  );
  const [searchQuery, setSearchQuery] = useState("");

  const faqSections = {
    en: [
      {
        title: "Security & Compliance",
        items: [
          {
            question: "Is your platform PCI-DSS compliant?",
            answer:
              "Yes, we are a PCI-DSS Level 1 Certified Service Provider. This means we adhere to the highest industry security standards to ensure all cardholder data is processed, stored, and transmitted securely.",
          },
          {
            question: "How do you protect against fraudulent transactions?",
            answer:
              "We use AI-driven fraud detection tools that analyze transaction patterns in real-time. We also support 3D Secure (3DS) and customizable velocity checks to block high-risk payments before they happen.",
          },
          {
            question: "Is data encrypted?",
            answer:
              "Absolutely. All data is encrypted using AES-256 at rest and via TLS 1.2+ during transit.",
          },
          {
            question: "Do you support KYC and AML checks?",
            answer:
              "Yes. Our system includes built-in Know Your Customer (KYC) and Anti-Money Laundering (AML) verification processes to help your business stay compliant with local and international regulations.",
          },
        ],
      },
      {
        title: "Payments & Methods",
        items: [
          {
            question: "What payment methods can I accept?",
            answer:
              "We support all major credit/debit cards (Visa, Mastercard, Amex), digital wallets (Apple Pay, Google Pay), and local payment methods like SEPA, AliPay, and iDEAL.",
          },
          {
            question: "Do you support multi-currency processing?",
            answer:
              "Yes. You can accept payments in over 135+ currencies, allowing your customers to pay in their local currency while you receive settlement in your preferred currency.",
          },
          {
            question: "Can I set up recurring billing or subscriptions?",
            answer:
              "Yes, our platform includes a robust subscription engine that handles automated billing cycles, dunning management (failed payment retries), and trial periods.",
          },
          {
            question: 'What is "Payout Timing" (Settlement)?',
            answer:
              "Standard settlements are typically processed on a T+2 or T+3 basis (transaction day plus 2-3 business days), depending on your business risk profile and region.",
          },
        ],
      },
      {
        title: "Integration & Technical",
        items: [
          {
            question:
              "How do I integrate your payment gateway into my website?",
            answer:
              "We offer several options: a pre-built Hosted Checkout page (low code), mobile SDKs (iOS/Android), and a full REST API for a completely customized checkout experience.",
          },
          {
            question: "Do you provide a sandbox environment for testing?",
            answer:
              "Yes. Every account comes with a dedicated sandbox/test mode where you can simulate transactions and test your integration before going live.",
          },
          {
            question: "Which e-commerce platforms do you support?",
            answer:
              "We provide official plugins for Shopify, WooCommerce, Magento, Prestashop, and Wix.",
          },
          {
            question: "Can I use my own UI for the payment form?",
            answer:
              'Yes. For businesses that want full control, our API and "Fields" components allow you to collect payment info while remaining PCI compliant by tokenizing sensitive data on our servers.',
          },
        ],
      },
      {
        title: "Fees & Contracts",
        items: [
          {
            question: "What is your pricing structure?",
            answer:
              'We typically operate on a "pay-as-you-go" model with a small percentage fee + a fixed transaction fee. Custom enterprise pricing is available for high-volume merchants.',
          },
          {
            question: "Are there any hidden setup or monthly fees?",
            answer:
              "Transparency is our priority. Standard accounts have no setup fees. Some advanced features (like Chargeback Protection) may have optional monthly costs.",
          },
          {
            question: 'What is a "Rolling Reserve"?',
            answer:
              "Depending on your industry risk, we may hold a small percentage of your funds for a fixed period (e.g., 5% for 30 days) to cover potential chargebacks or refunds.",
          },
          {
            question: "How do you handle chargebacks?",
            answer:
              "When a chargeback is initiated, we notify you immediately via our dashboard. You can upload evidence through our portal, and our team will assist in disputing the claim with the bank.",
          },
        ],
      },
      {
        title: "Account & Support",
        items: [
          {
            question: "How do I view my transaction reports?",
            answer:
              "Our Merchant Dashboard provides real-time analytics, downloadable CSV/PDF reports, and automated reconciliation tools.",
          },
          {
            question: "Do you offer 24/7 customer support?",
            answer:
              "Yes, our technical support team is available 24/7 via live chat and email. Enterprise clients receive a dedicated Account Manager.",
          },
          {
            question:
              "Can I manage multiple business entities under one account?",
            answer:
              'Yes, our "Multi-Entity" feature allows you to manage different brands or regional offices from a single master login.',
          },
          {
            question: "How long does the onboarding process take?",
            answer:
              "Standard business applications are usually reviewed within 24–48 hours. Once approved, you can begin processing live payments immediately.",
          },
        ],
      },
    ],
    ja: [
      {
        title: "セキュリティとコンプライアンス",
        items: [
          {
            question: "プラットフォームはPCI-DSS準拠ですか？",
            answer:
              "はい、当社はPCI-DSSレベル1認定サービスプロバイダーです。これは、すべてのカードホルダーデータが安全に処理、保存、送信されるよう、業界最高のセキュリティ基準に準拠していることを意味します。",
          },
          {
            question: "不正取引からどのように保護していますか？",
            answer:
              "リアルタイムで取引パターンを分析するAI駆動の不正検出ツールを使用しています。また、3Dセキュア（3DS）とカスタマイズ可能な速度チェックをサポートし、高リスクの支払いを事前にブロックします。",
          },
          {
            question: "データは暗号化されていますか？",
            answer:
              "はい。すべてのデータは、保存時にはAES-256で、転送時にはTLS 1.2+で暗号化されています。",
          },
          {
            question: "KYCおよびAMLチェックをサポートしていますか？",
            answer:
              "はい。当社のシステムには、ビジネスが地域および国際規制に準拠できるよう、組み込みの顧客確認（KYC）およびマネーロンダリング防止（AML）検証プロセスが含まれています。",
          },
        ],
      },
      {
        title: "支払いと方法",
        items: [
          {
            question: "どのような支払い方法を受け入れられますか？",
            answer:
              "主要なクレジット/デビットカード（Visa、Mastercard、Amex）、デジタルウォレット（Apple Pay、Google Pay）、SEPA、AliPay、iDEALなどのローカル支払い方法をサポートしています。",
          },
          {
            question: "マルチ通貨処理をサポートしていますか？",
            answer:
              "はい。135以上の通貨で支払いを受け入れることができ、お客様は現地通貨で支払い、お客様は希望する通貨で決済を受け取ることができます。",
          },
          {
            question: "定期請求やサブスクリプションを設定できますか？",
            answer:
              "はい、当社のプラットフォームには、自動請求サイクル、ダニング管理（失敗した支払いの再試行）、試用期間を処理する堅牢なサブスクリプションエンジンが含まれています。",
          },
          {
            question: "「支払いタイミング」（決済）とは何ですか？",
            answer:
              "標準的な決済は、通常、ビジネスのリスクプロファイルと地域に応じて、T+2またはT+3ベース（取引日+2-3営業日）で処理されます。",
          },
        ],
      },
      {
        title: "統合と技術",
        items: [
          {
            question:
              "支払いゲートウェイをウェブサイトに統合するにはどうすればよいですか？",
            answer:
              "いくつかのオプションを提供しています：事前構築されたホステッドチェックアウトページ（低コード）、モバイルSDK（iOS/Android）、完全にカスタマイズされたチェックアウト体験のための完全なREST API。",
          },
          {
            question: "テスト用のサンドボックス環境を提供していますか？",
            answer:
              "はい。すべてのアカウントには専用のサンドボックス/テストモードが付属しており、本番環境に移行する前に取引をシミュレートし、統合をテストできます。",
          },
          {
            question:
              "どのようなeコマースプラットフォームをサポートしていますか？",
            answer:
              "Shopify、WooCommerce、Magento、Prestashop、Wix用の公式プラグインを提供しています。",
          },
          {
            question: "支払いフォームに独自のUIを使用できますか？",
            answer:
              "はい。完全な制御を望むビジネスのために、当社のAPIと「Fields」コンポーネントにより、機密データを当社のサーバーでトークン化することで、PCI準拠を維持しながら支払い情報を収集できます。",
          },
        ],
      },
      {
        title: "料金と契約",
        items: [
          {
            question: "料金体系はどのようになっていますか？",
            answer:
              "通常、小さなパーセンテージ料金+固定取引手数料の「従量課金」モデルで運営しています。高ボリュームの加盟店向けにカスタムエンタープライズ料金が利用可能です。",
          },
          {
            question: "隠れたセットアップ料金や月額料金はありますか？",
            answer:
              "透明性を重視しています。標準アカウントにはセットアップ料金はありません。一部の高度な機能（チャージバック保護など）には、オプションの月額費用がかかる場合があります。",
          },
          {
            question: "「ローリングリザーブ」とは何ですか？",
            answer:
              "業界のリスクに応じて、潜在的なチャージバックや返金をカバーするため、一定期間（例：30日間の5％）資金の一部を保持する場合があります。",
          },
          {
            question: "チャージバックはどのように処理しますか？",
            answer:
              "チャージバックが開始されると、ダッシュボードを通じてすぐに通知します。ポータルを通じて証拠をアップロードでき、当社のチームが銀行との請求の争議を支援します。",
          },
        ],
      },
      {
        title: "アカウントとサポート",
        items: [
          {
            question: "取引レポートをどのように表示しますか？",
            answer:
              "加盟店ダッシュボードには、リアルタイム分析、ダウンロード可能なCSV/PDFレポート、自動調整ツールが用意されています。",
          },
          {
            question: "24/7カスタマーサポートを提供していますか？",
            answer:
              "はい、技術サポートチームはライブチャットとメールで24/7利用可能です。エンタープライズクライアントには専任のアカウントマネージャーが割り当てられます。",
          },
          {
            question:
              "1つのアカウントで複数のビジネスエンティティを管理できますか？",
            answer:
              "はい、当社の「マルチエンティティ」機能により、単一のマスターログインから異なるブランドや地域オフィスを管理できます。",
          },
          {
            question:
              "オンボーディングプロセスにはどのくらい時間がかかりますか？",
            answer:
              "標準的なビジネス申請は通常24〜48時間以内に審査されます。承認されると、すぐにライブ支払いの処理を開始できます。",
          },
        ],
      },
    ],
  };

  // Get FAQ sections for the selected locale
  const currentFaqSections = useMemo(() => {
    return faqSections[faqLocale] || faqSections.en;
  }, [faqLocale]);

  // Flatten all FAQ items with their section info
  const allFaqItems = useMemo(() => {
    return currentFaqSections.flatMap((section) =>
      section.items.map((item) => ({
        ...item,
        section: section.title,
      })),
    );
  }, [currentFaqSections]);

  // Filter FAQ items based on search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) {
      return allFaqItems;
    }
    const query = searchQuery.toLowerCase();
    return allFaqItems.filter(
      (item) =>
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query) ||
        item.section.toLowerCase().includes(query),
    );
  }, [allFaqItems, searchQuery]);

  // Group filtered items by section
  const groupedItems = useMemo(() => {
    const groups: Record<string, typeof allFaqItems> = {};
    filteredItems.forEach((item) => {
      if (!groups[item.section]) {
        groups[item.section] = [];
      }
      groups[item.section].push(item);
    });
    return groups;
  }, [filteredItems]);

  return (
    <HeaderPage title={t("title") || "FAQ"}>
      <div className="max-w-4xl space-y-6">
        {/* Search Input */}
        <div className="relative">
          <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
          <Input
            type="text"
            placeholder={t("searchPlaceholder") || "Search FAQ..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-card pl-9"
          />
        </div>

        {/* Locale Tabs */}
        <LocaleTabs value={faqLocale} onValueChange={setFaqLocale} />

        {/* FAQ Items */}
        {Object.keys(groupedItems).length > 0 ? (
          <div className="space-y-6">
            {Object.entries(groupedItems).map(([sectionTitle, items]) => (
              <div key={sectionTitle}>
                <div className="mb-4">
                  <h2 className="text-lg font-semibold">{sectionTitle}</h2>
                </div>
                <Accordion type="multiple" className="w-full">
                  {items.map((item, index) => (
                    <AccordionItem
                      key={`${sectionTitle}-${index}`}
                      value={`${sectionTitle}-${index}`}
                      className="border-b"
                    >
                      <AccordionTrigger className="text-sm font-medium">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        <Card>
                          <CardContent className="text-muted-foreground text-sm leading-relaxed">
                            {item.answer}
                          </CardContent>
                        </Card>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">
              {t("noResults", { searchQuery }) ||
                `No results found for "${searchQuery}"`}
            </p>
          </div>
        )}
      </div>
    </HeaderPage>
  );
}
