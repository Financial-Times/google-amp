<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

    <xsl:template match="a[starts-with(@href, 'http://video.ft.com/') and string-length(text()) = 0]">
        <div class="article__video-wrapper ng-media-wrapper"
            data-n-component="n-video"
            data-n-video-source="brightcove"
            data-n-video-id="{substring-after(@href, 'http://video.ft.com/')}">
            <xsl:if test="$useBrightcovePlayer">
                <xsl:attribute name="data-n-video-player">brightcove</xsl:attribute>
            </xsl:if>
        </div>
    </xsl:template>

</xsl:stylesheet>
