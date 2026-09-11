$content = Get-Content 'css/style.css' -Encoding UTF8
$clean = $content[0..2591]
[System.IO.File]::WriteAllLines(
    (Resolve-Path 'css/style.css').Path,
    $clean,
    [System.Text.UTF8Encoding]::new($false)
)
Write-Host "CSS trimmed. New count: $($clean.Count)"
