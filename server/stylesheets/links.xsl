<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

    <xsl:template match="a">
        <a href="{@href}" data-trackable="link">
            <xsl:apply-templates />
        </a>
    </xsl:template>

</xsl:stylesheet>
