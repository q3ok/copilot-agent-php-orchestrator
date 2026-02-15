[CmdletBinding()]
param(
    [string]$RepoRoot = "."
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$failures = New-Object System.Collections.Generic.List[string]

function Add-Failure {
    param([string]$Message)
    $script:failures.Add($Message)
    Write-Host "[FAIL] $Message" -ForegroundColor Red
}

function Add-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message"
}

function Strip-Quotes {
    param([string]$Value)
    $trimmed = $Value.Trim()
    if ($trimmed.Length -ge 2) {
        $first = $trimmed[0]
        $last = $trimmed[$trimmed.Length - 1]
        if (($first -eq '"' -and $last -eq '"') -or ($first -eq "'" -and $last -eq "'")) {
            return $trimmed.Substring(1, $trimmed.Length - 2).Trim()
        }
    }
    return $trimmed
}

$repoPath = (Resolve-Path $RepoRoot).Path
$agentDir = Join-Path $repoPath ".github/agents"
$readmePath = Join-Path $repoPath "README.md"

$requiredFrontmatterKeys = @("name", "description", "tools", "model", "target")
$allowedTools = @("vscode", "execute", "read", "agent", "edit", "search", "web", "todo")
$nonImplementingAgents = @("planner", "designer", "reviewer", "researcher")
$implementingAgents = @("coder", "fastcoder", "tester", "autoconfig")
$expectedAgents = @("orchestrator", "researcher", "planner", "designer", "coder", "fastcoder", "reviewer", "tester", "autoconfig")

# Utility agents excluded from README model table validation (they are documented separately)
$utilityAgents = @("autoconfig")

if (-not (Test-Path $agentDir)) {
    Add-Failure "Missing directory: .github/agents"
}

if (-not (Test-Path $readmePath)) {
    Add-Failure "Missing file: README.md"
}

$agentFiles = @()
if (Test-Path $agentDir) {
    $agentFiles = @(Get-ChildItem -Path $agentDir -Filter "*.agent.md" -File | Sort-Object Name)
}

if ($agentFiles.Count -eq 0) {
    Add-Failure "No .agent.md files found in .github/agents."
}

$modelsByAgent = @{}

foreach ($agentFile in $agentFiles) {
    $relativePath = Resolve-Path -Path $agentFile.FullName -Relative
    $raw = Get-Content -LiteralPath $agentFile.FullName -Raw

    if ($raw -match "(?im)\baskuser\b") {
        Add-Failure "Disallowed token 'askuser' found in $relativePath."
    }

    $frontmatterMatch = [regex]::Match(
        $raw,
        '(?s)^(?:`{3,4}chatagent\s*\r?\n)?---\r?\n(.*?)\r?\n---'
    )

    if (-not $frontmatterMatch.Success) {
        Add-Failure "Could not parse chatagent frontmatter in $relativePath."
        continue
    }

    $frontmatter = $frontmatterMatch.Groups[1].Value
    $fields = @{}

    foreach ($line in ($frontmatter -split "\r?\n")) {
        if ($line -match "^\s*([a-zA-Z0-9_-]+)\s*:\s*(.+?)\s*$") {
            $key = $Matches[1].ToLowerInvariant()
            $value = $Matches[2]
            if (-not $fields.ContainsKey($key)) {
                $fields[$key] = $value
            }
        }
    }

    foreach ($requiredKey in $requiredFrontmatterKeys) {
        if (-not $fields.ContainsKey($requiredKey)) {
            Add-Failure "Missing frontmatter key '$requiredKey' in $relativePath."
        }
    }

    if (-not $fields.ContainsKey("name")) {
        continue
    }

    $agentName = (Strip-Quotes $fields["name"]).ToLowerInvariant()
    if (-not $agentName) {
        Add-Failure "Empty agent name in $relativePath."
        continue
    }

    if ($fields.ContainsKey("model")) {
        $modelsByAgent[$agentName] = Strip-Quotes $fields["model"]
    }

    if (-not $fields.ContainsKey("tools")) {
        continue
    }

    $toolsRaw = $fields["tools"].Trim()
    if ($toolsRaw -notmatch "^\[(.*)\]$") {
        Add-Failure "Frontmatter tools must use YAML list syntax [a, b, c] in $relativePath."
        continue
    }

    $tools = New-Object System.Collections.Generic.List[string]
    $inner = $Matches[1].Trim()
    if ($inner.Length -gt 0) {
        foreach ($item in ($inner -split ",")) {
            $tool = Strip-Quotes $item
            if ($tool) {
                $tools.Add($tool)
            }
        }
    }

    foreach ($tool in $tools) {
        $isAllowedCoreTool = $allowedTools -contains $tool
        $isMcpTool = $tool -match "^[A-Za-z0-9_.-]+/[A-Za-z0-9_.\-*/]+$"

        if (-not ($isAllowedCoreTool -or $isMcpTool)) {
            Add-Failure "Unknown tool '$tool' in $relativePath."
        }
    }

    if (($nonImplementingAgents -contains $agentName) -and ($tools -contains "edit")) {
        Add-Failure "Non-implementing agent '$agentName' must not include 'edit' in tools ($relativePath)."
    }

    if (($implementingAgents -contains $agentName) -and (-not ($tools -contains "edit"))) {
        Add-Failure "Implementing agent '$agentName' must include 'edit' in tools ($relativePath)."
    }
}

