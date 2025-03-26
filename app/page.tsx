import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CoverGenerator from "@/components/CoverGenerator";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <Card className="p-6">
        <h1 className="text-3xl font-bold mb-6">AI Cover Generator</h1>
        <CoverGenerator />
      </Card>
    </main>
  );
}