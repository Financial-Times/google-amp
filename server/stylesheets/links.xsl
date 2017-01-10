<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

    <xsl:template match="a">
      <xsl:if test="string-length(current()//text())> 0">
        <a href="{@href}">
          <xsl:copy-of select="@*[starts-with(name(), 'data')]" />
          <xsl:apply-templates />
        </a>
      </xsl:if>
    </xsl:template>

    <xsl:template match="a[not(@data-asset-type) and not(node())]" />

</xsl:stylesheet>
