interface Env {
  iptv: KVNamespace
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const channelList = await context.env.iptv.get('channelList')

  if (!channelList) {
    return new Response('未找到频道列表', { status: 404 })
  }

  return new Response(channelList, {
    headers: { 'Content-Type': 'application/json' }
  })
}

