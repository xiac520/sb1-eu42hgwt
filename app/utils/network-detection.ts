export async function detectIPVersion(): Promise<'v4' | 'v6'> {
  try {
    const response = await fetch('https://api64.ipify.org?format=json')
    const data = await response.json()
    return data.ip.includes(':') ? 'v6' : 'v4'
  } catch (error) {
    console.error('Error detecting IP version:', error)
    return 'v4' // Default to IPv4 if detection fails
  }
}

