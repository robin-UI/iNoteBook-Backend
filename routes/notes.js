const express = require('express');
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser')
const Notes = require('../models/Notes');

const router = express.Router();

//Rout - 1: Get login a user detail using POST: /api/notes/fetchallnotes
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id })
        res.json(notes)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Some error occured")
    }
})

//Rout - 2: Add a new note using POST: /api/notes/fetchallnotes
router.post('/addnotes', fetchuser, [
    body('title', "Enter a valid titl").isLength({ min: 3 }),
    body('description', "Description must have minimum six carrector").isLength({ min: 5 }),
], async (req, res) => {

    try {


        const { title, description, tag } = req.body

        //if there are error in user sumission it will return the error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const notes = new Notes({
            title, description, tag, user: req.user.id
        })

        const saveNote = await notes.save()

        res.json(saveNote)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Some error occured")
    }
})

//Rout - 3: Updatee an existing using PUT: /api/notes/updatenote/:id
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;

    try {
        //Create new note object
        const newNote = {}
        if (title) { newNote.title = title }
        if (description) { newNote.description = description }
        if (tag) { newNote.tag = tag }

        //Find the note to update and update it
        let note = await Notes.findById(req.params.id)
        if (!note) { return res.status(404).send("Not found") }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed")
        }

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note })
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Some error occured")
    }

})

//Rout - 4: Delete an existing note using DELETE: /api/notes/deletenote/:id
router.delete('/deletenote/:id', fetchuser, async (req, res) => {

    try {
        //Find the note to delete and delete it
        let note = await Notes.findById(req.params.id)
        if (!note) { return res.status(404).send("Not found") }
    
        //Allow only when the user own this note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed")
        }
    
        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({ "Success": "This note has been deleted", note: note })
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Some error occured")
    }

})


module.exports = router