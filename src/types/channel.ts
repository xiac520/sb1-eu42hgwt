export interface Channel {
  id: string;  // Add unique ID field
  name: string;
  url: string;
  group?: string;
}

export interface ChannelGroup {
  name: string;
  channels: Channel[];
}