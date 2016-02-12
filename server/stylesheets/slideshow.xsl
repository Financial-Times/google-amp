<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

    <xsl:template match="p[a[substring(@href, string-length(@href) - 6) = '#slide0' and normalize-space(string()) = '']]">

        <xsl:apply-templates select="a[substring(@href, string-length(@href) - 6) = '#slide0' and normalize-space(string()) = '']" />

        <xsl:if test="normalize-space(string()) != ''">
          <p>
            <xsl:apply-templates select="./node()[not(self::a[substring(@href, string-length(@href) - 6) = '#slide0' and normalize-space(string()) = ''])]" />
          </p>
        </xsl:if>
    </xsl:template>

    <xsl:template match="a[substring(@href, string-length(@href) - 6) = '#slide0' and normalize-space(string()) = '']">
      <!-- assume href is of the format .*[UUID].html#slide0 -->
      <ft-slideshow data-uuid="{substring-before(substring(@href, string-length(@href) - 47), '.html#slide0')}" />
    </xsl:template>

</xsl:stylesheet>
