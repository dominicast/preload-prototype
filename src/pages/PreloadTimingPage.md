# PreloadTimingPage

## Anweisungen / Instructions

Darstellung aller ausgeführten Ladetasks aus den Preload-Queries anhand eines Gantt-Charts. Die Tasks sind in erster
Linie pro Contributor gruppiert, wobei die Contributor-ID der jeweiligen Gruppe als Titel ersichtlich ist. In zweiter
Linie sind die Tasks pro Entität sortiert (Feld key). Ein Task ist mit resource und key beschriftet.

### Datenmengen

Alle TanStack-Queries mit dem key AGGREGATION_PRELOAD_QUERY_KEY berücksichtigen, die jeweils Daten vom Typ
AggregationPreload unterhalten.

### Struktur AggregationPreload

Der Pfad processLog/fetchTasks beinhaltet ein Array von AggregationFetchTask.

Das Feld referenceInstant beinhaltet einen Epoch Timestamp in Millisekunden. Alle weiteren Timestamps sind
relativ zu diesem zu verstehen.

### Struktur AggregationFetchTask

Beschreibt die zeitlichen Eckdaten eines Tasks innerhalb der Ladesequenz.

Feld startInstant: Startzeitpunkt des Tasks in Millisekunden, relativ zum Feld AggregationPreload.referenceInstant

Feld endInstant: Endzeitpunkt des Tasks in Millisekunden, relativ zum Feld AggregationPreload.referenceInstant

Feld duration: Dauer des Tasks in Millisekunden

Feld key: Identifikation des zugehörigen Entität

Feld resource: Identifikation der zugehörigen Ressource
