<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

    <xsl:template match="blockquote">
        <blockquote class="article__quote article__quote--full-quote aside--content c-box u-border--left u-padding--left-right">
            <xsl:apply-templates />
        </blockquote>
    </xsl:template>

    <xsl:template match="blockquote[@class='twitter-tweet']">
        <xsl:variable name="tweetHref" select="a[starts-with(@href, 'https://twitter.com/')][last()]/@href" />
        <xsl:variable name="tweetId">
            <xsl:call-template name="substring-after-last">
                <xsl:with-param name="value" select="$tweetHref" />
                <xsl:with-param name="separator" select="'/'" />
            </xsl:call-template>
        </xsl:variable>
        <amp-twitter width="600" height="250" layout="responsive" data-tweetid="{$tweetId}" data-cards="hidden"></amp-twitter>
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
