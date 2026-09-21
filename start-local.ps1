Set-Location -LiteralPath $PSScriptRoot
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Error 'Node.js 22.13 or newer is required.'
  exit 1
}
if (-not (Test-Path -LiteralPath 'node_modules/vinext/dist/cli.js')) {
  Write-Error 'Dependencies are missing. Run npm.cmd ci in this folder first.'
  exit 1
}
Write-Host 'Starting Squirrel Labs. Open http://localhost:5173 in your browser.'
Write-Host 'Keep this terminal open. Press Ctrl+C to stop the website.'
node scripts/run-framework.mjs dev
