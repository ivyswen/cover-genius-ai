"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

interface SafePreviewProps {
  html: string;
  onClose?: () => void;
  platform?: "xiaohongshu" | "wechat";
}

export default function SafePreview({ html, onClose, platform = "xiaohongshu" }: SafePreviewProps) {
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // 检测窗口大小变化并调整缩放比例
  useEffect(() => {

    // 确保html2canvas已加载并添加保存按钮
    const ensureHtml2Canvas = (iframeDocument: Document) => {
      // 如果没有html2canvas脚本，则在HTML中添加

        // 在HTML中添加html2canvas脚本
        const htmlContent = iframeDocument.documentElement.innerHTML;

        // 在</body>标签前添加按钮和脚本
        const platformName = platform === "xiaohongshu" ? "小红书" : "微信公众号";

        const newContent = htmlContent.replace('</body>', `
    <button class="save-btn" onclick="saveAsImage()">保存封面</button>

    <script>
        function saveAsImage() {
            const container = document.querySelector('.cover-container');
            if (!container) {
                alert('找不到封面元素，请确保封面已正确加载');
                return;
            }

            // 在截图前先记录原始背景色
            const originalBgColor = document.body.style.backgroundColor;
            // 设置纯白背景以避免色块问题
            document.body.style.backgroundColor = 'white';

            // 使用更多高级配置
            html2canvas(container, {
                scale: 2, // 更高的缩放比例提高清晰度
                useCORS: true, // 允许加载跨域图片
                allowTaint: true, // 允许加载跨域图片（可能会污染画布）
                backgroundColor: '#ffffff', // 设置白色背景
                logging: false, // 关闭日志以提高性能
                removeContainer: false, // 不移除临时创建的容器
                imageTimeout: 0, // 禁用图片加载超时
                ignoreElements: (element) => {
                    // 忽略保存按钮自身
                    return element.classList.contains('save-btn');
                }
            }).then(canvas => {
                // 恢复原始背景色
                document.body.style.backgroundColor = originalBgColor;

                const link = document.createElement('a');
                const now = new Date();
                const dateStr = now.getFullYear() +
                               (now.getMonth() + 1).toString().padStart(2, '0') +
                               now.getDate().toString().padStart(2, '0') +
                               '_' +
                               now.getHours().toString().padStart(2, '0') +
                               now.getMinutes().toString().padStart(2, '0');
                link.download = '${platformName}封面_' + dateStr + '.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            }).catch(error => {
                // 恢复原始背景色
                document.body.style.backgroundColor = originalBgColor;
                console.error('截图错误:', error);
                alert('截图失败，请刷新页面后重试');
            });
        }
    </script>
</body>`.replace('${platformName}', platformName));

        // 在</head>标签前添加html2canvas脚本和save-btn的CSS样式
        const finalContent = newContent.replace('</head>', `
    <script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>
    <style>
        .save-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #ff6b8b;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 20px;
            cursor: pointer;
            font-weight: bold;
            z-index: 100;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
        }
        .save-btn:hover {
            background-color: #ff4d73;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            transform: translateY(-2px);
        }
    </style>
</head>`);

        // 重写整个HTML文档
        // 注意：iframeDocument.write已弃用，但在这种情况下是最直接的方法
        iframeDocument.open();
        iframeDocument.write(finalContent);
        iframeDocument.close();

    };

    const updateScale = () => {
      if (!containerRef.current || !iframeRef.current || !iframeRef.current.contentWindow) return;

      try {
        // 获取iframe内容尺寸
        const iframeDocument = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
        const coverElement = iframeDocument.querySelector('.cover-container') || iframeDocument.body;

        if (!coverElement) return;

        const contentWidth = coverElement.scrollWidth;
        const contentHeight = coverElement.scrollHeight;

        // 获取容器尺寸
        const containerWidth = containerRef.current.clientWidth - 40; // 减去内边距
        const containerHeight = 600; // 预期的容器高度

        // 计算基于宽度和高度的缩放比例，选择较小的那个
        let newScale = 1;
        if (contentWidth > containerWidth) {
          newScale = containerWidth / contentWidth;
        }

        if (contentHeight > containerHeight) {
          const heightScale = containerHeight / contentHeight;
          newScale = Math.min(newScale, heightScale);
        }

        // 限制缩放范围在0.3到1之间
        const finalScale = Math.min(1, Math.max(0.3, newScale));
        setScale(finalScale);

        // 应用缩放到iframe内容
        const scaleStyle = `
          .cover-container, body > * {
            transform: scale(${finalScale});
            transform-origin: center center;
            margin: 0 auto;
          }
          body {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 0;
            overflow: hidden;
          }
        `;

        // 添加或更新缩放样式
        let styleElement = iframeDocument.getElementById('scale-styles');
        if (!styleElement) {
          styleElement = iframeDocument.createElement('style');
          styleElement.id = 'scale-styles';
          iframeDocument.head.appendChild(styleElement);
        }
        styleElement.textContent = scaleStyle;
      } catch (error) {
        console.error('更新缩放失败:', error);
      }
    };

    // 等待iframe加载完成后计算缩放并确保html2canvas已加载
    const handleIframeLoad = () => {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        const iframeDocument = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
        ensureHtml2Canvas(iframeDocument);
      }
      setTimeout(updateScale, 200);
    };

    if (iframeRef.current) {
      iframeRef.current.addEventListener('load', handleIframeLoad);
    }

    // 监听窗口大小变化
    window.addEventListener('resize', updateScale);

    return () => {
      window.removeEventListener('resize', updateScale);
      if (iframeRef.current) {
        iframeRef.current.removeEventListener('load', handleIframeLoad);
      }
    };
  }, [html]);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex items-center justify-between w-full mb-4">
        <span className="text-sm text-gray-500">缩放: {Math.round(scale * 100)}%</span>
        <div className="flex space-x-2">
          <button
            className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => {
              if (!iframeRef.current || !iframeRef.current.contentDocument) return;
              const newScale = Math.max(0.3, scale - 0.1);
              setScale(newScale);

              const styleElement = iframeRef.current.contentDocument.getElementById('scale-styles');
              if (styleElement) {
                styleElement.textContent = `
                  .cover-container, body > * {
                    transform: scale(${newScale});
                    transform-origin: center center;
                    margin: 0 auto;
                  }
                  body {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    padding: 0;
                    overflow: hidden;
                  }
                `;
              }
            }}
          >
            -
          </button>
          <button
            className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => {
              if (!iframeRef.current || !iframeRef.current.contentDocument) return;
              const newScale = Math.min(1, scale + 0.1);
              setScale(newScale);

              const styleElement = iframeRef.current.contentDocument.getElementById('scale-styles');
              if (styleElement) {
                styleElement.textContent = `
                  .cover-container, body > * {
                    transform: scale(${newScale});
                    transform-origin: center center;
                    margin: 0 auto;
                  }
                  body {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    padding: 0;
                    overflow: hidden;
                  }
                `;
              }
            }}
          >
            +
          </button>
          <button
            className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => {
              if (!iframeRef.current || !iframeRef.current.contentDocument) return;
              setScale(1);

              const styleElement = iframeRef.current.contentDocument.getElementById('scale-styles');
              if (styleElement) {
                styleElement.textContent = `
                  .cover-container, body > * {
                    transform: scale(1);
                    transform-origin: center center;
                    margin: 0 auto;
                  }
                  body {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    padding: 0;
                    overflow: hidden;
                  }
                `;
              }
            }}
          >
            重置
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="w-full bg-white border rounded-md shadow-sm overflow-hidden"
        style={{
          height: '600px',
          position: 'relative'
        }}
      >
        <iframe
          ref={iframeRef}
          srcDoc={html}
          title="Preview"
          className="w-full h-full border-none"
          sandbox="allow-scripts allow-same-origin allow-downloads allow-popups"
        />
      </div>

      {onClose && (
        <div className="mt-4 flex justify-end w-full">
          <Button
            className="bg-gray-500 hover:bg-gray-600 text-white"
            onClick={onClose}
          >
            关闭预览
          </Button>
        </div>
      )}
    </div>
  );
}
