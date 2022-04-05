import * as playersController from "./controller";
import { Router } from "express";
import { API } from "..";

export default class PlayersAPI implements API {
	private router: Router;

	constructor(router: Router) {
		this.router = router;
	}

	setupApi() {
		this.router.get(
			"/players/:playerID/gamesPerSeason",
			playersController.gamesPerSeason
		);
		this.router.get("/players/getThePlayers", playersController.getThePlayers);
	}
}
