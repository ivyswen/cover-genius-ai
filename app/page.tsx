import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CoverGenerator from "@/components/CoverGenerator/index";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">

      <main className="container mx-auto px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">AI 智能封面生成器</h1>
            <p className="text-lg text-gray-600">
              基于LLM，为你的内容生成精美的社交媒体封面
            </p>
          </div>

          <Card className="p-6 shadow-lg overflow-hidden">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b">
                <h2 className="text-2xl font-semibold text-gray-800">开始创作</h2>
                <Button variant="outline" asChild>
                  <Link href="/tutorial">
                    查看教程
                  </Link>
                </Button>
              </div>
              <CoverGenerator />
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}