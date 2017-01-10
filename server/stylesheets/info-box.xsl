<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

    <!-- If a table has only a single column, it isn't a table it's an info box!-->
    <xsl:template match="/html/body/table[count(tr/td) = 1]">
      <aside class="n-content-info-box">
        <xsl:if test="count(caption) = 1">
          <h3 class="n-content-info-box__headline"><xsl:value-of select="caption" /></h3>
        </xsl:if>
        <div class="n-content-info-box__content">
          <xsl:apply-templates select="tr/td/node()" />
        </div>
      </aside>
    </xsl:template>

</xsl:stylesheet>
