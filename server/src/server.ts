import 'dotenv/config'
import express from "express";
import { connectToDB } from "./db";
import cors from "cors";
import morgan from "morgan";
import { ok } from "./utils/envelope";
import {notFound} from "./middleware/notFound";
import { errorHandler } from "./middleware/errorHandler";

async function mainEntryFun() {
    await connectToDB();

    const app = express();

    const corsOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000').split(',').map(origin => origin.trim()).filter(Boolean)

    app.use(
        cors({
            origin: corsOrigins,
            credentials: true
        })
    )

    app.use(express.json());
    app.use(morgan('dev'));

    app.get('/', (_req, res) => {
        res.status(200).json(ok({ message: 'Server is running' }))
    })

    app.use(notFound);
    app.use(errorHandler);

    const port = Number(process.env.PORT || 5000);

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    })
}

mainEntryFun().catch(err => {
    console.log("Failed to start", err);
    process.exit(1);
})