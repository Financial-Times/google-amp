<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

    <xsl:template match="pull-quote">

      <xsl:variable name="imagePaddingStyle">
        <xsl:choose>
          <xsl:when test="count(current()/pull-quote-image) > 0"> u-padding--bottom__none</xsl:when>
          <xsl:otherwise></xsl:otherwise>
        </xsl:choose>
      </xsl:variable>

      <xsl:variable name="contentPaddingStyle">
        <xsl:choose>
          <xsl:when test="count(current()/pull-quote-image) > 0"> u-padding--bottom</xsl:when>
          <xsl:otherwise></xsl:otherwise>
        </xsl:choose>
      </xsl:variable>

      <blockquote class="article__quote article__quote--pull-quote aside--content c-box c-box--inline u-border--all{$imagePaddingStyle}">
        <div class="pull-quote__quote-marks"></div>
        <div class="u-padding--left-right{$contentPaddingStyle}">
          <p><xsl:value-of select="pull-quote-text" /></p>
          <xsl:apply-templates select="pull-quote-source" />
        </div>
        <xsl:apply-templates select="pull-quote-image" />
      </blockquote>
    </xsl:template>

    <xsl:template match="pull-quote-source">
      <xsl:if test="text()">
        <footer class="article__quote-footer">
          <xsl:apply-templates select="text()" />
        </footer>
      </xsl:if>
    </xsl:template>

    <xsl:template match="pull-quote-image">
      <xsl:apply-templates select="current()/img" mode="aside-image-wrapper" />
    </xsl:template>

</xsl:stylesheet>
