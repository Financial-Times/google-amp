module.exports = (image) => {
	if(!image) return null;

	return {
		description: image.description,
		width: image.width || 700,
		height: image.height || 400,
		url: encodeURIComponent(image.url),
	};
};
