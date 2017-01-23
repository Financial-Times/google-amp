'use strict';

const {expect} = require('../utils/chai');
const extractMainImage = require('../../server/lib/transforms/extra/extract-main-image');
const cheerio = require('cheerio');

describe('main image transform', () => {
	it('should remove and return main image that\'s a first child', () => {
		const $ = cheerio.load('<figure class="article-image--full">image</figure><p>lorem ipsum dolor sit amet</p>');
		expect(extractMainImage($)).dom.to.equal('<figure class="article-image--full">image</figure>');
		expect($.html()).dom.to.equal('<p>lorem ipsum dolor sit amet</p>');
	});

	it('should remove and return main image whose parent is the first child', () => {
		const $ = cheerio.load('<div><figure class="article-image--full">image</figure></div><p>lorem ipsum dolor sit amet</p>');
		expect(extractMainImage($)).dom.to.equal('<figure class="article-image--full">image</figure>');
		expect($.html()).dom.to.equal('<div></div><p>lorem ipsum dolor sit amet</p>');
	});

	it('should leave non-first-child main image alone', () => {
		const $ = cheerio.load('<p>lorem ipsum dolor sit amet</p><figure class="article-image--full">image</figure>');
		expect(extractMainImage($)).to.be.undefined();
		expect($.html()).dom.to.equal('<p>lorem ipsum dolor sit amet</p><figure class="article-image--full">image</figure>');
	});

	it('should remove and return slideshow that\'s a first child', () => {
		const $ = cheerio.load('<ft-slideshow></ft-slideshow><p>lorem ipsum dolor sit amet</p>');
		expect(extractMainImage($)).dom.to.equal('<ft-slideshow></ft-slideshow>');
		expect($.html()).dom.to.equal('<p>lorem ipsum dolor sit amet</p>');
	});

	it('should remove and return slideshow whose parent is the first child', () => {
		const $ = cheerio.load('<div><ft-slideshow></ft-slideshow></div><p>lorem ipsum dolor sit amet</p>');
		expect(extractMainImage($)).dom.to.equal('<ft-slideshow></ft-slideshow>');
		expect($.html()).dom.to.equal('<div></div><p>lorem ipsum dolor sit amet</p>');
	});

	it('should leave non-first-child slideshow alone', () => {
		const $ = cheerio.load('<p>lorem ipsum dolor sit amet</p><ft-slideshow></ft-slideshow>');
		expect(extractMainImage($)).to.be.undefined();
		expect($.html()).dom.to.equal('<p>lorem ipsum dolor sit amet</p><ft-slideshow></ft-slideshow>');
	});
});
