"use client";

export default function Footer() {
  return (
    <footer className="border-t bg-white py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} Cover Genius AI. 保留所有权利。
            </p>
            <p className="text-sm text-gray-600 mt-1">
              感谢 <a href="https://x.com/op7418" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">歸藏老师</a> 的指导与支持。
            </p>
          </div>
          <div className="flex space-x-6">
            <a
              href="https://github.com/ivyswen/cover-genius-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              GitHub
            </a>
            <a
              href="https://platform.deepseek.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              DeepSeek
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              返回顶部
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
