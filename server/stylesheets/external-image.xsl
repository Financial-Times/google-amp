<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

    <xsl:template match="img">
        <xsl:apply-templates select="current()" mode="figure-content" />
    </xsl:template>

    <xsl:template match="a[img]">
        <xsl:apply-templates select="img" mode="figure-content" />
    </xsl:template>

    <xsl:template match="p[img]">
        <xsl:apply-templates select="img" mode="figure-content" />
        <xsl:if test="count(child::node()[not(self::img)]) &gt; 0 and normalize-space(current()/text()) != ''">
            <p><xsl:apply-templates select="child::node()[not(self::img)]" /></p>
        </xsl:if>
    </xsl:template>

    <xsl:template match="p[a/img]">
        <xsl:apply-templates select="a/img" mode="figure-content" />
        <xsl:if test="count(child::node()[not(self::a)]) &gt; 0 and normalize-space(current()/text()) != ''">
            <p><xsl:apply-templates select="child::node()[not(self::a/img)]" /></p>
        </xsl:if>
    </xsl:template>

    <xsl:template match="img[string-length(@src) &gt; 0]" mode="figure-content">
        <figure class="n-content-image">
          <xsl:copy-of select="current()" />

          <xsl:if test="string-length(@longdesc) &gt; 0 or string-length(@data-copyright) &gt; 0">
            <figcaption class="n-content-image__caption">
              <xsl:if test="string-length(@longdesc) &gt; 0">
                <xsl:value-of select="@longdesc" />
              </xsl:if>
              <xsl:if test="string-length(@longdesc) &gt; 0 and string-length(@data-copyright) &gt; 0">
                <xsl:text> </xsl:text>
              </xsl:if>
              <xsl:if test="string-length(@data-copyright) &gt; 0">
                <xsl:value-of select="@data-copyright" />
              </xsl:if>
            </figcaption>
        </xsl:if>


        </figure>
    </xsl:template>

</xsl:stylesheet>
