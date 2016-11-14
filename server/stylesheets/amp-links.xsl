<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

	<xsl:template match="a">
		<a href="{@href}">
			<xsl:apply-templates />
		</a>
	</xsl:template>

	<!-- Match against relative links -->
	<xsl:template match="a[starts-with(@href, '/content')]">
		<a href="https://www.ft.com{@href}">
			<xsl:apply-templates />
		</a>
	</xsl:template>

</xsl:stylesheet>
