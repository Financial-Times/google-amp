<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

    <xsl:template match="img">
        <xsl:apply-templates select="current()" mode="figure" />
    </xsl:template>

    <xsl:template match="a[img]">
        <xsl:apply-templates select="img" mode="figure" />
    </xsl:template>

    <xsl:template match="p[img]">
        <xsl:apply-templates select="img" mode="figure" />
        <xsl:if test="count(child::node()[not(self::img)]) &gt; 0">
            <p><xsl:apply-templates select="child::node()[not(self::img)]" /></p>
        </xsl:if>
    </xsl:template>

    <xsl:template match="p[a/img]">
        <xsl:apply-templates select="a/img" mode="figure" />
        <xsl:if test="count(child::node()[not(self::a)]) &gt; 0">
            <p><xsl:apply-templates select="child::node()[not(self::a/img)]" /></p>
        </xsl:if>
    </xsl:template>

    <xsl:template match="img" mode="figure">
        <xsl:variable name="variation">
            <xsl:choose>
                <xsl:when test="@width &lt;= 150">thin</xsl:when>
                <xsl:when test="@width &lt;= 350">inline</xsl:when>
                <xsl:when test="(@width &lt; @height) and (@width &lt; 600)">inline</xsl:when>
                <xsl:when test="@width &lt; 700">center</xsl:when>
                <xsl:otherwise>full</xsl:otherwise>
            </xsl:choose>
        </xsl:variable>

        <xsl:variable name="maxWidth">
            <xsl:choose>
                <xsl:when test="@width &lt; @height and @width &gt; 350 and @width &lt; 600">350</xsl:when>
                <xsl:when test="@width &lt; 700"><xsl:value-of select="@width" /></xsl:when>
                <xsl:otherwise>700</xsl:otherwise>
            </xsl:choose>
        </xsl:variable>

        <figure class="article-image article-image--{$variation}">

            <xsl:choose>
                <xsl:when test="@width != '' and @height != ''">
                    <xsl:apply-templates select="current()" mode="placehold-image">
                        <xsl:with-param name="maxWidth" select="$maxWidth" />
                    </xsl:apply-templates>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:apply-templates select="current()" mode="dont-placehold-image">
                        <xsl:with-param name="maxWidth" select="$maxWidth" />
                    </xsl:apply-templates>
                </xsl:otherwise>
            </xsl:choose>

            <xsl:if test="string-length(@longdesc) &gt; 0 or string-length(@data-copyright) &gt; 0">
              <figcaption class="article-image__caption">
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

    <xsl:template match="img" mode="placehold-image">
        <xsl:param name="maxWidth" />

        <xsl:variable name="ratio">
          <xsl:value-of select="@height div @width"/>
        </xsl:variable>

        <xsl:variable name="imageWidth">
          <xsl:choose>
            <xsl:when test="@width &lt; $maxWidth">
              <xsl:value-of select="@width"/>
            </xsl:when>
            <xsl:otherwise>
              <xsl:value-of select="$maxWidth"/>
            </xsl:otherwise>
          </xsl:choose>
        </xsl:variable>

        <xsl:variable name="imageHeight">
          <xsl:value-of select="$ratio * $imageWidth" />
        </xsl:variable>

        <div class="article-image__placeholder" >
            <amp-img alt="{@alt}" src="https://h2.ft.com/image/v1/images/raw/{@src}?source=amp&amp;fit=scale-down&amp;width={$imageWidth}" width="{$imageWidth}" height="{$imageHeight}" layout="responsive" />
        </div>
    </xsl:template>


    <xsl:template match="img" mode="dont-placehold-image">
        <xsl:param name="maxWidth" />

        <amp-img alt="{@alt}" src="https://h2.ft.com/image/v1/images/raw/{@src}?source=amp&amp;fit=scale-down&amp;width={$maxWidth}" width="{@width}" height="{@height}" layout="responsive" />
    </xsl:template>

</xsl:stylesheet>
