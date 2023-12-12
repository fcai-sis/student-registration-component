
import helmet from 'helmet';
import express, { NextFunction, Request, Response } from 'express';
import compression from 'compression';
import cors from "cors";
import env, { validateEnvironmentVariables } from './env.js';
import router from './router.js';

validateEnvironmentVariables();

const app = express();

app.use(helmet())
app.disable('x-powered-by')

app.use(compression());

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', router());

// last app.use calls right before app.listen():

// TODO: custom 404
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).send("Sorry can't find that!")
})

// TODO: custom error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.listen(env.PORT, () => {
    console.log('Running on port ' + env.PORT);
});
