using Microsoft.AspNetCore.Mvc;
using System.Text;
using WatchStore.Application.DTOs;
using WatchStore.Application.Interfaces;

namespace WatchStore.API.Controllers
{
  [ApiController]
  [Route("")]
  public class SEOController : ControllerBase
  {
    private readonly IWatchService _watchService;
    private readonly IBrandService _brandService;
    private readonly IConfiguration _configuration;

    public SEOController(
        IWatchService watchService,
        IBrandService brandService,
        IConfiguration configuration)
    {
      _watchService = watchService;
      _brandService = brandService;
      _configuration = configuration;
    }

    /// <summary>
    /// Generate sitemap.xml
    /// </summary>
    [HttpGet("sitemap.xml")]
    [Produces("application/xml")]
    public async Task<IActionResult> GetSitemap()
    {
      var baseUrl = _configuration["AppSettings:FrontendUrl"] ?? "http://localhost:5173";
      var sb = new StringBuilder();

      sb.AppendLine("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
      sb.AppendLine("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">");

      // Homepage
      sb.AppendLine("  <url>");
      sb.AppendLine($"    <loc>{baseUrl}/</loc>");
      sb.AppendLine($"    <lastmod>{DateTime.UtcNow:yyyy-MM-dd}</lastmod>");
      sb.AppendLine("    <changefreq>daily</changefreq>");
      sb.AppendLine("    <priority>1.0</priority>");
      sb.AppendLine("  </url>");

      // Products page
      sb.AppendLine("  <url>");
      sb.AppendLine($"    <loc>{baseUrl}/products</loc>");
      sb.AppendLine($"    <lastmod>{DateTime.UtcNow:yyyy-MM-dd}</lastmod>");
      sb.AppendLine("    <changefreq>daily</changefreq>");
      sb.AppendLine("    <priority>0.9</priority>");
      sb.AppendLine("  </url>");

      // Get all products
      var productsResponse = await _watchService.GetAllAsync(
        new WatchFilterDto(), 
        new WatchStore.Application.Common.PaginationParams
        {
          PageNumber = 1,
          PageSize = 1000
        });

      if (productsResponse.Success && productsResponse.Data?.Items != null)
      {
        foreach (var product in productsResponse.Data.Items)
        {
          sb.AppendLine("  <url>");
          sb.AppendLine($"    <loc>{baseUrl}/products/{product.Id}</loc>");
          sb.AppendLine($"    <lastmod>{DateTime.UtcNow:yyyy-MM-dd}</lastmod>");
          sb.AppendLine("    <changefreq>weekly</changefreq>");
          sb.AppendLine("    <priority>0.8</priority>");
          sb.AppendLine("  </url>");
        }
      }

      // Get all brands
      var brandsResponse = await _brandService.GetAllAsync(new WatchStore.Application.Common.PaginationParams
      {
        PageNumber = 1,
        PageSize = 1000
      });

      if (brandsResponse.Success && brandsResponse.Data?.Items != null)
      {
        foreach (var brand in brandsResponse.Data.Items)
        {
          sb.AppendLine("  <url>");
          sb.AppendLine($"    <loc>{baseUrl}/brands/{brand.Id}</loc>");
          sb.AppendLine($"    <lastmod>{brand.CreatedAt:yyyy-MM-dd}</lastmod>");
          sb.AppendLine("    <changefreq>monthly</changefreq>");
          sb.AppendLine("    <priority>0.7</priority>");
          sb.AppendLine("  </url>");
        }
      }

      // Static pages
      var staticPages = new[] { "cart", "checkout", "login", "register", "profile", "orders" };
      foreach (var page in staticPages)
      {
        sb.AppendLine("  <url>");
        sb.AppendLine($"    <loc>{baseUrl}/{page}</loc>");
        sb.AppendLine($"    <lastmod>{DateTime.UtcNow:yyyy-MM-dd}</lastmod>");
        sb.AppendLine("    <changefreq>monthly</changefreq>");
        sb.AppendLine("    <priority>0.5</priority>");
        sb.AppendLine("  </url>");
      }

      sb.AppendLine("</urlset>");

      return Content(sb.ToString(), "application/xml", Encoding.UTF8);
    }

    /// <summary>
    /// Generate robots.txt
    /// </summary>
    [HttpGet("robots.txt")]
    [Produces("text/plain")]
    public IActionResult GetRobots()
    {
      var baseUrl = _configuration["AppSettings:BaseUrl"] ?? "http://localhost:5000";
      var sb = new StringBuilder();

      sb.AppendLine("User-agent: *");
      sb.AppendLine("Allow: /");
      sb.AppendLine("");
      sb.AppendLine("# Disallow admin and API routes");
      sb.AppendLine("Disallow: /api/");
      sb.AppendLine("Disallow: /admin/");
      sb.AppendLine("Disallow: /swagger/");
      sb.AppendLine("");
      sb.AppendLine("# Disallow auth pages");
      sb.AppendLine("Disallow: /login");
      sb.AppendLine("Disallow: /register");
      sb.AppendLine("Disallow: /reset-password");
      sb.AppendLine("Disallow: /verify-email");
      sb.AppendLine("");
      sb.AppendLine("# Disallow user-specific pages");
      sb.AppendLine("Disallow: /cart");
      sb.AppendLine("Disallow: /checkout");
      sb.AppendLine("Disallow: /profile");
      sb.AppendLine("Disallow: /orders");
      sb.AppendLine("");
      sb.AppendLine($"Sitemap: {baseUrl}/sitemap.xml");

      return Content(sb.ToString(), "text/plain", Encoding.UTF8);
    }
  }
}
