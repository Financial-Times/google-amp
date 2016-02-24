<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

	<xsl:template match="a[starts-with(@href, 'http://video.ft.com/') and string-length(text()) = 0]">
		<amp-brightcove
				data-account="{$brightcoveAccountId}"
				data-player="{$brightcovePlayerId}"
				data-embed="default"
				data-video-id="{substring-after(@href, 'http://video.ft.com/')}"
				layout="responsive"
				width="480" height="270">
		</amp-brightcove>
	</xsl:template>

	<xsl:template match="p[a[contains(@href, 'youtube.com/watch') and string-length(text()) = 0]]">
		<xsl:apply-templates select="a" />
	</xsl:template>

	<xsl:template match="a[contains(@href, 'youtube.com/watch') and string-length(text()) = 0]">
		<xsl:variable name="videoId">
			<xsl:choose>
				<xsl:when test="contains(@href, '&amp;')">
					<xsl:value-of select="substring-before(substring-after(@href, 'v='), '&amp;')" />
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="substring-after(@href, 'v=')" />
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>

		<amp-youtube
				data-videoid="{$videoId}"
				layout="responsive"
				width="480" height="270"></amp-youtube>
	</xsl:template>

</xsl:stylesheet>
