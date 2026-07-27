# Derives the shipped brand images from media/logo.source.jpeg.
#
#   powershell -ExecutionPolicy Bypass -File scripts/build-logo.ps1
#
# The source is a JPEG on a white plate with a soft grey drop shadow, so it cannot be
# placed over the dark hero as-is. This flood-fills the *outer* white from the image
# borders (leaving any white enclosed by the artwork intact), un-premultiplies the
# anti-aliased edge against white so no bright fringe remains, crops to content, and
# splits the emblem from the wordmark at the empty row between them.
#
# Outputs (committed to git):
#   public/logo.png              full lockup   - light backgrounds only (navy wordmark)
#   public/logo-mark.png         emblem only   - safe on light and dark
#   public/apple-touch-icon.png  180x180
#   public/og-image.jpg          1200x630 social card
#
# Requires public/hero-poster.jpg, so run scripts/build-media.mjs first.

Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$src = Join-Path $root "media\logo.source.jpeg"
$out = Join-Path $root "public"
New-Item -ItemType Directory -Force -Path $out | Out-Null

$cs = @'
using System;
using System.Collections.Generic;

public static class Knockout {
    // The source art sits on white with a soft grey drop shadow. Both must go, or the
    // shadow reads as haze over the dark hero. Anything the flood reaches that is
    // neutral and lighter than CLEAR_AT is dropped outright; the narrow band down to
    // OPAQUE_AT preserves anti-aliased edges without reviving the shadow.
    public const int OPAQUE_AT   = 165; // minChannel <= this stays fully opaque
    public const int CLEAR_AT    = 200; // minChannel >= this becomes fully transparent
    public const int TRAVERSE_AT = 165; // flood may cross pixels at/above this
    public const int NEUTRAL_TOL = 24;  // max-min channel spread still counted as grey

    public static void Process(byte[] px, int w, int h, int stride) {
        bool[] flood = new bool[w * h];
        Queue<int> q = new Queue<int>();

        for (int x = 0; x < w; x++) { Seed(px, flood, q, w, h, stride, x, 0); Seed(px, flood, q, w, h, stride, x, h - 1); }
        for (int y = 0; y < h; y++) { Seed(px, flood, q, w, h, stride, 0, y); Seed(px, flood, q, w, h, stride, w - 1, y); }

        int[] dx = { 1, -1, 0, 0 };
        int[] dy = { 0, 0, 1, -1 };
        while (q.Count > 0) {
            int idx = q.Dequeue();
            int cx = idx % w, cy = idx / w;
            for (int k = 0; k < 4; k++) {
                int nx = cx + dx[k], ny = cy + dy[k];
                if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
                Seed(px, flood, q, w, h, stride, nx, ny);
            }
        }

        for (int y = 0; y < h; y++) {
            for (int x = 0; x < w; x++) {
                if (!flood[y * w + x]) continue;
                int i = y * stride + x * 4;   // BGRA
                int b = px[i], g = px[i + 1], r = px[i + 2];
                int mn = Math.Min(r, Math.Min(g, b));

                // Opacity rises as the pixel darkens: mn >= CLEAR_AT is pure background
                // (alpha 0), mn <= OPAQUE_AT is artwork (alpha 255).
                int a = (int)Math.Round((CLEAR_AT - mn) * 255.0 / (CLEAR_AT - OPAQUE_AT));
                if (a < 0) a = 0; if (a > 255) a = 255;

                if (a == 0) { px[i] = 0; px[i + 1] = 0; px[i + 2] = 0; px[i + 3] = 0; continue; }

                double af = a / 255.0;
                px[i]     = Unmix(b, af);
                px[i + 1] = Unmix(g, af);
                px[i + 2] = Unmix(r, af);
                px[i + 3] = (byte)a;
            }
        }
    }

    // Reverses compositing against a white backdrop: c = (c_obs - 255*(1-a)) / a.
    static byte Unmix(int observed, double a) {
        double v = (observed - 255.0 * (1.0 - a)) / a;
        if (v < 0) v = 0; if (v > 255) v = 255;
        return (byte)Math.Round(v);
    }

    static void Seed(byte[] px, bool[] flood, Queue<int> q, int w, int h, int stride, int x, int y) {
        int fi = y * w + x;
        if (flood[fi]) return;
        int i = y * stride + x * 4;
        int b = px[i], g = px[i + 1], r = px[i + 2];
        int mn = Math.Min(r, Math.Min(g, b));
        int mx = Math.Max(r, Math.Max(g, b));
        if (mn < TRAVERSE_AT) return;        // artwork, not background or shadow
        if (mx - mn > NEUTRAL_TOL) return;   // chromatic, so it belongs to the art
        flood[fi] = true;
        q.Enqueue(fi);
    }

