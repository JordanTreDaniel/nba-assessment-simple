import { deriveSeasons } from "./api/players/controller";

describe("deriveSeasons", () => {
	it("will generate an array of numbers between the two years passed in, inclusively.", () => {
		const expected = [
			2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020,
			2021, 2022,
		];
		const result = deriveSeasons(2009, 2022);
		expect(result).toEqual(expected);
	});
	it("will generate an empty array if given values out of order", () => {
		const expected = [];
		const result = deriveSeasons(2022, 2009);
		expect(result).toEqual(expected);
	});
});
