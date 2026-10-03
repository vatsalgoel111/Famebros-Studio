import type {NextConfig} from 'next';
import {PHASE_DEVELOPMENT_SERVER} from 'next/constants';

const mediaHost = process.env.NEXT_PUBLIC_MEDIA_HOST;
type RemotePattern = {
  protocol: 'http' | 'https';
  hostname: string;
  port?: string;
  pathname: string;
};

const customMediaPattern: RemotePattern[] = [];
if (mediaHost && mediaHost.trim() !== '') {
  try {
    const raw = mediaHost.trim();
    const url = new URL(raw.startsWith('http') ? raw : `https://${raw}`);
    customMediaPattern.push({
      protocol: url.protocol.replace(':', '') as 'http' | 'https',
      hostname: url.hostname,
      port: url.port || '',
      pathname: '/**',
    });
  } catch {
    // Ignore invalid url format during static initialization
  }
}

export default function nextConfig(phase: string): NextConfig {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;

  return {
    ...(!isDev ? { output: 'export' } : {}),
    reactStrictMode: true,
    devIndicators: false,
    compress: true,
    compiler: {
      removeConsole: !isDev
        ? {
            exclude: ['error'],
          }
        : false,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: false,
    },
    images: {
      unoptimized: true,
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'picsum.photos',
          port: '',
          pathname: '/**',
        },
        ...customMediaPattern,
      ],
    },
    webpack: (config, {dev}) => {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      if (dev && process.env.DISABLE_HMR === 'true') {
        config.watchOptions = {
          ignored: /.*/,
        };
      }
      return config;
    },
  };
}
