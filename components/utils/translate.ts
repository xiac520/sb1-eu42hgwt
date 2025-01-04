import { categories } from '@/constants/categories'
import { languages } from '@/constants/languages'

// 简单的翻译映射
const translations: { [key: string]: string } = {
  "News": "新闻",
  "Sports": "体育",
  "Entertainment": "娱乐",
  "Music": "音乐",
  "Movies": "电影",
  // 添加更多翻译...
}

export function translateChannelName(name: string): string {
  // 首先检查是否有直接的翻译
  if (translations[name]) {
    return translations[name]
  }

  // 检查是否是类别名称
  const category = categories.find(c => c.name.toLowerCase() === name.toLowerCase())
  if (category) {
    return category.chineseName
  }

  // 检查是否是语言名称
  const language = languages.find(l => l.name.toLowerCase() === name.toLowerCase())
  if (language) {
    return language.chineseName
  }

  // 如果没有找到翻译，返回原始名称
  return name
}

// 这个函数可以在未来扩展为使用在线翻译服务
export async function translateChannelNameOnline(name: string): Promise<string> {
  // 在这里实现在线翻译逻辑
  // 例如，使用 Google Translate API 或其他翻译服务
  // 现在，我们只返回本地翻译的结果
  return translateChannelName(name)
}

