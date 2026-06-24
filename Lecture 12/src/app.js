require("dotenv").config({ path: "./env" });

import cookieparser from "cookie-parser";
export const app = express();
// connectDB()
// .then( () => {

// })
// .catch(err){
//     console.log(err)
app.use(
	cors({
		origin: process.env.CORS_ORIGIN,
		credentials: true,
	}),
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(express.static("public"));
app.use(cookieparser());
// }
