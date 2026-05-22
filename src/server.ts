import app from "./app";
import config from "./config"


const main = () => {
    const port = config.port;
    app.listen(port, () =>{
        console.log(`app listing on port ${port}`);
    })
}