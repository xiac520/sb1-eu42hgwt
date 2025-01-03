export default function imageLoader({ src, width, quality }) {
  return `https://cdn.dnscron.com${src}?w=${width}&q=${quality || 75}`
}

