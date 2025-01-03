export const isIPv6Available = async (): Promise<boolean> => {
  try {
    const response = await fetch('https://ipv6.google.com/generate_204', {
      mode: 'no-cors',
      timeout: 3000
    });
    return true;
  } catch {
    return false;
  }
};