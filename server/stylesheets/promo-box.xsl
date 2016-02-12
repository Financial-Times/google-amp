<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

    <xsl:template match="/html/body/promo-box">
      <xsl:variable name="expanderWordImage" select="55" />
      <xsl:variable name="expanderWordNoImage" select="100" />
      <xsl:variable name="expanderParaBreak" select="3" />
      <xsl:variable name="wordCount" select=" string-length(normalize-space(current()/promo-intro))
        - string-length(translate(normalize-space(current()/promo-intro),' ','')) +1" />
      <xsl:variable name="contentParas" select="count(current()/promo-intro/p)" />
      <xsl:variable name="imageCount" select="count(current()/promo-image)" />

      <xsl:choose>
        <xsl:when test="($contentParas > $expanderParaBreak) and (($imageCount > 0 and $wordCount > $expanderWordImage) or ($imageCount = 0 and $wordCount > $expanderWordNoImage))">
          <aside class="c-box c-box--inline u-border--all o-expander" data-trackable="promobox" role="complementary" data-o-component="o-expander" data-o-expander-shrink-to="0" data-o-expander-count-selector=".aside--content__extension">
            <xsl:apply-templates />
          </aside>
        </xsl:when>
        <xsl:otherwise>
          <aside class="c-box c-box--inline u-border--all" data-trackable="promobox" role="complementary">
            <xsl:apply-templates />
          </aside>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:template>

    <xsl:template match="promo-title">
      <xsl:apply-templates select="current()" mode="aside-title" />
    </xsl:template>

    <xsl:template match="promo-headline">
      <xsl:apply-templates select="current()" mode="aside-headline" />
    </xsl:template>

    <xsl:template match="promo-image">
      <xsl:apply-templates select="current()/img" mode="aside-image-wrapper" />
    </xsl:template>

    <xsl:template match="promo-intro">
      <xsl:variable name="expanderParaBreakPoint" select="3" />
      <xsl:variable name="contentParagraphs" select="count(p)" />
      <xsl:choose>
        <xsl:when test="$contentParagraphs > $expanderParaBreakPoint">
          <div class="aside--content o-expander__content u-margin--left-right">
              <xsl:apply-templates select="current()/p[position() &lt;= $expanderParaBreakPoint]"/>
            <div class="aside--content__extension">
              <xsl:apply-templates select="current()/p[position() > $expanderParaBreakPoint]"/>
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

    <xsl:template match="ul">
      <ul class="aside--list">
        <xsl:apply-templates />
      </ul>
    </xsl:template>

</xsl:stylesheet>
