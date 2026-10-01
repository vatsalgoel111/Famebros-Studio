type PauseCallback = () => void;

class PlaybackLock {
  private players = new Map<string, PauseCallback>();
  private currentHolder: string | null = null;

  register(id: string, pauseFn: PauseCallback): () => void {
    this.players.set(id, pauseFn);
    return () => {
      this.players.delete(id);
      if (this.currentHolder === id) {
        this.currentHolder = null;
      }
    };
  }

  claim(id: string): void {
    this.currentHolder = id;
    this.players.forEach((pauseFn, playerId) => {
      if (playerId !== id) {
        try {
          pauseFn();
        } catch {
          // ignore any disposed instance
        }
      }
    });
  }

  release(id: string): void {
    if (this.currentHolder === id) {
      this.currentHolder = null;
    }
  }

  getCurrentHolder(): string | null {
    return this.currentHolder;
  }
}

export const playbackLock = new PlaybackLock();

export function register(id: string, pauseFn: PauseCallback): () => void {
  return playbackLock.register(id, pauseFn);
}

export function claim(id: string): void {
  playbackLock.claim(id);
}

export function release(id: string): void {
  playbackLock.release(id);
}
