<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

    <xsl:output method="html" encoding="UTF-8" indent="no" />

    <xsl:template match="@*|node()">
        <xsl:copy>
            <xsl:apply-templates select="@*|node()"/>
        </xsl:copy>
    </xsl:template>

    <xsl:include href="next/big-number.xsl" />
    <xsl:include href="next/blockquotes.xsl" />
    <xsl:include href="external-image.xsl" />
    <xsl:include href="next/interactive-graphics.xsl" />
    <xsl:include href="./amp-links.xsl" />
    <xsl:include href="next/pull-quotes.xsl" />
    <xsl:include href="./amp-related-box.xsl" />
    <xsl:include href="next/slideshow.xsl" />
    <xsl:include href="next/subheaders.xsl" />
    <xsl:include href="next/tables.xsl" />
    <xsl:include href="next/toc.xsl" />
    <xsl:include href="video.xsl" />

</xsl:stylesheet>
