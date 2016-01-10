using JSPool;
using Microsoft.AspNet.Mvc.Rendering;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;

namespace MHUI.Helpers
{
    public static class JSRenderHelper
    {
        public static object RenderJS(this IHtmlHelper helper, string entryPoint, object model, string bundle)
        {
            int reactId = helper.ViewContext.ViewBag.REACT__ViewId ?? 1;

            helper.ViewContext.ViewBag.REACT__ViewId = reactId + 1;

            var pool = helper.ViewContext.HttpContext.ApplicationServices.GetRequiredService<IJsPool>();
            var jsModel = JsonConvert.SerializeObject(model);
            
            var engine = pool.GetEngine();
            var result = engine.Evaluate($"pages.{entryPoint}({jsModel})") as string;
            if (result == null)
            {
                return "";
                // TODO log error

            }
            var resultObject = JsonConvert.DeserializeObject<dynamic>(result);

            var resultScript = $"<script src=\"/js/libs.js\"></script><script src=\"/js/{bundle}.js\" type=\"text/javascript\"></script>";
            resultScript += $"<script type=\"text/javascript\" defer>page.{entryPoint}('component-{reactId}')</script>";
            var resultHtml = $"{resultScript}<div id=\"component-{reactId}\">{resultObject.html}</div>";

            return new HtmlString(resultHtml);
        }
    }
}