foreach ($expectedAgent in $expectedAgents) {
    if (-not $modelsByAgent.ContainsKey($expectedAgent)) {
        Add-Failure "Missing expected agent '$expectedAgent' in .github/agents."
    }
}

if (Test-Path $readmePath) {
    $readmeContent = Get-Content -LiteralPath $readmePath -Raw

    if ($readmeContent -match "(?im)\baskuser\b") {
        Add-Failure "Disallowed token 'askuser' found in README.md."
    }

    $readmeModels = @{}
    $modelTableMatches = [regex]::Matches(
        $readmeContent,
        '(?m)^\|\s*\*\*(?<agent>[A-Za-z]+)\*\*\s*\|\s*`(?<model>[^`]+)`\s*\|'
    )

    foreach ($match in $modelTableMatches) {
        $agent = $match.Groups["agent"].Value.ToLowerInvariant()
        $model = $match.Groups["model"].Value.Trim()
        if (-not $readmeModels.ContainsKey($agent)) {
            $readmeModels[$agent] = $model
        }
    }

    foreach ($expectedAgent in $expectedAgents) {
        # Utility agents (e.g., autoconfig) are documented separately, not in the model table
        if ($utilityAgents -contains $expectedAgent) {
            continue
        }

        if (-not $readmeModels.ContainsKey($expectedAgent)) {
            Add-Failure "README model table is missing '$expectedAgent'."
            continue
        }

        if (-not $modelsByAgent.ContainsKey($expectedAgent)) {
            continue
        }

        $agentModel = $modelsByAgent[$expectedAgent]
        $readmeModel = $readmeModels[$expectedAgent]
        if ($agentModel -ne $readmeModel) {
            Add-Failure "README model mismatch for '$expectedAgent': expected '$agentModel', found '$readmeModel'."
        }
    }

    $snippetMatch = [regex]::Match(
        $readmeContent,
        '(?s)### Adjusting models.*?```yaml\s*model:\s*(?<model>[^\r\n#]+)'
    )

    if (-not $snippetMatch.Success) {
        Add-Failure "Could not parse the model snippet under 'Adjusting models' in README.md."
    } else {
        $snippetModel = Strip-Quotes $snippetMatch.Groups["model"].Value
        $allAgentModels = @($modelsByAgent.Values)
        if ($allAgentModels -notcontains $snippetModel) {
            Add-Failure "README model snippet uses '$snippetModel', which does not match any current agent default."
        }
    }
}

# --- Validate copilot-instructions.md template ---

$templatePath = Join-Path $repoPath ".github/copilot-instructions.md"
if (Test-Path $templatePath) {
    $templateContent = Get-Content -LiteralPath $templatePath -Raw
    $fillInCount = ([regex]::Matches($templateContent, '<!-- FILL IN:')).Count
    if ($fillInCount -eq 0) {
        Add-Failure "Template .github/copilot-instructions.md contains no '<!-- FILL IN: -->' markers. It should be a template, not a filled-in config."
    } else {
        Add-Info "Template .github/copilot-instructions.md has $fillInCount FILL IN markers."
    }
} else {
    Add-Failure "Missing file: .github/copilot-instructions.md"
}

# --- Validate example files do not contain FILL IN markers ---

$examplesDir = Join-Path $repoPath "examples"
if (Test-Path $examplesDir) {
    $exampleFiles = @(Get-ChildItem -Path $examplesDir -Filter "*.md" -File)
    foreach ($exFile in $exampleFiles) {
        $exContent = Get-Content -LiteralPath $exFile.FullName -Raw
        $exRelativePath = Resolve-Path -Path $exFile.FullName -Relative
        $exFillInCount = ([regex]::Matches($exContent, '<!-- FILL IN:')).Count
        if ($exFillInCount -gt 0) {
            Add-Failure "Example file $exRelativePath still has $exFillInCount unfilled '<!-- FILL IN: -->' markers. Examples must be fully filled in."
        }
    }
    Add-Info "Validated $($exampleFiles.Count) example file(s) in examples/."
} else {
    Add-Info "No examples/ directory found (optional)."
}

if ($failures.Count -gt 0) {
    Write-Host ""
    Write-Host "Validation failed with $($failures.Count) issue(s)." -ForegroundColor Red
    exit 1
}

Add-Info "Agent and documentation validation passed."
