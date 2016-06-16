<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

	<xsl:variable name="lowercase" select="'abcdefghijklmnopqrstuvwxyz'"/>
	<xsl:variable name="uppercase" select="'ABCDEFGHIJKLMNOPQRSTUVWXYZ'"/>

	<xsl:template match="a[@data-asset-type='interactive-graphic']">
		<xsl:if test="translate(substring(@href, 0, 6), $uppercase, $lowercase) = 'https'">

			<amp-iframe
				src="{@href}"
				sandbox="allow-scripts allow-same-origin"
				layout="responsive"
				frameborder="0"
				width="{@data-width}" height="{@data-height}">
			</amp-iframe>

		</xsl:if>
	</xsl:template>

</xsl:stylesheet>
