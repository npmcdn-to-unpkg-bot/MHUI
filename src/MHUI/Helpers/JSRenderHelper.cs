using System;
using JSPool;
using Microsoft.AspNet.Antiforgery;
using Microsoft.AspNet.Mvc.Rendering;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.OptionsModel;
using Newtonsoft.Json;

namespace MHUI.Helpers
{
    public static class JSRenderHelper
    {
        public static object RenderJS(this IHtmlHelper helper, string entryPoint, object model, string bundle)
        {
            var appServices = helper.ViewContext.HttpContext.ApplicationServices;
            
            var pool = appServices.GetRequiredService<IJsPool>();
            var jsModel = JsonConvert.SerializeObject(new { page = model, common = GetCommonModel(helper) });

            var currentPath = helper.ViewContext.HttpContext.Request.Path.Value;
            var result = pool.GetEngine().Evaluate($"pages.{entryPoint}('{jsModel}', '{currentPath}')") as string;
            if (result == null)
            {
                var logger = appServices.GetRequiredService<ILoggerFactory>().CreateLogger("JSRender");
                logger.LogError($"JavaScript failed to return a string when calling {entryPoint}");
                throw new Exception();
            }
            var resultObject = JsonConvert.DeserializeObject<dynamic>(result);

            var resultCode = (int)resultObject.result;

            switch (resultCode)
            {
                case 500:
                    throw new System.Exception(resultObject.message);
                case 404:
                    throw new System.Exception("404");
                case 302:
                    throw new System.Exception("redirect");
            }
            int reactId = helper.ViewContext.ViewBag.REACT__ViewId ?? 1;
            helper.ViewContext.ViewBag.REACT__ViewId = reactId + 1;


            var resultScript = $"<script src=\"/js/libs.js\"></script><script src=\"/js/{bundle}.js\" type=\"text/javascript\"></script>";
            resultScript += $"<script type=\"text/javascript\" defer>page.{entryPoint}('component-{reactId}', {jsModel})</script>";

            var console = resultObject.console as string[];
            if (resultObject.console != null)
            {
                var messages = JsonConvert.SerializeObject(resultObject.console);
                resultScript += "<script type=\"text/javascript\" defer>var messages = "+messages+"; for (var m in messages) {console.log(messages[m]);}</script>";
            }

            var resultHtml = $"{resultScript}<div id=\"component-{reactId}\">{resultObject.html}</div>";

            return new HtmlString(resultHtml);
        }

        private static object GetCommonModel(IHtmlHelper helper)
        {
            var antiForgery = helper.ViewContext.HttpContext.ApplicationServices.GetRequiredService<IAntiforgery>();
            var antiForgeryOptions = helper.ViewContext.HttpContext.ApplicationServices.GetRequiredService<IOptions<AntiforgeryOptions>>();

            return new
            {
                LoggedIn = false,
                RequestVerificationToken = antiForgery.GetAndStoreTokens(helper.ViewContext.HttpContext).FormToken,
                RequestVerificationTokenName = antiForgeryOptions.Value.FormFieldName
            };
        }
    }
}
