import { Request, Response } from "express";
import axios from "axios";

const ballDontLieBase = `https://www.balldontlie.io/api/v1`;

export let gamesPerSeason = async (req: Request, res: Response) => {
	const beginning = 2014;
	const end = 2020;
	const range = end - beginning + 1;
	const seasonsIWant = Array.from({ length: range }, (_, i) => i + beginning);
	//get the playerID - Lebron is 237
	//get the query params out
	const { playerID = 237 } = req.query;
	// const completeURI = `${ballDontLieBase}/stats?player_ids=[${playerID}]&per_page=${per_page}&seasons=${seasonsIWant}`;
	const gamesAndSeasons = [];
	for (let i in seasonsIWant) {
		const season = seasonsIWant[i];
		const completeURI = `${ballDontLieBase}/season_averages?player_ids[]=${playerID}&season=${season}`;
		//call the api
		const { data: axiosData } = await axios.get(completeURI);
		const { data } = axiosData;
		const { games_played: gamesPlayed } = data[0];
		gamesAndSeasons.push({
			season,
			games: gamesPlayed,
			playedMoreThan50: gamesPlayed > 50,
		});
	}
	res.status(200).send(gamesAndSeasons);
};

export let getThePlayers = async (req: Request, res: Response) => {
	try {
		//get the query params out
		const { query } = req;
		const { page = 0, per_page = 50, search = "" } = query;
		//call the api to get the players
		const completeURI = `${ballDontLieBase}/players?page=${page}&per_page=${per_page}&search=${search}`;
		const { data } = await axios.get(completeURI);
		//return list of players + ids
		res.status(200).send(data);
	} catch (error) {
		console.log("There was a problem fetching the players", error);
		res.status(500).json(error);
	}
};
