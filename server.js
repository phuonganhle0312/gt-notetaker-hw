// require express
const express = require("express");
// require path
const path = require("path");
// require fs
const fs = require("fs");


// create an instance of express
const app = express();
// add a port
const PORT = process.env.PORT || 3000;

// sets up the express app to handle data parsing
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(path.join(__dirname, "Develop/public")));


// GET requests
// View / HTML
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "Develop/public/index.html"));
});
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "Develop/public/notes.html"));
});

// API/JSON
// retrieve note data
app.get("/api/notes", function (req, res) {
    fs.readFile("Develop/db/db.json", "utf-8", (err, data) => {
        if (err) {
            console.log("An error has occured reading your data.")
        }
    res.json(JSON.parse(data));
    });
});

// post note data
app.post("/api/notes", function (req, res) { // read and parse data from json
    fs.readFile("Develop/db/db.json", "utf-8", (err, data) => {
        if (err) {
            console.log("An error has occured reading your data.")
        };
        const notesData = [];
        notesData.push(JSON.parse(data));
        const note = { ...req.body, id: notesData.length};
        notesData.push(note);

        fs.writeFile("Develop/db/db.json", JSON.stringify(notesData), "utf-8", (err) => {
            if (err) 
                throw err;
            

            console.log("Your note has been posted.");

            res.json(notesData);
        });
    });
    // delete note
    app.delete("/api/notes/:id", function (req, res) {
        fs.readFile("Develop/db/db.json", "utf-8", (err, data) => {
            if (err) {
                console.log("An error has occured reading your data.")
            };
            const notesData = JSON.parse(data);
            const toDelete = notesData.filter((note) => note.id != parseInt(req.params.id));
            fs.writeFile("Develop/db/db.json", JSON.stringify(toDelete), "utf-8", (err) => {
                if (err) 
                    throw err;
                

                console.log("Your note has been deleted.");

            });
            res.json(toDelete);
        });
    });
    });
    // listen on port
    app.listen(PORT, (req, res) => {
        console.log(`Currently running on http://localhost:${PORT}`);
    });

