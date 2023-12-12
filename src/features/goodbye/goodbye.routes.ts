import { Router } from "express";
import sayByeEndpoint from "./logic/sayBye.endpoint.js";

export default (router: Router) => {
    router.get('/goodbye', sayByeEndpoint);
}