# Lokalna razvojna skripta za Windows
# Koristiti umesto 'npm run start:dev' kada putanja sadrzi razmake ili specijalne karaktere (&)
# Pokrenuti iz PowerShell-a: .\dev.ps1

$node = 'C:\Program Files\nodejs\node.exe'
$nest = Join-Path $PSScriptRoot 'node_modules\.bin\nest.js'
& $node $nest start --watch
