import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
//import { nanoid } from "nanoid"
import { onSnapshot,addDoc, deleteDoc, doc, setDoc } from "firebase/firestore"
import { notesCollection, db} from "./firebase"

//onSnapshot is a function that attaches event listener to listen to the db. 

//Document and Collection
//Unit of storage in FireStore is document. Document is a record which contains fields and value mapped to each field.

//Complex data in a document is called maps.

//Collection is a container for documents. For example, you can have users collection with each user as a different doc.

export default function App() {
    const [notes, setNotes] = React.useState([])
        //() => JSON.parse(localStorage.getItem("notes")) || [])

    const [currentNoteId, setCurrentNoteId] = React.useState("")
    
    const currentNote = 
        notes.find(note => note.id === currentNoteId) 
        || notes[0]

    const sortedNotes = notes.sort((a,b) => b.updatedAt - a.updatedAt)

// ** We are no longer using localStorage to store and retrieve data/notes. **//
    // React.useEffect(() => {
    //     localStorage.setItem("notes", JSON.stringify(notes))
    // }, [notes])


// ** Access FireStore to get the data using snapshot **//

    React.useEffect(()=> {
        const unsubscribe = onSnapshot(notesCollection,function(snapshot){
            const notesArr = snapshot.docs.map(doc => ({
                ...doc.data(),
                id:doc.id
            }))
            
            setNotes(notesArr)
        })
        return unsubscribe
    },[])

    React.useEffect(()=> {
        if(!currentNote){
            setCurrentNoteId(notes[0]?.id)
        }
    },notes)

    async function createNewNote() {
        
        const newNote = {
            //id: nanoid(),
            body: "# Type your markdown note's title here",
            createdAt : Date.now(),
            updatedAt : Date.now()
        }
        //setNotes(prevNotes => [newNote, ...prevNotes])
        const newNoteRef = await addDoc(notesCollection,newNote)
        setCurrentNoteId(newNoteRef.id)
    }

    async function updateNote(text) {
        const docRef = doc(db, "notes", currentNoteId)
        await setDoc(docRef, {body : text, updatedAt : Date.now()}, {merge: true})
        // setNotes(oldNotes => {
        //     const newArray = []
        //     for (let i = 0; i < oldNotes.length; i++) {
        //         const oldNote = oldNotes[i]
        //         if (oldNote.id === currentNoteId) {
        //             // Put the most recently-modified note at the top
        //             newArray.unshift({ ...oldNote, body: text })
        //         } else {
        //             newArray.push(oldNote)
        //         }
        //     }
        //     return newArray
        }
    

    async function deleteNote(noteId) {

        const docRef = doc(db,"notes",noteId)
        await deleteDoc(docRef)


        // event.stopPropagation()
        // setNotes(oldNotes => oldNotes.filter(note => note.id !== noteId))
    }

    return (
        <main>
            {
                notes.length > 0
                    ?
                    <Split
                        sizes={[30, 70]}
                        direction="horizontal"
                        className="split"
                    >
                        <Sidebar
                            notes={sortedNotes}
                            currentNote={currentNote}
                            setCurrentNoteId={setCurrentNoteId}
                            newNote={createNewNote}
                            deleteNote={deleteNote}
                        />
                        {
                            // currentNoteId &&
                            // notes.length > 0 &&
                            <Editor
                                currentNote={currentNote}
                                updateNote={updateNote}
                            />
                        }
                    </Split>
                    :
                    <div className="no-notes">
                        <h1>You have no notes</h1>
                        <button
                            className="first-note"
                            onClick={createNewNote}
                        >
                            Create one now
                </button>
                    </div>

            }
        </main>
    )
}
