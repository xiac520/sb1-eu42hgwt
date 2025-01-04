export interface Language {
  name: string;
  chineseName: string;
  code: string;
  url: string;
}

export const languages: Language[] = [
  { name: 'Chinese', chineseName: '中文', code: 'zho', url: 'https://iptv-org.github.io/iptv/languages/zho.m3u' },
  { name: 'English', chineseName: '英语', code: 'eng', url: 'https://iptv-org.github.io/iptv/languages/eng.m3u' },
  { name: 'Japanese', chineseName: '日语', code: 'jpn', url: 'https://iptv-org.github.io/iptv/languages/jpn.m3u' },
  { name: 'Korean', chineseName: '韩语', code: 'kor', url: 'https://iptv-org.github.io/iptv/languages/kor.m3u' },
  { name: 'French', chineseName: '法语', code: 'fra', url: 'https://iptv-org.github.io/iptv/languages/fra.m3u' },
  { name: 'German', chineseName: '德语', code: 'deu', url: 'https://iptv-org.github.io/iptv/languages/deu.m3u' },
  { name: 'Spanish', chineseName: '西班牙语', code: 'spa', url: 'https://iptv-org.github.io/iptv/languages/spa.m3u' },
  { name: 'Italian', chineseName: '意大利语', code: 'ita', url: 'https://iptv-org.github.io/iptv/languages/ita.m3u' },
  { name: 'Russian', chineseName: '俄语', code: 'rus', url: 'https://iptv-org.github.io/iptv/languages/rus.m3u' },
  { name: 'Arabic', chineseName: '阿拉伯语', code: 'ara', url: 'https://iptv-org.github.io/iptv/languages/ara.m3u' },
  { name: 'Portuguese', chineseName: '葡萄牙语', code: 'por', url: 'https://iptv-org.github.io/iptv/languages/por.m3u' },
  { name: 'Hindi', chineseName: '印地语', code: 'hin', url: 'https://iptv-org.github.io/iptv/languages/hin.m3u' },
  { name: 'Turkish', chineseName: '土耳其语', code: 'tur', url: 'https://iptv-org.github.io/iptv/languages/tur.m3u' },
  { name: 'Polish', chineseName: '波兰语', code: 'pol', url: 'https://iptv-org.github.io/iptv/languages/pol.m3u' },
  { name: 'Ukrainian', chineseName: '乌克兰语', code: 'ukr', url: 'https://iptv-org.github.io/iptv/languages/ukr.m3u' },
];

