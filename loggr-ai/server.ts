import express, { Request, Response } from 'express';
import cors from 'cors';
import { loggr } from './main';

const app = express();
app.use(express.json());
app.use(cors({
    origin: '*',
}))

app.post('/loggrai', async (req: Request, res: Response) => {
    try {
        const { message, result, status = 400 } = await loggr(req.body.input);
        res.status(status).json({ message, result });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

const port = 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));