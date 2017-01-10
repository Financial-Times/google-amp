<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

    <xsl:template match="h3[contains(@class, 'ft-subhead')]">
        <h2>
            <xsl:choose>
                <xsl:when test="strong">
                    <xsl:attribute name="id">crosshead-<xsl:number /></xsl:attribute>
                    <xsl:attribute name="class">subhead subhead--crosshead</xsl:attribute>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:attribute name="class">subhead subhead--standard</xsl:attribute>
                </xsl:otherwise>
            </xsl:choose>

            <xsl:apply-templates />
        </h2>
    </xsl:template>

    <xsl:template match="h3[contains(@class, 'ft-subhead')]/strong">
        <xsl:apply-templates />
    </xsl:template>

</xsl:stylesheet>
