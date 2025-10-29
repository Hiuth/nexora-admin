$pages = @(
    "brands",
    "attributes", 
    "pc-builds",
    "product-units",
    "subcategories",
    "configurable-products"
)

foreach ($page in $pages) {
    $filePath = "app\$page\page.tsx"
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw
        
        # Add AdminLayout import if not exists
        if ($content -notmatch "AdminLayout") {
            $content = $content -replace '("use client")', "`$1`n`nimport AdminLayout from `"@/components/admin-layout`""
            $content = $content -replace '(import.*from.*lucide-react.*)', "`$1`nimport AdminLayout from `"@/components/admin-layout`""
        }
        
        # Wrap return content with AdminLayout
        $content = $content -replace '(\s+return \(\s*<div className="p-8">)', "`n  return (`n    <AdminLayout>`n      <div className=`"space-y-6`">"
        $content = $content -replace '(\s+</div>\s+\)\s+})$', "`n      </div>`n    </AdminLayout>`n  )`n}"
        
        Set-Content $filePath $content -NoNewline
        Write-Host "Updated $filePath"
    }
}
