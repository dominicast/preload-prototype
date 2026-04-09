# PreloadTimingPage

## Anweisungen / Instructions

Darstellung aller ausgeführten Ladetasks aus den Preload-Queries anhand eines Gantt-Charts. Die Tasks sind in erster
Linie pro Contributor gruppiert, wobei die Contributor-ID der jeweiligen Gruppe als Titel ersichtlich ist. Sortierung 
innerhalb der Gruppe nach Dateneinheit (Feld "identifier") und Art (Feld "resource"). Ein Task ist mit im Chart mit
Dateneinheit (Feld "identifier") und Art (Feld "resource") beschriftet.

Die Gantt-Charts müssen eine gemeinsame beziehungsweise harmonisierte Zeitachse aufweisen (X-Achse) und die Tasks an der
richtigen Stelle erscheinen. Da die Felder startMillis und endMillis auf einer absoluten Zeiteinheit basieren,
können diese Felder für die Positionierung und Dauer verwendet werden. Da die Epoch Timestamps sehr grosse Zahlen
darstellen, sind sie um einen gemeinsamen Offset zu normalisieren.

### Datenmengen

Alle TanStack-Queries mit dem key AGGREGATION_PRELOAD_QUERY_KEY berücksichtigen, die jeweils Daten vom Typ
AggregationPreload unterhalten.

### Struktur AggregationPreload

Der Pfad processLog/fetchTasks beinhaltet ein Array von AggregationFetchTask.

Das Feld instantReferenceMillis beinhaltet einen Epoch Timestamp in Millisekunden. Weitere Zeitstempel mit "Instant" im
Namen (startInstant, endInstant) beziehen sich relativ auf diese Zeitbasis.

### Struktur AggregationFetchTask

Beschreibt die zeitlichen Eckdaten eines Tasks innerhalb der Ladesequenz.

- "contributor": Identifikation der allgemeinen Quelle des Ladeobjekts

- "resource": Beschreibung der Art des Ladeobjekts

- "identifier": Beschreibung der Dateneinheit auf die sich das Ladeobjekt bezieht

- "key": Technische Identifikation des exakten Ladeschlüssels (lang und kryptisch)

- "startMillis": Startzeitpunkt des Tasks als Epoch Timestamp in Millisekunden

- "endMillis": Endzeitpunkt des Tasks als Epoch Timestamp in Millisekunden

- "startInstant": Startzeitpunkt des Tasks in Millisekunden, relativ zum Feld AggregationPreload.instantReferenceMillis

- "endInstant": Endzeitpunkt des Tasks in Millisekunden, relativ zum Feld AggregationPreload.instantReferenceMillis

- "duration": Dauer des Tasks in Millisekunden
