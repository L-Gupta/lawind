# Lawind AI — deployment helper
# Run each section after creating accounts on Vercel + Railway/Render.

Write-Host "=== Lawind AI Deployment ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "STEP 1: Push code to GitHub"
Write-Host "  git add . && git commit -m 'Prepare production deployment' && git push"
Write-Host ""
Write-Host "STEP 2: Deploy backend (Railway — https://railway.app)"
Write-Host "  1. New Project -> Deploy from GitHub -> select lawind repo"
Write-Host "  2. Set Root Directory: backend"
Write-Host "  3. Add env vars:"
Write-Host "       CORS_ORIGINS=https://lawind.ai,https://www.lawind.ai"
Write-Host "       APP_ENV=production"
Write-Host "  4. Settings -> Networking -> Custom Domain -> api.lawind.ai"
Write-Host ""
Write-Host "STEP 3: Deploy frontend (Vercel — https://vercel.com)"
Write-Host "  1. New Project -> Import lawind repo"
Write-Host "  2. Set Root Directory: frontend"
Write-Host "  3. Add env var:"
Write-Host "       NEXT_PUBLIC_API_URL=https://api.lawind.ai"
Write-Host "  4. Settings -> Domains -> add lawind.ai and www.lawind.ai"
Write-Host ""
Write-Host "STEP 4: DNS records (at your domain registrar)"
Write-Host "  Vercel will show exact records when you add lawind.ai."
Write-Host "  Typical setup:"
Write-Host "    A     @      -> Vercel IP (or ALIAS if supported)"
Write-Host "    CNAME www    -> cname.vercel-dns.com"
Write-Host "    CNAME api    -> <your-railway-host>.up.railway.app"
Write-Host ""
Write-Host "STEP 5: Verify"
Write-Host "  https://lawind.ai              -> frontend loads"
Write-Host "  https://api.lawind.ai/health   -> { status: healthy }"
Write-Host ""

$choice = Read-Host "Install Vercel CLI now? (y/n)"
if ($choice -eq "y") {
    npm install -g vercel
    Write-Host "Run: vercel login" -ForegroundColor Yellow
    Write-Host "Then: cd frontend && vercel --prod" -ForegroundColor Yellow
}
