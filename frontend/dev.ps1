# Lokalna razvojna skripta za Windows
# Koristiti umesto 'npm run dev' kada putanja sadrzi razmake ili specijalne karaktere (&)
# Pokrenuti iz PowerShell-a: .\dev.ps1

$node = 'C:\Program Files\nodejs\node.exe'
$vite = Join-Path $PSScriptRoot 'node_modules\vite\bin\vite.js'
& $node $vite