    public static int[] Bounds(byte[] px, int w, int h, int stride, int alphaMin) {
        int minX = w, minY = h, maxX = -1, maxY = -1;
        for (int y = 0; y < h; y++)
            for (int x = 0; x < w; x++) {
                if (px[y * stride + x * 4 + 3] <= alphaMin) continue;
                if (x < minX) minX = x; if (x > maxX) maxX = x;
                if (y < minY) minY = y; if (y > maxY) maxY = y;
            }
        return new int[] { minX, minY, maxX, maxY };
    }

    public static int[] RowOccupancy(byte[] px, int w, int h, int stride, int alphaMin) {
        int[] rows = new int[h];
        for (int y = 0; y < h; y++) {
            int c = 0;
            for (int x = 0; x < w; x++) if (px[y * stride + x * 4 + 3] > alphaMin) c++;
            rows[y] = c;
        }
        return rows;
    }
}
'@
Add-Type -TypeDefinition $cs -Language CSharp

function New-HqGraphics($bitmap) {
  $g = [System.Drawing.Graphics]::FromImage($bitmap)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode     = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.PixelOffsetMode   = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  return $g
}

# --- Load and knock out --------------------------------------------------------
$jpeg = New-Object System.Drawing.Bitmap($src)
$w = $jpeg.Width; $h = $jpeg.Height
$argb = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = New-HqGraphics $argb
$g.DrawImage($jpeg, 0, 0, $w, $h)
$g.Dispose(); $jpeg.Dispose()

$rect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
$data = $argb.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadWrite, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$stride = $data.Stride
$buf = New-Object byte[] ($stride * $h)
[System.Runtime.InteropServices.Marshal]::Copy($data.Scan0, $buf, 0, $buf.Length)
[Knockout]::Process($buf, $w, $h, $stride)
[System.Runtime.InteropServices.Marshal]::Copy($buf, 0, $data.Scan0, $buf.Length)
$argb.UnlockBits($data)

$b = [Knockout]::Bounds($buf, $w, $h, $stride, 8)
Write-Host ("Content bbox: {0}x{1}" -f ($b[2]-$b[0]+1), ($b[3]-$b[1]+1))

# The emblem and wordmark are separated by an empty band; split at its thinnest row.
$rows = [Knockout]::RowOccupancy($buf, $w, $h, $stride, 8)
$splitY = 840; $splitMin = [int]::MaxValue
for ($y = 830; $y -le 910; $y++) { if ($rows[$y] -lt $splitMin) { $splitMin = $rows[$y]; $splitY = $y } }
Write-Host ("Emblem/wordmark split at y={0} (occupancy {1}px)" -f $splitY, $splitMin)

