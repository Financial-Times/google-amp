<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

    <xsl:template match="p[a[@data-asset-type='interactive-graphic'] and count(node()) = 1]">
      <xsl:if test="current()[a[contains(@href, 'https')]]">
        <xsl:apply-templates select="a[@data-asset-type='interactive-graphic' and contains(@href, 'https')]" mode="interactive-graphic" />
      </xsl:if>
    </xsl:template>

    <xsl:template match="a[@data-asset-type='interactive-graphic' and contains(@href, 'https')]">
      <xsl:apply-templates select="current()" mode="interactive-graphic" />
    </xsl:template>

    <xsl:template match="a" mode="interactive-graphic">
      <iframe class="article__interactive" src="{@href}" width="{@data-width}" height="{@data-height}" scrolling="no"></iframe>
    </xsl:template>

</xsl:stylesheet>
