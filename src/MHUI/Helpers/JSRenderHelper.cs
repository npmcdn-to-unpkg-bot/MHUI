using JSPool;
using Microsoft.AspNet.Mvc.Rendering;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace MHUI.Helpers
{
    public static class JSRenderHelper
    {
        public static object RenderJS(this IHtmlHelper helper, string entryPoint, object model, string bundle)
        {
            var appServices = helper.ViewContext.HttpContext.ApplicationServices;
            
            var pool = appServices.GetRequiredService<IJsPool>();
            var jsModel = JsonConvert.SerializeObject(model);


            var currentPath = helper.ViewContext.HttpContext.Request.Path.Value;
            var result = pool.GetEngine().Evaluate($"pages.{entryPoint}('{jsModel}', '{currentPath}')") as string;
            if (result == null)
            {
                var logger = appServices.GetRequiredService<ILoggerFactory>().CreateLogger("JSRender");
                logger.LogError($"JavaScript failed to return a string when calling {entryPoint}");
                throw new System.Exception();
            }
            var resultObject = JsonConvert.DeserializeObject<dynamic>(result);

            int reactId = helper.ViewContext.ViewBag.REACT__ViewId ?? 1;
            helper.ViewContext.ViewBag.REACT__ViewId = reactId + 1;


            var resultScript = $"<script src=\"/js/libs.js\"></script><script src=\"/js/{bundle}.js\" type=\"text/javascript\"></script>";
            resultScript += $"<script type=\"text/javascript\" defer>page.{entryPoint}('component-{reactId}')</script>";
            var resultHtml = $"{resultScript}<div id=\"component-{reactId}\">{resultObject.html}</div>";

            return new HtmlString(resultHtml);
        }
    }
}
