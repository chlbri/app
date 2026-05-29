export const convertToBase64 = (img: HTMLImageElement): string | null => {
  const canvas = document.createElement('canvas');

  try {
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);

    // Convertir en base64
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Erreur lors de la conversion en base64:', error);
    return null;
  } finally {
    // Nettoyer le canvas
    canvas.remove();
    document.body.removeChild(canvas);
  }
};
