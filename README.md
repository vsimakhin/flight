# Readme


```bash
jq -c 'to_entries | map({icao: .key} + .value)' airports.json > db/airports.json
```