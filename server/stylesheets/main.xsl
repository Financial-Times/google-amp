<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

	<xsl:output method="html" encoding="UTF-8" indent="no" />

	<xsl:template match="@*|node()">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
		</xsl:copy>
	</xsl:template>

	<xsl:template match="/html/body">
		<xsl:apply-templates />
	</xsl:template>

	<xsl:include href="content/big-number.xsl" />
	<xsl:include href="amp/external-image.xsl" />
	<xsl:include href="content/pull-quotes.xsl" />
	<xsl:include href="amp/related-box.xsl" />
	<xsl:include href="amp/slideshow.xsl" />
	<xsl:include href="content/subheaders.xsl" />
	<xsl:include href="content/tables.xsl" />
	<xsl:include href="amp/video.xsl" />

</xsl:stylesheet>
