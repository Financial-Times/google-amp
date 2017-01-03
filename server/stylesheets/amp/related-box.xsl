<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

  <xsl:template match="/html/body/ft-related | /html/body/promo-box">

    <aside class="c-box c-box--inline u-border--all" data-trackable="related-box" role="complementary">

      <xsl:variable name="expanderWordImage" select="55" />
      <xsl:variable name="expanderWordNoImage" select="100" />
      <xsl:variable name="expanderParaBreak" select="3" />
      <xsl:variable name="wordCount" select=" string-length(normalize-space(current()/promo-intro))
        - string-length(translate(normalize-space(current()/promo-intro),' ','')) +1" />
      <xsl:variable name="contentParas" select="count(current()/promo-intro/p)" />
      <xsl:variable name="imageCount" select="count(current()/promo-image)" />

      <xsl:variable name="expander">
        <xsl:choose>
          <xsl:when test="($contentParas > $expanderParaBreak) and (($imageCount > 0 and $wordCount > $expanderWordImage) or ($imageCount = 0 and $wordCount > $expanderWordNoImage))">true</xsl:when>
          <xsl:otherwise></xsl:otherwise>
        </xsl:choose>
      </xsl:variable>

      <xsl:if test="$expander = 'true'">
        <xsl:attribute name="data-o-component">o-expander</xsl:attribute>
        <xsl:attribute name="data-o-expander-shrink-to">0</xsl:attribute>
        <xsl:attribute name="data-o-expander-count-selector">.aside--content__extension</xsl:attribute>
        <xsl:attribute name="class">c-box c-box--inline u-border--all o-expander</xsl:attribute>
      </xsl:if>

      <xsl:variable name="type">
        <xsl:choose>
          <xsl:when test="substring(@type, string-length(@type) - 6) = 'Article'">article</xsl:when>
          <xsl:otherwise></xsl:otherwise>
        </xsl:choose>
      </xsl:variable>

      <xsl:variable name="linkurl">
        <xsl:choose>
          <xsl:when test="$type = 'article' and current()[@url]">
            <xsl:value-of select="concat('http://www.ft.com', substring(@url, string-length(@url) - 44))" />
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
          <div class="c-box__title">
            <div class="c-box__title-text u-background-color--pink">Related article</div>
          </div>
        </xsl:when>
        <xsl:otherwise>
          <xsl:apply-templates select="current()/title | current()/promo-title" mode="aside-title" />
        </xsl:otherwise>
      </xsl:choose>

      <xsl:if test="$type = 'article'">
        <xsl:apply-templates select="current()/media/img" mode="aside-image-wrapper" >
          <xsl:with-param name="linkurl" select="$linkurl" />
        </xsl:apply-templates>
      </xsl:if>

      <xsl:apply-templates select="current()/headline | current()/promo-headline" mode="aside-headline" >
        <xsl:with-param name="linkurl" select="$linkurl" />
      </xsl:apply-templates>

      <xsl:if test="$type != 'article'">
        <xsl:apply-templates select="current()/media/img | current()/promo-image/img" mode="aside-image-wrapper" >
          <xsl:with-param name="linkurl" select="$linkurl" />
        </xsl:apply-templates>
      </xsl:if>

      <xsl:apply-templates select="current()/intro | current()/promo-intro" mode="aside-intro">
          <xsl:with-param name="expander" select="$expander" />
          <xsl:with-param name="expanderParaBreak" select="$expanderParaBreak" />
      </xsl:apply-templates>

    </aside>

  </xsl:template>

  <xsl:template match="title | promo-title" mode="aside-title">
    <div class="c-box__title">
      <div class="c-box__title-text u-background-color--pink">
        <xsl:apply-templates select="current()" mode="extract-content" />
      </div>
    </div>
  </xsl:template>

  <xsl:template match="headline | promo-headline" mode="aside-headline">
    <xsl:param name="linkurl" />

    <div class="aside--headline u-margin--left-right">
      <xsl:choose>
        <xsl:when test="$linkurl != ''">
          <a data-trackable="link-headline" href="{$linkurl}">
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
    <div>
      <xsl:attribute name="class">
        <xsl:choose>
          <xsl:when test="@width &lt; 470">aside--image u-margin--left-right</xsl:when>
          <xsl:otherwise>aside--image</xsl:otherwise>
        </xsl:choose>
      </xsl:attribute>
      <xsl:choose>
        <xsl:when test="$linkurl !=''">
          <a data-trackable="link-image" href="{$linkurl}">
            <xsl:apply-templates select="current()" mode="aside-image" />
          </a>
        </xsl:when>
        <xsl:otherwise>
          <xsl:apply-templates select="current()" mode="aside-image" />
        </xsl:otherwise>
      </xsl:choose>
    </div>
  </xsl:template>

  <xsl:template match="img" mode="aside-image">
    <xsl:variable name="maxWidth" select="470" />
    <xsl:choose>
      <xsl:when test="count(current()[@width][@height]) = 1">
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
  </xsl:template>

  <xsl:template match="intro | promo-intro" mode="aside-intro">
    <xsl:param name="expander" />
    <xsl:param name="expanderParaBreak" />
    <xsl:choose>
      <xsl:when test="$expander = 'true'">
        <div class="aside--content u-margin--left-right o-expander__content">
            <xsl:apply-templates select="current()/p[position() &lt;= $expanderParaBreak]"/>
          <div class="aside--content__extension">
            <xsl:apply-templates select="current()/p[position() > $expanderParaBreak]"/>
          </div>
        </div>
        <button class="o-expander__toggle o--if-js u-margin--left-right" data-trackable="expander-toggle"></button>
      </xsl:when>
      <xsl:otherwise>
        <div class="aside--content u-margin--left-right">
            <xsl:apply-templates />
        </div>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template match="title | promo-title" />
  <xsl:template match="headline | promo-headline" />
  <xsl:template match="ft-related/media | promo-image" />
  <xsl:template match="intro | promo-intro" />

</xsl:stylesheet>