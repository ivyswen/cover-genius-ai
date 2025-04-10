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

  // 处理iframe加载完成的事件
  const handleIframeLoad = () => {
    if (!iframeRef.current || !iframeRef.current.contentWindow) {
      console.log('iframeRef is not ready yet');
      return;
    }

    try {
      // 获取iframe文档
      const iframeDocument = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
      if (!iframeDocument || !iframeDocument.documentElement || !iframeDocument.body) {
        console.log('iframeDocument or its elements are not ready yet');
        return;
      }

      // 设置文档背景为白色
      iframeDocument.documentElement.style.backgroundColor = 'white';
      iframeDocument.body.style.backgroundColor = 'white';

      // 计算缩放
      updateScale();

      // 添加html2canvas和保存按钮
      setTimeout(() => {
        addHtml2CanvasAndSaveButton(iframeDocument, platform);
      }, 300);
    } catch (error) {
      console.error('Error handling iframe load:', error);
    }
  };

  // 计算并应用缩放比例
  const updateScale = () => {
    if (!containerRef.current || !iframeRef.current || !iframeRef.current.contentWindow) return;

    try {
      // 获取iframe内容尺寸
      const iframeDocument = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
      if (!iframeDocument) return;

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
          background-color: white;
        }
      `;

      // 添加或更新缩放样式
      let styleElement = iframeDocument.getElementById('scale-styles');
      if (!styleElement) {
        styleElement = iframeDocument.createElement('style');
        styleElement.id = 'scale-styles';
        iframeDocument.head?.appendChild(styleElement);
      }
      styleElement.textContent = scaleStyle;
    } catch (error) {
      console.error('更新缩放失败:', error);
    }
  };

  // 添加html2canvas脚本和保存按钮
  const addHtml2CanvasAndSaveButton = (iframeDocument: Document, platformType: string) => {
    if (!iframeDocument || !iframeDocument.documentElement || !iframeDocument.body || !iframeDocument.head) {
      console.log('iframeDocument or its elements are not ready yet');
      return;
    }

    try {
      // 如果已经有html2canvas脚本和保存按钮，则不重复添加
      if (iframeDocument.querySelector('.save-btn') || iframeDocument.querySelector('#html2canvas-script')) {
        return;
      }

      // 添加html2canvas脚本
      const html2canvasScript = iframeDocument.createElement('script');
      html2canvasScript.id = 'html2canvas-script';
      html2canvasScript.src = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js';

      // 创建保存按钮
      const saveButton = iframeDocument.createElement('button');
      saveButton.className = 'save-btn';
      saveButton.textContent = '正在加载...';
      saveButton.disabled = true;
      saveButton.style.opacity = '0.6';
      saveButton.style.cursor = 'not-allowed';
      iframeDocument.body.appendChild(saveButton);

      // 添加脚本加载完成的事件监听器
      html2canvasScript.onload = () => {
        console.log('html2canvas script loaded successfully');
        // 更新按钮状态
        saveButton.textContent = '保存封面';
        saveButton.disabled = false;
        saveButton.style.opacity = '1';
        saveButton.style.cursor = 'pointer';

        // 设置按钮点击事件
        setupSaveButtonClickHandler(saveButton, iframeDocument, platformType);
      };

      html2canvasScript.onerror = () => {
        console.error('Failed to load html2canvas script');
        // 更新按钮状态以反映错误
        saveButton.textContent = '加载失败，点击重试';
        saveButton.disabled = false;
        saveButton.style.opacity = '1';
        saveButton.style.cursor = 'pointer';

        // 点击重试加载脚本
        saveButton.onclick = () => {
          saveButton.textContent = '正在重新加载...';
          saveButton.disabled = true;
          saveButton.style.opacity = '0.6';
          saveButton.style.cursor = 'not-allowed';

          // 移除旧脚本
          const oldScript = iframeDocument.getElementById('html2canvas-script');
          if (oldScript) {
            oldScript.remove();
          }

          // 重新添加脚本
          const newScript = iframeDocument.createElement('script');
          newScript.id = 'html2canvas-script';
          newScript.src = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js';

          // 设置新脚本的加载事件
          newScript.onload = html2canvasScript.onload;
          newScript.onerror = html2canvasScript.onerror;

          iframeDocument.head.appendChild(newScript);
        };
      };

      iframeDocument.head.appendChild(html2canvasScript);

      // 添加样式
      const styleElement = iframeDocument.createElement('style');
      styleElement.textContent = `
        html, body {
          background-color: white !important;
        }
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
      `;
      iframeDocument.head.appendChild(styleElement);

      // 设置保存按钮的点击事件处理函数
      const setupSaveButtonClickHandler = (button: HTMLButtonElement, doc: Document, pType: string) => {
        button.onclick = function() {
          const platformName = pType === "xiaohongshu" ? "小红书" : "微信公众号";
          const container = doc.querySelector('.cover-container');
          if (!container) {
            alert('找不到封面元素，请确保封面已正确加载');
            return;
          }

          // 在截图前先记录原始背景色
          const originalBgColor = doc.body.style.backgroundColor;
          // 设置纯白背景以避免色块问题
          doc.body.style.backgroundColor = 'white';
          doc.documentElement.style.backgroundColor = 'white';

          // 获取html2canvas函数，优先使用iframe内部的
          const html2canvasFunc = (doc.defaultView as any).html2canvas || (window as any).html2canvas;

          // 确保html2canvas已加载
          if (!html2canvasFunc) {
            alert('html2canvas脚本尚未加载完成，请稍后再试');
            return;
          }

          // 使用html2canvas截图
          html2canvasFunc(container, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false,
            removeContainer: false,
            imageTimeout: 0,
            ignoreElements: (element: Element) => {
              return element.classList.contains('save-btn');
            }
          }).then((canvas: HTMLCanvasElement) => {
            // 恢复原始背景色
            doc.body.style.backgroundColor = originalBgColor;

            const link = doc.createElement('a');
            const now = new Date();
            const dateStr = now.getFullYear() +
                          (now.getMonth() + 1).toString().padStart(2, '0') +
                          now.getDate().toString().padStart(2, '0') +
                          '_' +
                          now.getHours().toString().padStart(2, '0') +
                          now.getMinutes().toString().padStart(2, '0');
            link.download = `${platformName}封面_${dateStr}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
          }).catch((error: Error) => {
            // 恢复原始背景色
            doc.body.style.backgroundColor = originalBgColor;
            console.error('截图错误:', error);
            alert('截图失败，请刷新页面后重试');
          });
        };
      };
    } catch (error) {
      console.error('Error in addHtml2CanvasAndSaveButton:', error);
    }
  };

  // 检测窗口大小变化并调整缩放比例
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 监听窗口大小变化
    window.addEventListener('resize', updateScale);

    // 清理函数
    return () => {
      window.removeEventListener('resize', updateScale);
    };
  }, []);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex items-center w-full mb-4 z-10 relative">
        <span className="text-sm text-gray-500 mr-4">缩放: {Math.round(scale * 100)}%</span>
        <div className="flex space-x-2"> {/* Moved buttons to the left side */}
          <button
            className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300 shadow-sm"
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
                    background-color: white;
                  }
                `;
              }
            }}
          >
            -
          </button>
          <button
            className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300 shadow-sm"
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
                    background-color: white;
                  }
                `;
              }
            }}
          >
            +
          </button>
          <button
            className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300 shadow-sm"
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
                    background-color: white;
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
          position: 'relative',
          backgroundColor: 'white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {typeof window !== 'undefined' && (
          <iframe
            ref={iframeRef}
            srcDoc={html}
            title="Preview"
            className="w-full h-full border-none"
            sandbox="allow-scripts allow-same-origin allow-downloads allow-popups"
            onLoad={handleIframeLoad}
          />
        )}
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
