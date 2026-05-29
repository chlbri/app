import { createSignal, onCleanup } from 'solid-js';

type Status = 'idle' | 'paused' | 'started' | 'stopped';

/**
 * Hook pour gérer un délai (sleep) avec contrôle avancé
 * @param delay - Délai en millisecondes avant de passer à true
 * @returns Un objet contenant l'état et les fonctions de contrôle
 */
export const createSleep = (delay: number = 1000, autoStart = true) => {
  const [timed, setIsTimed] = createSignal(false);
  const [status, setStatus] = createSignal<Status>('idle');
  let timeoutId: NodeJS.Timeout | undefined;
  let startTime: number = 0;
  let remainingTime: number = delay;

  /**
   * Lance le timer pour passer timed à true après le délai
   */
  const start = () => {
    if (status() !== 'idle') return;

    setIsTimed(false);
    setStatus('started');
    startTime = Date.now();
    remainingTime = delay;

    timeoutId = setTimeout(() => {
      setIsTimed(true);
      setStatus('idle');
    }, delay);
  };

  /**
   * Met en pause le timer en cours
   */
  const pause = () => {
    if (status() !== 'started') return;

    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
    remainingTime = delay - (Date.now() - startTime);
    setStatus('paused');
  };

  /**
   * Reprend le timer depuis la pause
   */
  const resume = () => {
    if (status() !== 'paused') return;

    setStatus('started');
    startTime = Date.now();

    timeoutId = setTimeout(() => {
      setIsTimed(true);
      setStatus('idle');
    }, remainingTime);
  };

  /**
   * Annule le timer en cours (stop)
   */
  const stop = () => {
    if (status() === 'stopped') return;
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
    setStatus('stopped');
    setIsTimed(false);
  };

  /**
   * Redémarre le timer (annule et relance)
   */
  const restart = () => {
    stop();
    start();
  };

  /**
   * Passe immédiatement timed à true (court-circuite le délai)
   */
  const skip = () => {
    if (status() === 'started' || status() === 'paused') {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
        timeoutId = undefined;
      }
      setIsTimed(true);
      setStatus('idle');
    }
  };

  // Démarre automatiquement
  if (autoStart) start();

  // Cleanup au démontage du composant
  onCleanup(stop);

  return {
    /**
     * Signal indiquant si le délai est écoulé (true) ou non (false)
     */
    timed,
    /**
     * Signal indiquant le statut du timer
     */
    status,
    /**
     * Lance le timer
     */
    start,
    /**
     * Met en pause le timer
     */
    pause,
    /**
     * Reprend le timer
     */
    resume,
    /**
     * Annule le timer (stop)
     */
    stop,
    /**
     * Redémarre le timer
     */
    restart,
    /**
     * Court-circuite le délai et passe immédiatement à true
     */
    skip,
  };
};
