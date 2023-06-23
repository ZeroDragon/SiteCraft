<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
 xmlns:sm="http://www.sitemaps.org/schemas/sitemap/0.9">

  <xsl:template match="/">
    <html>

      <head>
        <title>
          Sitemap
        </title>
        <meta charset="utf-8" />
        <meta http-equiv="content-type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <div class="xml">
          <h1>Sitemap</h1>
          <ul>
            <xsl:for-each select="sm:urlset/sm:url/sm:loc">
              <li class="{@level}">
                <a href="{.}"><xsl:value-of select="@title" /></a>
              </li>
            </xsl:for-each>
          </ul>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
