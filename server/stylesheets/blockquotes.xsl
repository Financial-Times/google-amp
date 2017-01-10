<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

    <xsl:template match="blockquote">
      <blockquote class="{concat('n-content-blockquote ', @class)}">
        <xsl:if test="current()[.//a[starts-with(@href, 'https://twitter.com/')]]">
          <xsl:attribute name="class">
            <xsl:value-of select="concat('n-content-blockquote n-content-blockquote--tweet ', @class)"/>
          </xsl:attribute>
          <xsl:variable name="tweetHref" select="a[starts-with(@href, 'https://twitter.com/')][last()]/@href" />
          <xsl:variable name="tweetId">
            <xsl:call-template name="substring-after-last">
              <xsl:with-param name="value" select="$tweetHref" />
              <xsl:with-param name="separator" select="'/'" />
            </xsl:call-template>
          </xsl:variable>
          <xsl:attribute name="data-tweet-id">
            <xsl:value-of select="$tweetId" />
          </xsl:attribute>
        </xsl:if>
        <xsl:apply-templates />
      </blockquote>
    </xsl:template>

    <xsl:template name="substring-after-last">
      <xsl:param name="value" />
      <xsl:param name="separator" />
      <xsl:choose>
        <xsl:when test="contains($value, $separator)">
          <xsl:call-template name="substring-after-last">
            <xsl:with-param name="value" select="substring-after($value, $separator)" />
            <xsl:with-param name="separator" select="$separator" />
          </xsl:call-template>
        </xsl:when>
        <xsl:otherwise>
          <xsl:value-of select="$value" />
        </xsl:otherwise>
      </xsl:choose>
    </xsl:template>

</xsl:stylesheet>
