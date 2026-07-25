param(
  [Parameter(Mandatory = $true)]
  [string]$WorkspaceRoot
)

$stateRoot = Join-Path $WorkspaceRoot '.vscode-test'

if (Test-Path -LiteralPath $stateRoot) {
  Remove-Item -LiteralPath $stateRoot -Recurse -Force
}

New-Item -ItemType Directory -Path (Join-Path $stateRoot 'user-data') -Force | Out-Null
