import PlayersAPI from "./players";
import { Router, Express } from "express";

export let setupApis = (application: Express) => {
	const router = Router();
	const playersAPI = new PlayersAPI(router);

	playersAPI.setupApi();

	application.use("/api", router);
};

export interface API {
	setupApi(): any;
}
