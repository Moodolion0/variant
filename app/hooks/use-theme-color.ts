export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: string
) {
  // Pour l'instant, on retourne une valeur par défaut pour débloquer l'affichage
  return props.light || '#000'; 
}