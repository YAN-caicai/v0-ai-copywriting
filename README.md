✍️ AI 智能文案生成器 (AI Copywriting Generator)
这是一个基于 Next.js 和 AI SDK 开发的高效文案工具，旨在通过简单的输入，快速生成适用于小红书、朋友圈、电商等多种场景的高质量营销文案。
🚀 项目演示
• 线上地址: 
• 核心引擎: 使用 DeepSeek 大模型提供底层语义支持。
✨ 核心功能
• 多场景适配: 支持多种社交媒体风格的文案定制。
• 流式响应: 采用 toAIStreamResponse() 实现打字机般的流畅生成体验。
• 一键生成: 极简的 UI 交互，输入即所得。
🛠️ 技术栈
• 前端: React (Next.js)
• 样式: Tailwind CSS
• AI 交互: Vercel AI SDK
• 部署平台: Vercel
📦 依赖配置
为了确保项目稳定运行，本项目使用了以下核心版本组合：
⚙️ 环境变量配置
在部署到 Vercel 时，请务必在 Settings -> Environment Variables 中添加以下密钥以激活 AI 功能：
• DEEPSEEK_API_KEY: 你的 DeepSeek API 密钥。
📄 开源协议
MIT License
