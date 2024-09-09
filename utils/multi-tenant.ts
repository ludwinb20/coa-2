export const getValidSubdomain = (host?: string | null) => {
  let subdomain: string | null = null;
  let baseDomain: string | null = null;

  if (!host && typeof window !== 'undefined') {
    // En el lado del cliente, obtener el host desde window
    host = window.location.host;
  }

  if (host) {
    const domainParts = host.split('.');
    console.log(host, domainParts)
    if (domainParts.length === 1) {
      // Caso especial para localhost sin puerto
      baseDomain = host;
    } else if (domainParts.length === 2 && domainParts[1].includes(':')) {
      // Caso especial para localhost con puerto, p.ej., 'localhost:3000'
      baseDomain = domainParts[1];
      subdomain = domainParts[0];
    } else if (domainParts.length > 1) {
      if (domainParts.includes('localhost')) {
        // Caso especial para localhost con subdominio
        const localhostIndex = domainParts.indexOf('localhost');
        if (localhostIndex > 0) {
          subdomain = domainParts[localhostIndex - 1];
        }
        baseDomain = domainParts.slice(localhostIndex).join('.');
      } else {
        // Dominios normales
        baseDomain = domainParts.slice(-2).join('.');
        subdomain = domainParts.slice(0, -2).join('.');
      }
    }
  }

  console.log("************");
  console.log(subdomain, baseDomain);
  console.log("************");

  return { subdomain, baseDomain };
};