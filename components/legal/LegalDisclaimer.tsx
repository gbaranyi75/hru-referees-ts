/** Egységes jogi figyelmeztetés a statikus jogi oldalakon */
export function LegalDisclaimer() {
  return (
    <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-950">
      <strong>Jogi nyilatkozat:</strong> Ez a dokumentum a HRU Referees alkalmazás
      működéséhez igazított <strong>szerkesztői sablon</strong>. Nem minősül jogi
      tanácsnak. A végleges szöveget, különösen az adatkezelő pontos megnevezését
      és címét, a jogalapok és megőrzési idők tételes rögzítését, valamint az ÁSZF
      felelősségi szabályait <strong>jogász vagy adatvédelmi szakértő</strong>{" "}
      érdemes véglegesítenie.
    </p>
  );
}
