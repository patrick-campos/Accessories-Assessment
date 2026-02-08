param(
    [Parameter(Mandatory = $true)]
    [string]$ClientSecretPath
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path -Path $ClientSecretPath)) {
    Write-Error "File not found: $ClientSecretPath"
    exit 1
}

$json = Get-Content -Raw -Path $ClientSecretPath | ConvertFrom-Json

$clientId = $null
$clientSecret = $null

if ($json.installed) {
    $clientId = $json.installed.client_id
    $clientSecret = $json.installed.client_secret
} elseif ($json.web) {
    $clientId = $json.web.client_id
    $clientSecret = $json.web.client_secret
}

if (-not $clientId -or -not $clientSecret) {
    Write-Error "client_id/client_secret not found in JSON."
    exit 1
}

$port = 53682
$redirectUri = "http://localhost:$port/"
$scope = "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/spreadsheets"

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($redirectUri)
$listener.Start()

$authUrl = "https://accounts.google.com/o/oauth2/v2/auth" +
    "?client_id=$([uri]::EscapeDataString($clientId))" +
    "&redirect_uri=$([uri]::EscapeDataString($redirectUri))" +
    "&response_type=code" +
    "&scope=$([uri]::EscapeDataString($scope))" +
    "&access_type=offline" +
    "&prompt=consent"

Write-Host "Opening browser for consent..."
Start-Process $authUrl

Write-Host "Waiting for authorization..."
$context = $listener.GetContext()
$code = $context.Request.QueryString["code"]

$responseString = "You can close this window now."
$buffer = [Text.Encoding]::UTF8.GetBytes($responseString)
$context.Response.ContentLength64 = $buffer.Length
$context.Response.OutputStream.Write($buffer, 0, $buffer.Length)
$context.Response.OutputStream.Close()

$listener.Stop()

if (-not $code) {
    Write-Error "Authorization code not received."
    exit 1
}

$tokenResponse = Invoke-RestMethod -Method Post -Uri "https://oauth2.googleapis.com/token" -ContentType "application/x-www-form-urlencoded" -Body @{
    code = $code
    client_id = $clientId
    client_secret = $clientSecret
    redirect_uri = $redirectUri
    grant_type = "authorization_code"
}

if (-not $tokenResponse.refresh_token) {
    Write-Error "No refresh_token returned. Revoke app access and re-run."
    exit 1
}

Write-Host "REFRESH_TOKEN=$($tokenResponse.refresh_token)"
