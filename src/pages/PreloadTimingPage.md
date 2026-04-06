# PreloadTimingPage

## Anweisungen / Instructions

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

Feld key: Art des Fetch-Tasks

Feld resource: Genaue Identifikation der geladenen Ressource
