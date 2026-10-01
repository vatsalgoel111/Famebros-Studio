import { Client } from '@/types';
import { clients, getLiveClients } from '@/data/clients';
import { WALL_DRAFT_MODE } from '@/data/site';

/**
 * Returns clients for the Wall.
 * If WALL_DRAFT_MODE is true, returns every non-placeholder client in clients.ts
 * (permitted or not), with no placeholder padding.
 * Otherwise returns getLiveClients() only.
 */
export function getWallClients(): Client[] {
  if (WALL_DRAFT_MODE) {
    return clients.filter((c) => !c.isPlaceholder);
  }
  return getLiveClients();
}

/**
 * wallEnabled is true when getWallClients().length > 0.
 * Otherwise the Wall is hidden.
 */
export function isWallEnabled(): boolean {
  return getWallClients().length > 0;
}

/**
 * Returns the verified count of live partner brands who have granted showcase permission.
 * Any client count displayed on the site must strictly originate from this function.
 * Never counts draft or placeholder accounts.
 */
export function getLiveCount(): number {
  return getLiveClients().length;
}