function Export-Scaled($x0, $y0, $x1, $y1, $targetW, $path) {
  $cropW = $x1 - $x0 + 1; $cropH = $y1 - $y0 + 1
  $targetH = [int][Math]::Round($cropH * $targetW / $cropW)
  $dst = New-Object System.Drawing.Bitmap($targetW, $targetH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $gg = New-HqGraphics $dst
  $srcRect = New-Object System.Drawing.Rectangle($x0, $y0, $cropW, $cropH)
  $dstRect = New-Object System.Drawing.Rectangle(0, 0, $targetW, $targetH)
  $gg.DrawImage($argb, $dstRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
  $gg.Dispose()
  $dst.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  Write-Host ("  {0}  {1}x{2}  {3} KB" -f (Split-Path -Leaf $path), $dst.Width, $dst.Height, [int]((Get-Item $path).Length / 1KB))
  return $dst
}

Write-Host "`nWrote:"
$full = Export-Scaled $b[0] $b[1] $b[2] $b[3] 640 (Join-Path $out "logo.png")
$full.Dispose()

$em = [Knockout]::Bounds($buf, $w, $splitY, $stride, 8)
$mark = Export-Scaled $em[0] $em[1] $em[2] $em[3] 360 (Join-Path $out "logo-mark.png")

# --- apple-touch-icon: emblem centred on the brand near-black -------------------
$ink = [System.Drawing.Color]::FromArgb(255, 10, 12, 16)
$touch = New-Object System.Drawing.Bitmap(180, 180, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$gt = New-HqGraphics $touch
$gt.Clear($ink)
$mw = 156; $mh = [int][Math]::Round($mark.Height * $mw / $mark.Width)
$gt.DrawImage($mark, [int]((180 - $mw) / 2), [int]((180 - $mh) / 2), $mw, $mh)
$gt.Dispose()
$touch.Save((Join-Path $out "apple-touch-icon.png"), [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host ("  apple-touch-icon.png  180x180  {0} KB" -f [int]((Get-Item (Join-Path $out "apple-touch-icon.png")).Length / 1KB))
$touch.Dispose()

# --- og-image: darkened hero frame + emblem + wordmark --------------------------
$posterPath = Join-Path $out "hero-poster.jpg"
if (-not (Test-Path $posterPath)) { throw "Missing $posterPath - run scripts/build-media.mjs first." }

$OG_W = 1200; $OG_H = 630
$og = New-Object System.Drawing.Bitmap($OG_W, $OG_H, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$go = New-HqGraphics $og
$poster = New-Object System.Drawing.Bitmap($posterPath)
# Cover-fit the 16:9 poster into the 1.90:1 card.
$sc = [Math]::Max($OG_W / $poster.Width, $OG_H / $poster.Height)
$pw = [int][Math]::Round($poster.Width * $sc); $ph = [int][Math]::Round($poster.Height * $sc)
$go.DrawImage($poster, [int](($OG_W - $pw) / 2), [int](($OG_H - $ph) / 2), $pw, $ph)
$poster.Dispose()

# Same left-weighted scrim the hero uses, so the card matches the page.
$gradRect = New-Object System.Drawing.Rectangle(0, 0, $OG_W, $OG_H)
$grad = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
  $gradRect,
  [System.Drawing.Color]::FromArgb(245, 10, 12, 16),
  [System.Drawing.Color]::FromArgb(110, 10, 12, 16),
  [System.Drawing.Drawing2D.LinearGradientMode]::Horizontal)
$go.FillRectangle($grad, $gradRect)
$grad.Dispose()

$orange = [System.Drawing.Color]::FromArgb(255, 255, 102, 0)
$go.FillRectangle((New-Object System.Drawing.SolidBrush($orange)), 0, 0, 14, $OG_H)

$ox = 72
$ogMarkW = 300; $ogMarkH = [int][Math]::Round($mark.Height * $ogMarkW / $mark.Width)
$go.DrawImage($mark, $ox, 96, $ogMarkW, $ogMarkH)

# Arial Black stands in for Archivo here; the web page itself self-hosts Archivo.
$fTitle = New-Object System.Drawing.Font("Arial Black", 58, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$fSub   = New-Object System.Drawing.Font("Segoe UI", 27, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$fMeta  = New-Object System.Drawing.Font("Segoe UI", 23, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$white  = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$muted  = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 205, 212, 222))
$obrush = New-Object System.Drawing.SolidBrush($orange)

# Built from codepoints: this file is UTF-8 and Windows PowerShell 5.1 would otherwise
# mangle the accented characters and the middot.
$aa = [char]0x00E1; $ii = [char]0x00ED; $dot = [char]0x00B7
$services = "Enderezado y pintura $dot Mec${aa}nica $dot Polarizado $dot Tapicer${ii}a"

$ty = 96 + $ogMarkH + 34
$go.DrawString("WAHLUNG GARAGE", $fTitle, $white, $ox, $ty)
$go.FillRectangle($obrush, $ox, $ty + 78, 92, 6)
$go.DrawString($services, $fSub, $muted, $ox, $ty + 104)
$go.DrawString("TEGUCIGALPA, HONDURAS", $fMeta, $obrush, $ox, $ty + 150)

$go.Dispose()

$enc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 88L)
$og.Save((Join-Path $out "og-image.jpg"), $enc, $encParams)
Write-Host ("  og-image.jpg  1200x630  {0} KB" -f [int]((Get-Item (Join-Path $out "og-image.jpg")).Length / 1KB))

$og.Dispose(); $mark.Dispose(); $argb.Dispose()

# --- PNG -> WebP ---------------------------------------------------------------
# A 640px PNG of this illustration is 403 KB, which alone would sink the mobile
# performance budget. Lossy WebP at q88 lands at 111 KB with no visible edge halos.
# apple-touch-icon.png stays a PNG because iOS requires it.
$ffmpeg = Join-Path $root "node_modules\ffmpeg-static\ffmpeg.exe"
if (-not (Test-Path $ffmpeg)) { throw "Missing ffmpeg-static - run npm install first." }

# logo-mark is exported at 360px so the OG card and touch icon have pixels to
# work with, but the header and footer only ever display it around 66px CSS wide.
# Shipping 360px there wasted bandwidth, so the web copy is scaled to 200px --
# still 3x for the largest rendered size.
$WEB_WIDTHS = @{ "logo" = 0; "logo-mark" = 200 }

Write-Host "`nConverted to WebP:"
foreach ($name in "logo", "logo-mark") {
  $png = Join-Path $out "$name.png"
  $webp = Join-Path $out "$name.webp"
  $args = @('-hide_banner', '-loglevel', 'error', '-y', '-i', $png)
  if ($WEB_WIDTHS[$name] -gt 0) { $args += @('-vf', "scale=$($WEB_WIDTHS[$name]):-1:flags=lanczos") }
  $args += @('-c:v', 'libwebp', '-lossless', '0', '-q:v', '88', '-compression_level', '6', $webp)
  & $ffmpeg @args
  if ($LASTEXITCODE -ne 0) { throw "ffmpeg failed converting $name" }
  $before = [int]((Get-Item $png).Length / 1KB)
  $after = [int]((Get-Item $webp).Length / 1KB)
  Remove-Item $png -Force
  Write-Host ("  {0}.webp  {1} KB  (was {2} KB as PNG)" -f $name, $after, $before)
}
Write-Host ""
