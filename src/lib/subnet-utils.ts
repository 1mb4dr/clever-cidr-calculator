export interface SubnetInfo {
  networkAddress: string;
  broadcastAddress: string;
  firstHost: string;
  lastHost: string;
  totalHosts: number;
  subnetMask: string;
  cidr: number;
  networkClass: string;
}

export const calculateSubnet = (ip: string, cidr: number): SubnetInfo | null => {
  try {
    const ipParts = ip.split('.').map(Number);
    if (ipParts.length !== 4 || ipParts.some(part => isNaN(part) || part < 0 || part > 255)) {
      return null;
    }

    const ipBinary = ipParts.map(part => part.toString(2).padStart(8, '0')).join('');
    const subnetMaskBinary = '1'.repeat(cidr) + '0'.repeat(32 - cidr);
    const networkBinary = ipBinary.split('').map((bit, i) => 
      parseInt(bit) & parseInt(subnetMaskBinary[i])).join('');
    const broadcastBinary = networkBinary.slice(0, cidr) + '1'.repeat(32 - cidr);

    const networkAddress = binaryToIp(networkBinary);
    const broadcastAddress = binaryToIp(broadcastBinary);
    const totalHosts = Math.pow(2, 32 - cidr) - 2;
    
    const firstHostBinary = networkBinary.slice(0, -1) + '1';
    const lastHostBinary = broadcastBinary.slice(0, -1) + '0';

    const networkClass = getNetworkClass(ipParts[0]);
    const subnetMask = binaryToIp(subnetMaskBinary);

    return {
      networkAddress,
      broadcastAddress,
      firstHost: binaryToIp(firstHostBinary),
      lastHost: binaryToIp(lastHostBinary),
      totalHosts: totalHosts > 0 ? totalHosts : 0,
      subnetMask,
      cidr,
      networkClass,
    };
  } catch (error) {
    console.error('Error calculating subnet:', error);
    return null;
  }
};

const binaryToIp = (binary: string): string => {
  const octets = binary.match(/.{8}/g) || [];
  return octets.map(octet => parseInt(octet, 2)).join('.');
};

const getNetworkClass = (firstOctet: number): string => {
  if (firstOctet < 128) return 'A';
  if (firstOctet < 192) return 'B';
  if (firstOctet < 224) return 'C';
  if (firstOctet < 240) return 'D';
  return 'E';
};