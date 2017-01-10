<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

  <xsl:template match="/html/body/ft-related | /html/body/promo-box">

    <aside class="n-content-related-box" role="complementary">

      <xsl:variable name="type">
        <xsl:choose>
          <xsl:when test="substring(@type, string-length(@type) - 6) = 'Article'">article</xsl:when>
          <xsl:otherwise></xsl:otherwise>
        </xsl:choose>
      </xsl:variable>

      <xsl:variable name="linkurl">
        <xsl:choose>
          <xsl:when test="$type = 'article' and current()[@url]">
            <xsl:value-of select="substring(@url, string-length(@url) - 44)" />
          </xsl:when>
          <xsl:otherwise>
            <xsl:if test="@url">
              <xsl:value-of select="@url" />
            </xsl:if>
          </xsl:otherwise>
        </xsl:choose>
      </xsl:variable>

      <xsl:choose>
        <xsl:when test="$type = 'article' and count(current()/title) = 0">
          <h3 class="n-content-related-box__title">
            <span class="n-content-related-box__title-text">Related article</span>
          </h3>
        </xsl:when>
        <xsl:otherwise>
          <xsl:apply-templates select="current()/title | current()/promo-title" mode="related-box-title" />
        </xsl:otherwise>
      </xsl:choose>

      <xsl:if test="$type = 'article'">
        <xsl:apply-templates select="current()/media/img" mode="aside-image-wrapper" >
          <xsl:with-param name="linkurl" select="$linkurl" />
        </xsl:apply-templates>
      </xsl:if>

      <xsl:apply-templates select="current()/headline | current()/promo-headline" mode="related-box-headline" >
        <xsl:with-param name="linkurl" select="$linkurl" />
      </xsl:apply-templates>

      <xsl:if test="$type != 'article'">
        <xsl:apply-templates select="current()/media/img | current()/promo-image/img" mode="aside-image-wrapper" >
          <xsl:with-param name="linkurl" select="$linkurl" />
        </xsl:apply-templates>
      </xsl:if>

      <xsl:if test="count(current()/intro) > 0 or count(current()/promo-intro) > 0">
        <div class="n-content-related-box__content">
          <xsl:apply-templates select="current()/intro/node() | current()/promo-intro/node()"/>
        </div>
      </xsl:if>

    </aside>

  </xsl:template>

  <xsl:template match="title | promo-title" mode="related-box-title">
    <h3 class="n-content-related-box__title">
      <span class="n-content-related-box__title-text">
        <xsl:apply-templates select="current()" mode="extract-content" />
      </span>
    </h3>
  </xsl:template>

  <xsl:template match="headline | promo-headline" mode="related-box-headline">
    <xsl:param name="linkurl" />

    <div class="n-content-related-box__headline">
      <xsl:choose>
        <xsl:when test="$linkurl != ''">
          <a class="n-content-related-box__headline-link" href="{$linkurl}">
            <xsl:apply-templates select="current()" mode="extract-content" />
          </a>
        </xsl:when>
        <xsl:otherwise>
          <xsl:apply-templates select="current()" mode="extract-content" />
        </xsl:otherwise>
      </xsl:choose>
    </div>
  </xsl:template>

  <xsl:template match="headline | promo-headline | title | promo-title" mode="extract-content">
    <xsl:choose>
      <xsl:when test="count(current()/p/*) > 0">
        <xsl:apply-templates select="current()/p/@* | current()/p/node()" />
      </xsl:when>
      <xsl:when test="count(current()/p) = 0">
        <xsl:apply-templates select="current()/@* | current()/node()" />
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="current()/p/text()" />
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template match="img" mode="aside-image-wrapper">
    <xsl:param name="linkurl" />
    <xsl:choose>
      <xsl:when test="$linkurl !=''">
        <a class="n-content-related-box__image-link" href="{$linkurl}">
          <xsl:copy-of select="current()" />
        </a>
      </xsl:when>
      <xsl:otherwise>
        <xsl:copy-of select="current()" />
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template match="title | promo-title" />
  <xsl:template match="headline | promo-headline" />
  <xsl:template match="ft-related/media | promo-image" />

</xsl:stylesheet>
