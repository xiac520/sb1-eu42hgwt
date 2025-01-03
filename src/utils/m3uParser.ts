import { Channel } from '../types/channel';
import { generateUniqueId } from './uniqueId';

export const parseM3U = (content: string): Channel[] => {
  const lines = content.split('\n');
  const channels: Channel[] = [];
  const seenUrls = new Set<string>();
  let currentChannel: Partial<Channel> = {};

  lines.forEach(line => {
    line = line.trim();
    
    if (line.startsWith('#EXTINF:')) {
      const nameMatch = line.match(/,(.+)$/);
      if (nameMatch) {
        currentChannel.name = nameMatch[1].trim();
      }
      
      const groupMatch = line.match(/group-title="([^"]+)"/);
      if (groupMatch) {
        currentChannel.group = groupMatch[1];
      }
    } else if (line.startsWith('http')) {
      currentChannel.url = line;
      
      // Only add channel if we have all required fields and URL is not duplicate
      if (currentChannel.name && currentChannel.url && !seenUrls.has(currentChannel.url)) {
        seenUrls.add(currentChannel.url);
        
        // Generate a unique ID using UUID-like format
        currentChannel.id = generateUniqueId();
        
        channels.push(currentChannel as Channel);
      }
      currentChannel = {};
    }
  });

  return channels;
};