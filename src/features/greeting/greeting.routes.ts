import { Router } from "express";
import greetEndpoint from "./logic/greet.endpoint.js";

export default (router: Router) => {
    router.get('/', greetEndpoint);
}