import { Request, Response } from "express";
import axios from "axios";

const ballDontLieBase = `https://www.balldontlie.io/api/v1`;

export const deriveSeasons = (beginning: number, end: number): number[] => {
	const range = end - beginning + 1;
	const seasonsIWant = Array.from({ length: range }, (_, i) => i + beginning);
	return seasonsIWant;
};

export type gamesPlayedForSeason = {
	season: number;
	games: number;
	playedMoreThan50: boolean;
};

export const fetchGamesPlayedPerSeason = async (
	playerID: number,
	season: number
): Promise<gamesPlayedForSeason> => {
	const completeURI = `${ballDontLieBase}/season_averages?player_ids[]=${playerID}&season=${season}`;
	//call the api
	const { data: axiosData } = await axios.get(completeURI);
	const { data } = axiosData;
	const { games_played: gamesPlayed } = data[0];
	const result = {
		season,
		games: gamesPlayed,
		playedMoreThan50: gamesPlayed > 50,
	};
	return result;
};

export let gamesPerSeason = async (req: Request, res: Response) => {
	//get the playerID - Lebron is 237
	//get the query params out
	const { playerID = "237" } = req.query;
	// const completeURI = `${ballDontLieBase}/stats?player_ids=[${playerID}]&per_page=${per_page}&seasons=${seasonsIWant}`;
	const seasonsAndGames: gamesPlayedForSeason[] = [];
	const seasonsIWant: number[] = deriveSeasons(2014, 2020);
	let moreThan50: number = 0;
	for (let i in seasonsIWant) {
		const season: number = seasonsIWant[i];
		const result: gamesPlayedForSeason = await fetchGamesPlayedPerSeason(
			Number(playerID),
			season
		);
		const { playedMoreThan50 } = result;
		if (playedMoreThan50) moreThan50++;
		seasonsAndGames.push(result);
	}
	res.status(200).send({
		seasonsAndGames,
		moreThan50,
		lessThan50: seasonsIWant.length - moreThan50,
	});
};

export let getThePlayers = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		//get the query params out
		const { query } = req;
		//Could make a type here to assign the variables on line 58 types, but what would be the point
		const { page = 0, per_page = 50, search = "" } = query;
		//call the api to get the players
		const completeURI: string = `${ballDontLieBase}/players?page=${page}&per_page=${per_page}&search=${search}`;
		const { data } = await axios.get(completeURI);
		//return list of players + ids
		res.status(200).json(data);
	} catch (error) {
		console.log("There was a problem fetching the players", error);
		res.status(500).json(error);
	}
};
